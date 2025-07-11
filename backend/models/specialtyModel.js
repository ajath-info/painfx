import { db } from "../config/db.js";

// Generate unique specialization code
const generateUniqueCode = async () => {
  let code,
    exists = true;
  while (exists) {
    code = "SP" + Math.floor(100000 + Math.random() * 900000);
    const [rows] = await db.query(
      `SELECT id FROM specializations WHERE code = ?`,
      [code]
    );
    exists = rows.length > 0;
  }
  return code;
};

const SpecializationModel = {
  getById: async (id) => {
    const [rows] = await db.query(
      `SELECT * FROM specializations WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  existsByName: async (name) => {
    const [rows] = await db.query(
      `SELECT id FROM specializations WHERE name = ?`,
      [name]
    );
    return rows.length > 0;
  },

  create: async ({ name, image_url }) => {
    const code = await generateUniqueCode();
    await db.query(
      `INSERT INTO specializations (name, code, image_url) VALUES (?, ?, ?)`,
      [name, code, image_url]
    );
  },

  update: async (id, { name, image_url }) => {
    const updates = [`name = ?`];
    const values = [name];

    if (image_url) {
      updates.push(`image_url = ?`);
      values.push(image_url);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    await db.query(
      `UPDATE specializations SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
  },

  toggleStatus: async (id, newStatus) => {
    await db.query(
      `UPDATE specializations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [newStatus, id]
    );
  },

  getPaginated: async (status, limit, offset) => {
    let where = `WHERE 1`;
    const values = [];

    if (status) {
      where += ` AND s.status = ?`;
      values.push(status);
    }

    const [countRows] = await db.query(
      `SELECT COUNT(*) as count FROM specializations s ${where}`,
      values
    );
    const total = countRows[0].count;

    const [rows] = await db.query(
      `SELECT 
      s.*, 
      COUNT(ds.id) AS doctor_count 
     FROM specializations s
     LEFT JOIN doctor_specializations ds 
       ON s.id = ds.specialization_id AND ds.status = '1'
     ${where}
     GROUP BY s.id
     ORDER BY s.id DESC
     LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    return { total, rows };
  },

  searchPublic: async (search) => {
    const [rows] = await db.query(
      `SELECT * FROM specializations WHERE LOWER(name) LIKE ? AND status = '1' ORDER BY name ASC`,
      [`%${search.toLowerCase()}%`]
    );
    return rows;
  },
};

export default SpecializationModel;
