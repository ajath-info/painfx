import express from "express";
const userRouter = express.Router();
import userController from "../controller/user.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

userRouter.get("/doctor-profile", isAuthenticated, userController.getDoctorProfile);

userRouter.get("/patient-profile", isAuthenticated, userController.getPatientProfile);

// get list of user by filter of role, name
userRouter.get(
  "/all",
  isAuthenticated,
  authorizeRoles(["admin"]),
  userController.getAllUsers
);

userRouter.put(
  "/change-status",
  isAuthenticated,
  authorizeRoles(["admin"]),
  userController.changeUserStatus
);

export default userRouter;
