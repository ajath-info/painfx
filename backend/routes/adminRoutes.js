import express from "express";
const adminRouter = express.Router();

import adminController from "../controller/admin.js"
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

// Get admin by ID
adminRouter.get(
  "/:id",
  isAuthenticated,
  authorizeRoles(["superadmin", "admin"]),
  adminController.getById
);

// Update admin profile with image upload
adminRouter.put(
  "/update/:id",
  isAuthenticated,
  authorizeRoles(["superadmin", "admin"]),
  adminController.updateProfile
);

// Get dashboard analytics
adminRouter.get(
  "/dashboard/analytics",
  isAuthenticated,
  authorizeRoles(["superadmin", "admin"]),
  adminController.dashboardAnalyticsData
);

export default adminRouter;
