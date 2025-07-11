import express from "express";
const specialtyRouter = express.Router();

import specialtyController from "../controller/specialty.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

// ------------------------------ Specialization Management (Admin) ------------------------------

// Add or Update Specialization (Admin)
specialtyRouter.post(
  "/add-or-update",
  isAuthenticated,
  authorizeRoles(["admin"]),
  specialtyController.addOrUpdateSpecialty
);

// Get all specializations (Admin, paginated)
specialtyRouter.get(
  "/get-all",
  isAuthenticated,
  authorizeRoles(["admin"]),
  specialtyController.getAll
);

// Toggle status (activate/deactivate) (Admin)
specialtyRouter.put(
  "/toggle-status/:id",
  isAuthenticated,
  authorizeRoles(["admin"]),
  specialtyController.toggleStatus
);

// ------------------------------ Public APIs ------------------------------

// Search or list specializations (Public)
specialtyRouter.get(
  "/search-or-list",
  specialtyController.searchOrListSpecializations
);

export default specialtyRouter;
