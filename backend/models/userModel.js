// models/userModel.js
import { db } from "../config/db.js";

const userModel = {
  // doctor/patient for clinic and admin clinic can only see own doctor and patient
  getUsersByRole: async (role, filters, pagination, requester) => {
    const { search } = filters;
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    const requesterRole = requester.role;
    const clinicId = requesterRole === "clinic" ? requester.id : null;

    let params = [];
    let countParams = [];

    // ---------- Base SELECT ----------
    let baseQuery = `
    SELECT u.id, u.prefix, u.f_name, u.l_name, u.full_name, u.user_name,
           u.profile_image, u.status, u.created_at, u.updated_at, u.phone, u.DOB, u.city`;

    if (role === "doctor") {
      baseQuery += `,
      IFNULL(SUM(
        CASE 
          WHEN a.payment_status = 'paid' AND a.status != 'cancelled'
          ${clinicId ? "AND a.clinic_id = ?" : ""}
          THEN a.amount ELSE 0 END
      ), 0) AS earning`;
      if (clinicId) params.push(clinicId);
    } else {
      baseQuery += `,
      (
        SELECT IFNULL(SUM(a2.amount), 0)
        FROM appointments a2
        WHERE a2.user_id = u.id 
          AND a2.payment_status = 'paid' 
          AND a2.status != 'cancelled'
          ${clinicId ? "AND a2.clinic_id = ?" : ""}
      ) AS total_paid,
      (
        SELECT MAX(a3.appointment_date)
        FROM appointments a3
        WHERE a3.user_id = u.id 
          AND a3.status = 'completed'
          ${clinicId ? "AND a3.clinic_id = ?" : ""}
      ) AS last_appointment`;
      if (clinicId) {
        params.push(clinicId); // total_paid
        params.push(clinicId); // last_appointment
      }
    }

    // ---------- FROM and JOIN ----------
    if (role === "doctor") {
      baseQuery += `
      FROM users u
      LEFT JOIN appointments a ON a.doctor_id = u.id`;
    } else {
      baseQuery += ` FROM users u`;
    }

    // ---------- WHERE conditions ----------
    let whereClause = ` WHERE u.role = ?`;
    params.push(role);
    countParams.push(role);

    if (search) {
      whereClause += ` AND (u.full_name LIKE ? OR u.phone LIKE ? OR u.user_name LIKE ?)`;
      const like = `%${search}%`;
      params.push(like, like, like);
      countParams.push(like, like, like);
    }

    // Restrict for clinic
    if (requesterRole === "clinic") {
      if (role === "doctor") {
        whereClause += ` AND u.id IN (
        SELECT doctor_id FROM clinic_doctors 
        WHERE clinic_id = ?
      )`;
        params.push(clinicId);
        countParams.push(clinicId);
      } else {
        // Patient
        whereClause += ` AND u.id IN (
        SELECT DISTINCT user_id FROM appointments 
        WHERE clinic_id = ?
      )`;
        params.push(clinicId);
        countParams.push(clinicId);
      }
    }

    // ---------- GROUP, ORDER, LIMIT ----------
    baseQuery += `
    ${whereClause}
    GROUP BY u.id
    ORDER BY u.created_at DESC
    LIMIT ? OFFSET ?`;

    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await db.query(baseQuery, params);

    // ---------- Total Count ----------
    const [countResult] = await db.query(
      `SELECT COUNT(*) AS total FROM users u ${whereClause}`,
      countParams
    );
    const total = countResult[0].total;

    return { users: rows, total };
  },

  // doctor profile
  getDoctorProfile: async (id) => {
    const [[doctor]] = await db.query(
      "SELECT * FROM users WHERE id = ? AND role = 'doctor'",
      [id]
    );
    if (!doctor) return null;

    const [educations] = await db.query(
      "SELECT * FROM educations WHERE doctor_id = ?",
      [id]
    );
    const [experiences] = await db.query(
      "SELECT * FROM experiences WHERE doctor_id = ?",
      [id]
    );
    const [memberships] = await db.query(
      "SELECT * FROM memberships WHERE doctor_id = ?",
      [id]
    );
    const [awards] = await db.query(
      "SELECT * FROM awards WHERE doctor_id = ?",
      [id]
    );
    const [registration] = await db.query(
      "SELECT * FROM doctor_registration WHERE doctor_id = ?",
      [id]
    );
    const [availability] = await db.query(
      "SELECT * FROM doctor_availability WHERE doctor_id = ?",
      [id]
    );
    const [unavailability] = await db.query(
      "SELECT * FROM doctor_unavailability WHERE doctor_id = ?",
      [id]
    );
    const [ratings] = await db.query(
      `SELECT r.*, 
       u.full_name AS name, 
       u.profile_image AS image
      FROM rating r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.doctor_id = ?
      ORDER BY r.created_at DESC`,
      [id]
    );

    const [specializations] = await db.query(
      `SELECT ds.id AS doctor_specialization_id, ds.status, ds.created_at, ds.updated_at, s.id AS specialization_id, s.name
       FROM doctor_specializations ds
       JOIN specializations s ON s.id = ds.specialization_id
       WHERE ds.doctor_id = ?`,
      [id]
    );

    const [services] = await db.query(
      `SELECT ds.id AS doctor_service_id, ds.status, ds.created_at, ds.updated_at, s.id AS services_id, s.name
       FROM doctor_services ds
       JOIN services s ON s.id = ds.services_id
       WHERE ds.doctor_id = ?`,
      [id]
    );

    const [clinicsRaw] = await db.query(
      `SELECT c.*, cd.status AS mapping_status, cd.created_at AS mapping_created_at, c.created_by_role, c.created_by_id
       FROM clinic_doctors cd
       JOIN clinic c ON c.id = cd.clinic_id
       WHERE cd.doctor_id = ?`,
      [id]
    );

    const clinics = clinicsRaw.map((c) => ({
      id: c.id,
      name: c.name,
      address_line1: c.address_line1,
      address_line2: c.address_line2,
      city: c.city,
      state: c.state,
      country: c.country,
      pin_code: c.pin_code,
      created_by_role: c.created_by_role,
      created_by_id: c.created_by_id,
      created_at: c.created_at,
      updated_at: c.updated_at,
      mapping_info: {
        status: c.mapping_status,
        created_at: c.mapping_created_at,
      },
    }));

    return {
      doctor,
      educations,
      experiences,
      memberships,
      awards,
      registration: registration[0] || null,
      availability,
      unavailability,
      ratings,
      specializations,
      services,
      clinics,
    };
  },

  // patient profile
  getPatientProfile: async (id) => {
    const [[patient]] = await db.query(
      "SELECT * FROM users WHERE id = ? AND role = 'patient'",
      [id]
    );
    if (!patient) return null;

    let [[profile]] = await db.query(
      "SELECT * FROM patient_profiles WHERE user_id = ?",
      [id]
    );

    if (!profile) {
      profile = {}; // Ensure profile is always an object
    } else {
      const jsonFields = [
        "pain_description",
        "symptoms",
        "pain_triggers",
        "pain_interference",
      ];

      jsonFields.forEach((field) => {
        if (profile[field]) {
          try {
            profile[field] = JSON.parse(profile[field]);
          } catch (e) {
            console.warn(`Invalid JSON in field ${field}:`, profile[field]);
            profile[field] = []; // fallback
          }
        }
      });
    }

    const [caregivers] = await db.query(
      "SELECT * FROM patient_caregiver WHERE user_id AND status = '1' = ?",
      [id]
    );
    const [appointments] = await db.query(
      "SELECT * FROM appointments WHERE user_id = ?",
      [id]
    );
    const [invoices] = await db.query(
      "SELECT * FROM invoices WHERE user_id = ?",
      [id]
    );
    const [supportTickets] = await db.query(
      "SELECT * FROM support_tickets WHERE user_id = ?",
      [id]
    );
    const [notifications] = await db.query(
      "SELECT * FROM notifications WHERE user_id = ?",
      [id]
    );

    return {
      patient,
      profile,
      caregivers,
      appointments,
      invoices,
      supportTickets,
      notifications,
    };
  },

  // update status
  updateUserStatus: async (id, status) => {
    const validStatuses = ["1", "2", "3"];
    if (!validStatuses.includes(String(status))) {
      throw new Error("Invalid status value");
    }

    const [result] = await db.query(
      `UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, id]
    );

    return result.affectedRows > 0;
  },
};

export default userModel;
