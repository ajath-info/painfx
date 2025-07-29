import { db } from "../config/db.js";

const adminModel = {
  getById: async (id) => {
    const [[admin]] = await db.query(`SELECT * FROM admin WHERE id = ?`, [id]);
    return admin;
  },

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

    const query = `UPDATE admin SET ${fields.join(", ")} WHERE id = ?`;
    await db.query(query, values);
  },

  // Fetch dashboard analytics data
  getDashboardAnalytics: async () => {
    const [analytics] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'patient' AND status = '1') AS total_patients,
        (SELECT COUNT(*) FROM users WHERE role = 'doctor' AND status = '1') AS total_doctors,
        (SELECT COUNT(*) FROM appointments) AS total_appointments,
        (SELECT COALESCE(SUM(amount), 0) FROM appointments 
         WHERE status != 'cancelled' AND payment_status = 'paid') AS total_revenue
    `);
    return analytics[0];
  },
};

export default adminModel;
