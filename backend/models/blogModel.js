import { db } from '../config/db.js';

const BlogModel = {
  addOrUpdate: async (data) => {
    const { id, title, description, image_url } = data;
    if (id) {
      return db.query(
        'UPDATE blogs SET title = ?, description = ?, image_url = ? WHERE id = ?',
        [title, description, image_url, id]
      );
    } else {
      return db.query(
        'INSERT INTO blogs (title, description, image_url) VALUES (?, ?, ?)',
        [title, description, image_url]
      );
    }
  },

  getAll: async () => {
    return db.query('SELECT * FROM blogs ORDER BY created_at DESC');
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM blogs WHERE id = ?', [id]);
    return rows[0]; // Return single row
  },

  getPaginated: async (limit, offset) => {
    const [rows] = await db.query('SELECT * FROM blogs ORDER BY created_at DESC LIMIT ? OFFSET ?', [
      limit,
      offset,
    ]);
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM blogs');
    return { total, rows };
  },

  toggleStatus: async (id) => {
    return db.query(
      `UPDATE blogs 
       SET status = CASE WHEN status = '1' THEN '2' ELSE '1' END 
       WHERE id = ?`,
      [id]
    );
  },

  deleteById: async (id) => {
    return db.query('DELETE FROM blogs WHERE id = ?', [id]);
  },

  getLatestActive: async () => {
    const [rows] = await db.query(
      `SELECT id, title, description, image_url, created_at 
       FROM blogs 
       WHERE status = '1' 
       ORDER BY created_at DESC`
    );
    return rows;
  },
};

export default BlogModel;