import express from "express";
const patientRouter = express.Router();

import patientController from "../controller/patient.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

// Routes for toggle favorite doctor
patientRouter.post(
  "/toggle-favorite-doctor",
  isAuthenticated,
  authorizeRoles(["patient"]),
  patientController.toggleFavoriteDoctor
);

// Routes for get list of favorite doctor with pagination
patientRouter.get(
  "/favorite-doctors",
  isAuthenticated,
  authorizeRoles(["patient"]),
  patientController.getFavoriteDoctors
);

// router for fetch doctor treated patients for doctor
patientRouter.get(
  "/doctor-patients",
  isAuthenticated,
  authorizeRoles(["doctor"]),
  patientController.doctorPatients
);

// Router to update profile
patientRouter.put(
  "/update-profile",
  isAuthenticated,
  authorizeRoles(["patient"]),
  patientController.updateProfile
);

export default patientRouter;
