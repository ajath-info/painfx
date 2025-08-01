import express from "express";
import ratingController from "../controller/rating.js";
import { isAuthenticated, authorizeRoles, optionalAuth } from "../middleware/jwtAuth.js";

const router = express.Router();

// Submit a new rating (anonymous or authenticated users)
router.post(
  "/rate-doctor",
  optionalAuth,
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
  authorizeRoles(["admin", "clinic"]),
  ratingController.getAllReviews
);

// Admin - toggle review status
router.patch(
  "/toggle/:id",
  isAuthenticated,
  authorizeRoles(["admin", "clinic"]),
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