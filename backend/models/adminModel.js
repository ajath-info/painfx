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
};

export default adminModel;
