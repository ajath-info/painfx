import ratingModel from "../models/ratingModel.js";
import { db } from "../config/db.js";
import { apiResponse } from "../utils/helper.js";

const ratingController = {
  rateDoctor: async (req, res) => {
    try {
      const { doctor_id, rating, title, review, appointment_id } = req.body;
      const user_id = req.user?.id || null;

      if (!doctor_id || !rating) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Doctor ID and rating are required.",
        });
      }

      // Validate doctor exists
      const [doctor] = await db.query(`SELECT * FROM users WHERE id = ? AND role = 'doctor'`, [doctor_id]);
      if (doctor.length === 0) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Invalid doctor ID.",
        });
      }

      // For logged-in users with appointment_id
      if (user_id && appointment_id) {
        const [appointment] = await db.query(
          `SELECT * FROM appointments WHERE id = ? AND user_id = ? AND status = 'completed'`,
          [appointment_id, user_id]
        );

        if (appointment.length === 0) {
          return apiResponse(res, {
            error: true,
            code: 400,
            status: 0,
            message: "Invalid appointment or not completed.",
          });
        }

        const existing = await ratingModel.getRatingByAppointment(appointment_id);
        if (existing) {
          return apiResponse(res, {
            error: true,
            code: 400,
            status: 0,
            message: "Rating already submitted for this appointment.",
          });
        }
      }

      await ratingModel.addRating({
        user_id,
        doctor_id,
        appointment_id: appointment_id || null,
        rating,
        title,
        review,
      });

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Rating submitted successfully.",
      });
    } catch (err) {
      console.error("Rate doctor error:", err.message);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Server error.",
      });
    }
  },

  getAllReviews: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const user = req.user || {};
      const { data, total } = await ratingModel.getAllReviewsPaginated(page, limit, user);
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Reviews fetched successfully",
        payload: {
          data,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error("getAllReviews error:", err);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Error fetching reviews.",
      });
    }
  },

  getUserRatings: async (req, res) => {
    try {
      const user_id = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const { data, total } = await ratingModel.getUserRatingsPaginated(user_id, page, limit);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "User ratings fetched successfully",
        payload: {
          data,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error("getUserRatings error:", err);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Error fetching user ratings.",
      });
    }
  },

  getDoctorRatings: async (req, res) => {
    try {
      const doctor_id = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const { data, total } = await ratingModel.getDoctorRatingsPaginated(doctor_id, page, limit);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Doctor ratings fetched successfully",
        payload: {
          data,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error("getDoctorRatings error:", err);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Error fetching doctor ratings.",
      });
    }
  },

  toggleReview: async (req, res) => {
    try {
      const { id } = req.params;
      await ratingModel.toggleReviewStatus(id);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Review status updated.",
      });
    } catch (err) {
      if (err.message === "NOT_FOUND") {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Review not found",
        });
      }
      console.error("toggleReview error:", err);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Error toggling review.",
      });
    }
  },

  markAsTestimonial: async (req, res) => {
    try {
      const { id } = req.params;
      await ratingModel.markAsTestimonial(id);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Testimonial status updated.",
      });
    } catch (err) {
      if (err.message === "NOT_FOUND") {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Review not found",
        });
      }
      console.error("markAsTestimonial error:", err);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Error updating testimonial.",
      });
    }
  },

  getTestimonials: async (req, res) => {
    try {
      const data = await ratingModel.getAllTestimonials();
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Testimonials fetched successfully",
        payload: data,
      });
    } catch (err) {
      console.error("getTestimonials error:", err);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Error fetching testimonials.",
      });
    }
  },
};

export default ratingController;