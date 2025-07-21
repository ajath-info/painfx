import express from "express";
const caregiverRouter = express.Router();

import caregiverController from "../controller/caregiver.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

// ---------------- Patient APIs ----------------
caregiverRouter.post(
  "/add-or-update",
  isAuthenticated,
  authorizeRoles(["patient"]),
  caregiverController.addOrUpdate
);

caregiverRouter.get(
  "/get-all",
  isAuthenticated,
  authorizeRoles(["patient"]),
  caregiverController.getAll
);

caregiverRouter.get(
  "/get-active",
  isAuthenticated,
  authorizeRoles(["patient"]),
  caregiverController.getActiveWithSearch
);

caregiverRouter.put(
  "/toggle-status/:id",
  isAuthenticated,
  authorizeRoles(["patient"]),
  caregiverController.toggleStatus
);

export default caregiverRouter;
