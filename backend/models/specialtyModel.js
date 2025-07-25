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
      `SELECT s.*, c.name as clinic_name 
       FROM specializations s 
       LEFT JOIN clinic c ON s.clinic_id = c.id 
       WHERE s.id = ?`,
      [id]
    );
    return rows[0];
  },

  existsByName: async (name, clinic_id = null) => {
    let query = `SELECT id FROM specializations WHERE name = ? AND `;
    const values = [name];

    if (clinic_id) {
      query += `clinic_id = ?`;
      values.push(clinic_id);
    } else {
      query += `clinic_id IS NULL`;
    }

    const [rows] = await db.query(query, values);
    return rows[0] || null; // Return the actual record or null
  },

  create: async ({ name, image_url, clinic_id }) => {
    const code = await generateUniqueCode();
    await db.query(
      `INSERT INTO specializations (name, code, image_url, clinic_id) VALUES (?, ?, ?, ?)`,
      [name, code, image_url, clinic_id || null]
    );
  },

  update: async (id, { name, image_url }, clinic_id, userRole) => {
    const [rows] = await db.query(
      `SELECT * FROM specializations WHERE id = ?`,
      [id]
    );
    const existing = rows[0];
    if (!existing) return false;

    // Clinic can only update their own specializations
    if (userRole === "clinic" && existing.clinic_id !== clinic_id) {
      return false;
    }

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
    return true;
  },

  toggleStatus: async (id, newStatus, clinic_id, userRole) => {
    const [rows] = await db.query(
      `SELECT * FROM specializations WHERE id = ?`,
      [id]
    );
    const spec = rows[0];
    if (!spec) return false;

    if (userRole === "clinic" && spec.clinic_id !== clinic_id) {
      return false;
    }

    await db.query(
      `UPDATE specializations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [newStatus, id]
    );
    return true;
  },

  getPaginated: async (status, limit, offset, userRole, clinic_id) => {
    let where = `WHERE 1`;
    const values = [];

    if (userRole === "clinic") {
      where += ` AND s.clinic_id = ?`;
      values.push(clinic_id);
    } else if (status) {
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
         c.name AS clinic_name,
         COUNT(ds.id) AS doctor_count 
       FROM specializations s
       LEFT JOIN clinic c ON s.clinic_id = c.id
       LEFT JOIN doctor_specializations ds ON s.id = ds.specialization_id AND ds.status = '1'
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
      `SELECT id, name, image_url FROM specializations WHERE LOWER(name) LIKE ? AND status = '1' ORDER BY name ASC`,
      [`%${search.toLowerCase()}%`]
    );
    return rows;
  },
};

export default SpecializationModel;
