import express from "express";
const specializationRouter = express.Router();

import specializationController from "../controller/specialty.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

// ------------------------------ Specialization Management (Admin & Clinic) ------------------------------

// Add or Update Specialization (Admin or Clinic)
specializationRouter.post(
  "/add-or-update",
  isAuthenticated,
  authorizeRoles(["admin", "clinic"]),
  specializationController.addOrUpdateSpecialty
);

// Get all specializations (Admin or Clinic, paginated)
specializationRouter.get(
  "/get-all",
  isAuthenticated,
  authorizeRoles(["admin", "clinic"]),
  specializationController.getAll
);

// Toggle status (activate/deactivate) (Admin or Clinic)
specializationRouter.put(
  "/toggle-status/:id",
  isAuthenticated,
  authorizeRoles(["admin", "clinic"]),
  specializationController.toggleStatus
);

// ------------------------------ Public APIs ------------------------------

// Search or list specializations (Public)
specializationRouter.get(
  "/search-or-list",
  specializationController.searchOrListSpecializations
);

export default specializationRouter;
