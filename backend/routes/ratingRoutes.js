import express from "express";
import ratingController from "../controller/rating.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

const router = express.Router();

// Submit a new rating (only by patient)
router.post(
  "/rate-doctor",
  isAuthenticated,
  authorizeRoles(["patient"]),
  ratingController.rateDoctor
);

// Patient - get all ratings they submitted
router.get(
  "/my-ratings",
  isAuthenticated,
  authorizeRoles(["patient"]),
  ratingController.getUserRatings
);

// Doctor - get ratings received
router.get(
  "/my-doctor-reviews",
  isAuthenticated,
  authorizeRoles(["doctor"]),
  ratingController.getDoctorRatings
);

// Admin - get all reviews with user & doctor info + is_testimonial
router.get(
  "/reviews",
  isAuthenticated,
  authorizeRoles(["admin"]),
  ratingController.getAllReviews
);

// Admin - toggle review status
router.patch(
  "/toggle/:id",
  isAuthenticated,
  authorizeRoles(["admin"]),
  ratingController.toggleReview
);

// Admin - mark/unMark review as testimonial
router.patch(
  "/testimonial/:id",
  isAuthenticated,
  authorizeRoles(["admin"]),
  ratingController.markAsTestimonial
);

// Public - get all testimonials
router.get("/testimonials", ratingController.getTestimonials);

export default router;
