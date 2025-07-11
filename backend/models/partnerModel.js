import { db } from "../config/db.js";

// Helper to generate partner model
const PartnerModel = {
  create: async ({ name, image_url, website_url }) => {
    await db.query(
      `INSERT INTO partners (name, image_url, website_url) VALUES (?, ?, ?)`,
      [name, image_url, website_url]
    );
  },

  update: async (id, { name, image_url, website_url }) => {
    const updates = [`name = ?`, `website_url = ?`];
    const values = [name, website_url];

    if (image_url) {
      updates.push(`image_url = ?`);
      values.push(image_url);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    await db.query(
      `UPDATE partners SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
  },

  getById: async (id) => {
    const [rows] = await db.query(`SELECT * FROM partners WHERE id = ?`, [id]);
    return rows[0];
  },

  getPaginated: async (limit, offset) => {
    const [countRows] = await db.query(`SELECT COUNT(*) as count FROM partners`);
    const total = countRows[0].count;

    const [rows] = await db.query(
      `SELECT * FROM partners ORDER BY id DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return { total, rows };
  },

  getActive: async () => {
    const [rows] = await db.query(
      `SELECT id, name, image_url, website_url FROM partners WHERE status = '1' ORDER BY id DESC`
    );
    return rows;
  },

  toggleStatus: async (id, status) => {
    await db.query(
      `UPDATE partners SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, id]
    );
  },

  delete: async (id) => {
    await db.query(`DELETE FROM partners WHERE id = ?`, [id]);
  },
};

export default PartnerModel;
