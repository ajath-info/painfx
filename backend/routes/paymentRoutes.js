import express from "express";
import paymentController from "../controller/payment.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

const router = express.Router();

router.post("/create-session", isAuthenticated, paymentController.createCheckoutSession);
router.post("/verify-session", isAuthenticated, paymentController.verifySessionAndSave);

export default router;
