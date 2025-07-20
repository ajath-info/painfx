import express from "express";
const authRouter = express.Router();
import { authController } from "../controller/auth.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

// Route to login admin, doctor, or patient
authRouter.post("/login", authController.login);

// Route to register a new user (doctor or patient)
authRouter.post("/register", authController.register);

// register clinic by admin only
authRouter.post(
  "/clinic-register",
  isAuthenticated,
  authorizeRoles(["admin"]),
  authController.registerClinic
);

// register doctor by admin or clinic
authRouter.post(
  "/register-doctor",
  isAuthenticated,
  authorizeRoles(["admin", "clinic"]),
  authController.registerDoctor
);

// Route to check email existence
authRouter.post("/check-email", authController.checkEmailExists);

// Route to register a admin
authRouter.post("/register-admin", authController.adminRegister);

// Route to change password
authRouter.patch(
  "/change-password",
  isAuthenticated,
  authController.changePassword
);

// Route to reset password by otp
authRouter.patch("/reset-password", authController.forgotPassword);

// Route to logout
authRouter.get("/logout", authController.logout);

export default authRouter;
