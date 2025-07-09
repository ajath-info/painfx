import express from "express";
const clinicRouter = express.Router();

import clinicController from "../controller/clinic.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

// ------------------------------ Clinic Management (Admin) ------------------------------

// Add a new clinic (Admin)
clinicRouter.post(
  "/add",
  isAuthenticated,
  authorizeRoles(["admin"]),
  clinicController.addClinic
);

// Get all clinics (Admin)
clinicRouter.get(
  "/get-all",
  isAuthenticated,
  authorizeRoles(["admin"]),
  clinicController.getAllClinics
);

// Get clinic by ID (Admin)
clinicRouter.get(
  "/get/:clinic_id",
  isAuthenticated,
  authorizeRoles(["admin"]),
  clinicController.getClinicById
);

// Update clinic by ID (Admin)
clinicRouter.put(
  "/update/:clinic_id",
  isAuthenticated,
  authorizeRoles(["admin"]),
  clinicController.updateClinic
);

// Activate or deactivate clinic (Admin)
clinicRouter.put(
  "/toggle-status/:clinic_id",
  isAuthenticated,
  authorizeRoles(["admin"]),
  clinicController.toggleClinicStatus
);

// ------------------------- Clinic-Doctor Mapping (Admin) -------------------------

// Assign or remove doctor to/from clinic (Admin)
clinicRouter.post(
  "/assign-or-remove-doctor",
  isAuthenticated,
  authorizeRoles(["admin"]),
  clinicController.assignOrRemoveDoctorToClinic
);

// Get all doctors of a clinic (Admin)
clinicRouter.get(
  "/get-doctors/:clinic_id",
  isAuthenticated,
  authorizeRoles(["admin"]),
  clinicController.getClinicDoctors
);

// ------------------------- Clinic Mapping (Doctor/Admin) -------------------------

// Get all mapped clinics for a doctor (Doctor/Admin/User)
clinicRouter.get(
  "/get-mapped-clinics",
  isAuthenticated,
  clinicController.getMappedClinicsForDoctor
);

export default clinicRouter;
