import express from "express";
const complianceRouter = express.Router();

import complianceController from "../controller/compliance.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

// ---------------- Admin APIs ----------------
complianceRouter.post(
  "/add-or-update",
  isAuthenticated,
  authorizeRoles(["admin"]),
  complianceController.addOrUpdate
);

complianceRouter.get(
  "/get-all",
  isAuthenticated,
  authorizeRoles(["admin"]),
  complianceController.getAll
);

complianceRouter.put(
  "/toggle-status/:id",
  isAuthenticated,
  authorizeRoles(["admin"]),
  complianceController.toggleStatus
);

complianceRouter.delete(
  "/delete/:id",
  isAuthenticated,
  authorizeRoles(["admin"]),
  complianceController.deleteCompliance
);

// ---------------- Public API ----------------
complianceRouter.get("/get-active/:type", complianceController.getActive);

export default complianceRouter;