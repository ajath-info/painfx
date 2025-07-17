import { db } from "../config/db.js";

const faqModel = {
  create: async ({ question, answer }) => {
    await db.query(
      `INSERT INTO faqs (question, answer) VALUES (?, ?)`,
      [question, answer]
    );
  },

  update: async (id, { question, answer }) => {
    await db.query(
      `UPDATE faqs SET question = ?, answer = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [question, answer, id]
    );
  },

  getById: async (id) => {
    const [rows] = await db.query(`SELECT * FROM faqs WHERE id = ?`, [id]);
    return rows[0];
  },

  getPaginated: async (limit, offset) => {
    const [[{ count }]] = await db.query(`SELECT COUNT(*) as count FROM faqs`);
    const [rows] = await db.query(
      `SELECT * FROM faqs ORDER BY id DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return { total: count, rows };
  },

  getActive: async () => {
    const [rows] = await db.query(
      `SELECT id, question, answer FROM faqs WHERE status = '1' ORDER BY id DESC`
    );
    return rows;
  },

  toggleStatus: async (id, status) => {
    await db.query(
      `UPDATE faqs SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, id]
    );
  },

  delete: async (id) => {
    await db.query(`DELETE FROM faqs WHERE id = ?`, [id]);
  },
};

export default faqModel;
