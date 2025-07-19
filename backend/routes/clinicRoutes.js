import express from "express";
const clinicRouter = express.Router();

import clinicController from "../controller/clinic.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

// ------------------------------ Clinic Management (Admin) ------------------------------

// update clinic (Admin/clinic)
clinicRouter.put(
  "/update",
  isAuthenticated,
  authorizeRoles(["admin", "clinic"]),
  clinicController.updateClinic
);

// Get all clinics (Admin)
clinicRouter.get(
  "/get-all",
  isAuthenticated,
  authorizeRoles(["admin"]),
  clinicController.getAllClinics
);

// Get clinic by ID (Admin/clinic)
clinicRouter.get(
  "/get/:clinic_id",
  isAuthenticated,
  authorizeRoles(["admin", "clinic"]),
  clinicController.getClinicById
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
  authorizeRoles(["admin", "clinic"]),
  clinicController.assignOrRemoveDoctorToClinic
);

// Get all doctors of a clinic (Admin/clinic)
clinicRouter.get(
  "/get-doctors/:clinic_id",
  isAuthenticated,
  authorizeRoles(["admin", "clinic"]),
  clinicController.getClinicDoctors
);

// Toggle doctor status in clinic (Admin/clinic).
clinicRouter.put(
  "/toggle-doctors-in-clinic",
  isAuthenticated,
  authorizeRoles(["admin", "clinic"]),
  clinicController.toggleDoctorStatusInClinic
);

// ------------------------- Clinic Mapping (Doctor/Admin) -------------------------

// Get all mapped clinics for a doctor (Doctor/Admin/User)
clinicRouter.get(
  "/get-mapped-clinics",
  clinicController.getMappedClinicsForDoctor
);

// ------------------------- Public -------------------------

// search active clinic 
clinicRouter.get(
  "/search-active-clinics",
  clinicController.searchActiveClinics
);

export default clinicRouter;
