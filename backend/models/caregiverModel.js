import { db } from "../config/db.js";

const caregiverModel = {
  create: async (user_id, data) => {
    const {
      name,
      phone,
      email,
      relationship,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pin_code,
    } = data;

    await db.query(
      `INSERT INTO patient_caregiver 
      (user_id, name, phone, email, relationship, address_line1, address_line2, city, state, country, pin_code) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        name,
        phone,
        email,
        relationship,
        address_line1,
        address_line2,
        city,
        state,
        country,
        pin_code,
      ]
    );
  },

  update: async (id, data) => {
    const {
      name,
      phone,
      email,
      relationship,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pin_code,
    } = data;

    await db.query(
      `UPDATE patient_caregiver SET 
        name = ?, phone = ?, email = ?, relationship = ?, 
        address_line1 = ?, address_line2 = ?, city = ?, state = ?, 
        country = ?, pin_code = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?`,
      [
        name,
        phone,
        email,
        relationship,
        address_line1,
        address_line2,
        city,
        state,
        country,
        pin_code,
        id,
      ]
    );
  },

  getById: async (id, user_id) => {
    const [rows] = await db.query(
      `SELECT * FROM patient_caregiver WHERE id = ? AND user_id = ?`,
      [id, user_id]
    );
    return rows[0];
  },

  getPaginated: async (user_id, limit, offset) => {
    const [[{ count }]] = await db.query(
      `SELECT COUNT(*) as count FROM patient_caregiver WHERE user_id = ?`,
      [user_id]
    );
    const [rows] = await db.query(
      `SELECT * FROM patient_caregiver WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?`,
      [user_id, limit, offset]
    );
    return { total: count, rows };
  },

  getActive: async (user_id, search = "") => {
    let query = `
    SELECT * 
    FROM patient_caregiver 
    WHERE user_id = ? AND status = '1'`;
    const params = [user_id];

    if (search.trim() !== "") {
      query += ` AND name LIKE ?`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY id DESC`;

    const [rows] = await db.query(query, params);
    return rows;
  },

  toggleStatus: async (id, status) => {
    await db.query(
      `UPDATE patient_caregiver SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, id]
    );
  },
};

export default caregiverModel;
