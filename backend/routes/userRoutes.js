import express from "express";
const userRouter = express.Router();
import userController from "../controller/user.js";
import { isAuthenticated, authorizeRoles, optionalAuth } from "../middleware/jwtAuth.js";

userRouter.get("/doctor-profile", optionalAuth, userController.getDoctorProfile);

userRouter.get("/patient-profile", optionalAuth, userController.getPatientProfile);

// get list of user by filter of role, name
userRouter.get(
  "/all",
  isAuthenticated,
  authorizeRoles(["admin", "clinic"]),
  userController.getAllUsers
);

userRouter.put(
  "/change-status",
  isAuthenticated,
  authorizeRoles(["admin"]),
  userController.changeUserStatus
);

export default userRouter;
