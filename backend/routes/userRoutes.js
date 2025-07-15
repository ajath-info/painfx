import express from "express";
const userRouter = express.Router();
import userController from "../controller/user.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

// Route to login admin, doctor, or patient
userRouter.get("/doctor-profile/:id", userController.getDoctorProfile);

// Route to register a new user (doctor or patient)
userRouter.get("/patient-profile/:id", userController.getPatientProfile);

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
