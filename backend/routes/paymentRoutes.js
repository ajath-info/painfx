import express from "express";
import paymentController from "../controller/payment.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

const router = express.Router();

router.post(
  "/create-intent",
  isAuthenticated,
  authorizeRoles(["patient"]),
  paymentController.createPaymentIntent
);

router.post(
  "/verify",
  isAuthenticated,
  authorizeRoles(["patient"]),
  paymentController.verifyAndSavePayment
);

export default router;
