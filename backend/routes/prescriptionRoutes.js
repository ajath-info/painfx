import express from "express";
const prescriptionRouter = express.Router();

import prescriptionController from "../controller/prescription.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

// ------------------------------ Prescription Management (Doctor Only) ------------------------------

// Add or Update Prescription (Doctor Only)
prescriptionRouter.post(
  "/add-or-update",
  isAuthenticated,
  authorizeRoles(["doctor"]),
  prescriptionController.addOrUpdatePrescription
);

// Toggle status (soft delete) (Doctor Only)
prescriptionRouter.put(
  "/toggle-status/:id",
  isAuthenticated,
  authorizeRoles(["doctor"]),
  prescriptionController.toggleStatus
);

// Get prescriptions by filters with pagination (Doctor, Patient, Clinic, Admin)
prescriptionRouter.get(
  "/get-by-filter",
  isAuthenticated,
  authorizeRoles(["doctor", "patient", "clinic", "admin"]),
  prescriptionController.getByFilter
);

// Get complete prescription details by ID (Doctor, Patient, Clinic, Admin)
prescriptionRouter.get(
  "/details/:id",
  isAuthenticated,
  authorizeRoles(["doctor", "patient", "clinic", "admin"]),
  prescriptionController.getDetailsById
);

export default prescriptionRouter;