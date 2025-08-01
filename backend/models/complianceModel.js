import { db } from "../config/db.js";

// Helper to generate compliance model
const ComplianceModel = {
  create: async ({ name, image_url, redirect_link, type }) => {
    await db.query(
      `INSERT INTO compliances (name, image_url, redirect_link, type) VALUES (?, ?, ?, ?)`,
      [name, image_url, redirect_link, type]
    );
  },

  update: async (id, { name, image_url, redirect_link, type }) => {
    const updates = [`name = ?`, `redirect_link = ?`, `type = ?`];
    const values = [name, redirect_link, type];

    if (image_url) {
      updates.push(`image_url = ?`);
      values.push(image_url);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    await db.query(
      `UPDATE compliances SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
  },

  getById: async (id) => {
    const [rows] = await db.query(`SELECT * FROM compliances WHERE id = ?`, [id]);
    return rows[0];
  },

  getPaginated: async (limit, offset) => {
    const [countRows] = await db.query(`SELECT COUNT(*) as count FROM compliances`);
    const total = countRows[0].count;

    const [rows] = await db.query(
      `SELECT * FROM compliances ORDER BY id DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return { total, rows };
  },

  getActive: async (type) => {
    const [rows] = await db.query(
      `SELECT id, name, image_url, redirect_link, type FROM compliances WHERE status = '1' AND type = ? ORDER BY id DESC`,
      [type]
    );
    return rows;
  },

  toggleStatus: async (id, status) => {
    await db.query(
      `UPDATE compliances SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, id]
    );
  },

  delete: async (id) => {
    await db.query(`DELETE FROM compliances WHERE id = ?`, [id]);
  },
};

export default ComplianceModel;