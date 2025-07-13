// models/userModel.js
import { db } from "../config/db.js";

const userModel = {
  // get all doctor/patient list for admin with pagination
  getUsers: async ({ role, name, status, limit, offset }) => {
    const params = [];
    let baseQuery = `SELECT 
    u.id, u.prefix, u.f_name, u.l_name, u.full_name, u.user_name,
    u.profile_image, u.status, u.created_at, u.updated_at`;

    if (role === "doctor") {
      baseQuery += `,
      IFNULL(SUM(a.amount), 0) AS earning
      FROM users u
      LEFT JOIN appointments a 
        ON a.doctor_id = u.id 
        AND a.payment_status = 'paid' 
        AND a.status != 'cancelled'`;
    } else {
      baseQuery += `,
      (
        SELECT IFNULL(SUM(a2.amount), 0)
        FROM appointments a2
        WHERE a2.user_id = u.id 
          AND a2.payment_status = 'paid' 
          AND a2.status != 'cancelled'
      ) AS total_paid,
      (
        SELECT MAX(appointment_date)
        FROM appointments a3
        WHERE a3.user_id = u.id 
          AND a3.status = 'completed'
      ) AS last_appointment
      FROM users u`;
    }

    baseQuery += ` WHERE u.role = ?`;
    params.push(role);

    if (name) {
      baseQuery += ` AND (u.f_name LIKE ? OR u.l_name LIKE ? OR u.full_name LIKE ?)`;
      const namePattern = `%${name.trim()}%`;
      params.push(namePattern, namePattern, namePattern);
    }

    if (status) {
      baseQuery += ` AND u.status = ?`;
      params.push(status);
    }

    baseQuery += ` GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [users] = await db.query(baseQuery, params);

    for (const user of users) {
      if (role === "doctor") {
        const [specializations] = await db.query(
          `SELECT s.id, s.name, s.code 
         FROM doctor_specializations ds
         JOIN specializations s ON s.id = ds.specialization_id
         WHERE ds.doctor_id = ? AND ds.status = '1'`,
          [user.id]
        );

        const [services] = await db.query(
          `SELECT sv.id, sv.name 
         FROM doctor_services ds
         JOIN services sv ON sv.id = ds.services_id
         WHERE ds.doctor_id = ? AND ds.status = '1'`,
          [user.id]
        );

        user.specializations = specializations;
        user.services = services;
      }
    }

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM users WHERE role = ?` +
        (name
          ? ` AND (f_name LIKE ? OR l_name LIKE ? OR full_name LIKE ?)`
          : "") +
        (status ? ` AND status = ?` : ""),
      name && status
        ? [role, ...Array(3).fill(`%${name}%`), status]
        : name
        ? [role, ...Array(3).fill(`%${name}%`)]
        : [role, ...(status ? [status] : [])]
    );

    return { total, users };
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
      "SELECT * FROM rating WHERE doctor_id = ?",
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

    const [caregivers] = await db.query(
      "SELECT * FROM patient_caregiver WHERE user_id = ?",
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
