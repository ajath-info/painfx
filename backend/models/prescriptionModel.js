import { db } from "../config/db.js";

const PrescriptionModel = {
  getById: async (id) => {
    const [rows] = await db.query(
      `SELECT p.*, 
              u1.full_name as doctor_name, u1.profile_image as doctor_profile_image, u1.id as doctor_id,
              u2.full_name as patient_name, u2.profile_image as patient_profile_image, u2.id as patient_id
       FROM prescriptions p
       LEFT JOIN users u1 ON p.prescribed_by = u1.id
       LEFT JOIN users u2 ON p.prescribed_to = u2.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  },

  getDetailsById: async (id) => {
    const [rows] = await db.query(
      `SELECT p.*,
              u1.id as doctor_id, u1.full_name as doctor_name, u1.profile_image as doctor_profile_image,
              u2.id as patient_id, u2.full_name as patient_name, u2.profile_image as patient_profile_image,
              a.id as appointment_id, a.appointment_date, a.appointment_time
       FROM prescriptions p
       LEFT JOIN users u1 ON p.prescribed_by = u1.id
       LEFT JOIN users u2 ON p.prescribed_to = u2.id
       LEFT JOIN appointments a ON p.appointment_id = a.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  },

  create: async ({ appointment_id, prescribed_by, prescribed_to, notes, file_type, file_url }) => {
    const [result] = await db.query(
      `INSERT INTO prescriptions (appointment_id, prescribed_by, prescribed_to, notes, file_type, file_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [appointment_id, prescribed_by, prescribed_to, notes || null, file_type || 'none', file_url || null]
    );
    return result.insertId;
  },

  update: async (id, { appointment_id, prescribed_to, notes, file_type, file_url }, prescribed_by) => {
    const [rows] = await db.query(
      `SELECT * FROM prescriptions WHERE id = ? AND prescribed_by = ?`,
      [id, prescribed_by]
    );
    const existing = rows[0];
    if (!existing) return false;

    const updates = [];
    const values = [];

    if (appointment_id) {
      updates.push(`appointment_id = ?`);
      values.push(appointment_id);
    }
    if (prescribed_to) {
      updates.push(`prescribed_to = ?`);
      values.push(prescribed_to);
    }
    if (notes !== undefined) {
      updates.push(`notes = ?`);
      values.push(notes);
    }
    if (file_type) {
      updates.push(`file_type = ?`);
      values.push(file_type);
    }
    if (file_url) {
      updates.push(`file_url = ?`);
      values.push(file_url);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    await db.query(
      `UPDATE prescriptions SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    return true;
  },

  toggleStatus: async (id, newStatus, prescribed_by) => {
    const [rows] = await db.query(
      `SELECT * FROM prescriptions WHERE id = ? AND prescribed_by = ?`,
      [id, prescribed_by]
    );
    const prescription = rows[0];
    if (!prescription) return false;

    await db.query(
      `UPDATE prescriptions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [newStatus, id]
    );
    return true;
  },

  getByFilter: async ({ appointment_id, prescribed_by, prescribed_to, status, limit, offset, userRole, userId }) => {
    let where = `WHERE 1`;
    const values = [];

    // Role-based access control
    if (userRole === "doctor") {
      where += ` AND p.prescribed_by = ?`;
      values.push(userId);
    } else if (userRole === "patient") {
      where += ` AND p.prescribed_to = ?`;
      values.push(userId);
    } // Admin can see all prescriptions, no additional condition needed

    if (appointment_id) {
      where += ` AND p.appointment_id = ?`;
      values.push(appointment_id);
    }
    if (prescribed_by && userRole !== "patient") {
      where += ` AND p.prescribed_by = ?`;
      values.push(prescribed_by);
    }
    if (prescribed_to && userRole !== "patient") {
      where += ` AND p.prescribed_to = ?`;
      values.push(prescribed_to);
    }
    if (status) {
      where += ` AND p.status = ?`;
      values.push(status);
    }

    const [countRows] = await db.query(
      `SELECT COUNT(*) as count 
       FROM prescriptions p 
       LEFT JOIN users u1 ON p.prescribed_by = u1.id 
       ${where}`,
      values
    );
    const total = countRows[0].count;

    const [rows] = await db.query(
      `SELECT 
         p.*,
         u1.id as doctor_id, u1.full_name as doctor_name, u1.profile_image as doctor_profile_image,
         u2.id as patient_id, u2.full_name as patient_name, u2.profile_image as patient_profile_image,
         a.id as appointment_id, a.appointment_date, a.appointment_time
       FROM prescriptions p
       LEFT JOIN users u1 ON p.prescribed_by = u1.id
       LEFT JOIN users u2 ON p.prescribed_to = u2.id
       LEFT JOIN appointments a ON p.appointment_id = a.id
       ${where}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    return { total, rows };
  }
};

export default PrescriptionModel;