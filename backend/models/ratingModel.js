import { db } from "../config/db.js";

const ratingModel = {
  addRating: async (data) => {
    const [result] = await db.query(
      `INSERT INTO rating (user_id, doctor_id, appointment_id, rating, title, review)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.user_id || null,
        data.doctor_id,
        data.appointment_id || null,
        data.rating,
        data.title,
        data.review,
      ]
    );
    return result;
  },

  getRatingByAppointment: async (appointment_id) => {
    if (!appointment_id) return null;
    const [rows] = await db.query(
      `SELECT * FROM rating WHERE appointment_id = ?`,
      [appointment_id]
    );
    return rows[0];
  },

  // 1. Admin - paginated with user + doctor info + total
  getAllReviewsPaginated: async (page, limit) => {
    const offset = (page - 1) * limit;

    const [data] = await db.query(
      `SELECT r.*, 
              u.id as user_id, u.full_name as user_name, u.profile_image as user_image,
              d.id as doctor_id, d.full_name as doctor_name, d.profile_image as doctor_image,
              r.is_testimonial
       FROM rating r
       LEFT JOIN users u ON r.user_id = u.id
       JOIN users d ON r.doctor_id = d.id
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM rating`);

    return { data, total };
  },

  // 2. Patient - own ratings (with total)
  getUserRatingsPaginated: async (user_id, page, limit) => {
    const offset = (page - 1) * limit;

    const [data] = await db.query(
      `SELECT r.*, 
              d.id as doctor_id, d.full_name as doctor_name, d.profile_image as doctor_image
       FROM rating r
       JOIN users d ON r.doctor_id = d.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [user_id, limit, offset]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM rating WHERE user_id = ?`,
      [user_id]
    );

    return { data, total };
  },

  // 3. Doctor - received ratings (only status = '1') with total
  getDoctorRatingsPaginated: async (doctor_id, page, limit) => {
    const offset = (page - 1) * limit;

    const [data] = await db.query(
      `SELECT r.*, 
              u.id as user_id, u.full_name as user_name, u.profile_image as user_image
       FROM rating r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.doctor_id = ? AND r.status = '1'
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [doctor_id, limit, offset]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM rating WHERE doctor_id = ? AND status = '1'`,
      [doctor_id]
    );

    return { data, total };
  },

  // Toggle review status: if 1 -> 2, if 2 -> 1
  toggleReviewStatus: async (id) => {
    const [[review]] = await db.query(
      `SELECT status FROM rating WHERE id = ?`,
      [id]
    );
    if (!review) throw new Error("NOT_FOUND");

    const newStatus = review.status === "1" ? "2" : "1";

    const [result] = await db.query(
      `UPDATE rating SET status = ? WHERE id = ?`,
      [newStatus, id]
    );
    return result;
  },

  // Toggle testimonial flag: if 1 -> 0, if 0 -> 1
  markAsTestimonial: async (id) => {
    const [[review]] = await db.query(
      `SELECT is_testimonial FROM rating WHERE id = ?`,
      [id]
    );
    if (!review) throw new Error("NOT_FOUND");

    const newFlag = review.is_testimonial === "1" ? "0" : "1";

    const [result] = await db.query(
      `UPDATE rating SET is_testimonial = ? WHERE id = ?`,
      [newFlag, id]
    );
    return result;
  },

  getAllTestimonials: async () => {
    const [rows] = await db.query(
      `SELECT r.*, 
              u.id as user_id, u.full_name as user_name, u.profile_image as user_image
       FROM rating r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.status = '1' AND r.is_testimonial = '1'
       ORDER BY r.created_at DESC`
    );
    return rows;
  },
};

export default ratingModel;