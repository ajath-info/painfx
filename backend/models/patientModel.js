import { db } from "../config/db.js";

const patientModel = {
  // patient can add or remove doctor from own favorite list
  toggleFavoriteDoctor: async (patient_id, doctor_id) => {
    const [rows] = await db.query(
      `SELECT id FROM favorite_doctors WHERE patient_id = ? AND doctor_id = ?`,
      [patient_id, doctor_id]
    );

    if (rows.length > 0) {
      // Already favorited, so remove it
      await db.query(
        `DELETE FROM favorite_doctors WHERE patient_id = ? AND doctor_id = ?`,
        [patient_id, doctor_id]
      );
      return { action: "removed" };
    } else {
      // Not favorited, so add
      await db.query(
        `INSERT INTO favorite_doctors (patient_id, doctor_id) VALUES (?, ?)`,
        [patient_id, doctor_id]
      );
      return { action: "added" };
    }
  },

  // list of favorite doctor for patient
  getFavoriteDoctors: async (patient_id, limit, offset) => {
    // Get doctor list
    const [doctorRows] = await db.query(
      `SELECT u.*
     FROM favorite_doctors fd
     JOIN users u ON fd.doctor_id = u.id
     WHERE fd.patient_id = ? AND u.role = 'doctor' AND u.status = '1'
     ORDER BY fd.created_at DESC
     LIMIT ? OFFSET ?`,
      [patient_id, limit, offset]
    );

    const [countRows] = await db.query(
      `SELECT COUNT(*) AS count
     FROM favorite_doctors fd
     JOIN users u ON fd.doctor_id = u.id
     WHERE fd.patient_id = ? AND u.role = 'doctor' AND u.status = '1'`,
      [patient_id]
    );

    const total = countRows[0].count;
    if (doctorRows.length === 0) return { total, rows: [] };

    const doctorIds = doctorRows.map((d) => d.id);

    // Batch queries
    const [educations] = await db.query(
      `SELECT * FROM educations WHERE doctor_id IN (?) ORDER BY year_of_passing DESC`,
      [doctorIds]
    );

    const [specializations] = await db.query(
      `SELECT ds.doctor_id, s.id, s.name
     FROM doctor_specializations ds
     JOIN specializations s ON s.id = ds.specialization_id
     WHERE ds.doctor_id IN (?) AND ds.status = '1'`,
      [doctorIds]
    );

    const [services] = await db.query(
      `SELECT ds.doctor_id, sv.id, sv.name
     FROM doctor_services ds
     JOIN services sv ON sv.id = ds.services_id
     WHERE ds.doctor_id IN (?) AND ds.status = '1'`,
      [doctorIds]
    );

    const [ratings] = await db.query(
      `SELECT doctor_id, AVG(rating) AS avg_rating, COUNT(*) AS total_ratings
     FROM rating
     WHERE doctor_id IN (?) AND status = '1'
     GROUP BY doctor_id`,
      [doctorIds]
    );

    const [availabilities] = await db.query(
      `SELECT doctor_id, day 
     FROM doctor_availability 
     WHERE doctor_id IN (?)`,
      [doctorIds]
    );

    // Group by doctor_id
    const groupBy = (arr, key) =>
      arr.reduce((acc, item) => {
        acc[item[key]] = acc[item[key]] || [];
        acc[item[key]].push(item);
        return acc;
      }, {});

    const eduMap = groupBy(educations, "doctor_id");
    const specMap = groupBy(specializations, "doctor_id");
    const servMap = groupBy(services, "doctor_id");
    const availMap = groupBy(availabilities, "doctor_id");
    const ratingMap = ratings.reduce((acc, r) => {
      acc[r.doctor_id] = {
        average_rating: Number(parseFloat(r.avg_rating).toFixed(1)),
        total_ratings: r.total_ratings || 0,
      };
      return acc;
    }, {});

    // Format final result
    const result = doctorRows.map((doctor) => {
      const doctorId = doctor.id;

      // Determine next available date
      const availability = availMap[doctorId] || [];
      const findNextAvailableDate = () => {
        const today = new Date();
        for (let i = 0; i < 14; i++) {
          const checkDate = new Date();
          checkDate.setDate(today.getDate() + i);
          const weekday = checkDate.toLocaleDateString("en-US", {
            weekday: "long",
          });
          if (availability.find((a) => a.day === weekday)) {
            return checkDate.toISOString().split("T")[0];
          }
        }
        return null;
      };

      const nextAvailableDate = findNextAvailableDate();

      return {
        doctor_id: doctorId,
        prefix: doctor.prefix,
        f_name: doctor.f_name,
        l_name: doctor.l_name,
        bio: doctor.bio,
        profile_image: doctor.profile_image,
        education: eduMap[doctorId] || [],
        specialization: specMap[doctorId] || [],
        services: servMap[doctorId] || [],
        average_rating: ratingMap[doctorId]?.average_rating || 0,
        total_ratings: ratingMap[doctorId]?.total_ratings || 0,
        address_line1: doctor.address_line1,
        address_line2: doctor.address_line2,
        city: doctor.city,
        state: doctor.state,
        country: doctor.country,
        consultation_fee: doctor.consultation_fee,
        consultation_fee_type: doctor.consultation_fee_type,
        next_available: nextAvailableDate || "Not Available",
      };
    });

    return { total, rows: result };
  },

  // Doctor's patient list with pagination on the basis of appointment booked
  getDoctorPatients: async (doctor_id, limit, offset) => {
    // Count total unique patients
    const [countRows] = await db.query(
      `SELECT COUNT(DISTINCT a.user_id) AS total
       FROM appointments a
       JOIN users u ON a.user_id = u.id
       WHERE a.doctor_id = ?`,
      [doctor_id]
    );

    const total = countRows[0]?.total || 0;
    if (total === 0) return { total: 0, patients: [] };

    // Get paginated unique patients with last appointment
    const [rows] = await db.query(
      `SELECT 
         u.id AS patient_id,
         u.f_name, u.l_name, u.full_name, u.user_name, u.email, u.phone, u.phone_code, u.gender,
         u.profile_image, u.DOB, u.city, u.state, u.country,
         MAX(a.appointment_date) AS last_appointment_date
       FROM appointments a
       JOIN users u ON a.user_id = u.id
       WHERE a.doctor_id = ?
       GROUP BY u.id
       ORDER BY last_appointment_date DESC
       LIMIT ? OFFSET ?`,
      [doctor_id, limit, offset]
    );

    return { total, patients: rows };
  },

  // get patient by id
  getById: async (id) => {
    const [rows] = await db.query(
      `SELECT * FROM users WHERE id = ? AND role = 'patient'`,
      [id]
    );
    return rows[0];
  },

  // update patient profile
  update: async (id, data) => {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const updateQuery = `UPDATE users SET ${fields.join(
      ", "
    )} WHERE id = ? AND role = 'patient'`;
    await db.query(updateQuery, values);
  },
};

export default patientModel;
