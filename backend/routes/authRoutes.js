import express from "express";
const authRouter = express.Router();
import { authController } from "../controller/auth.js";
import { multerMiddleware } from "../middleware/multerMiddleware.js";
import { isAuthenticated } from "../middleware/jwtAuth.js";

// Route to login admin, doctor, or patient
authRouter.post("/login", multerMiddleware, authController.login);

// Route to register a new user (doctor or patient)
authRouter.post("/register", multerMiddleware, authController.register);

// Route to check email existence
authRouter.post(
  "/check-email",
  multerMiddleware,
  authController.checkEmailExists
);

// Route to register a admin
authRouter.post(
  "/register-admin",
  multerMiddleware,
  authController.adminRegister
);

// Route to change password
authRouter.patch(
  "/change-password",
  multerMiddleware,
  isAuthenticated,
  authController.changePassword
);

// Route to reset password by otp
authRouter.patch(
  "/reset-password",
  multerMiddleware,
  authController.forgotPassword
);

// Route to logout
authRouter.get("/logout", authController.logout);

export default authRouter;
