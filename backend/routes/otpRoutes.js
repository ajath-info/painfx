import express from "express";
const otpRouter = express.Router();
import { sendOTP, verifyOTP } from "../controller/otp.js";
import { multerMiddleware } from "../middleware/multerMiddleware.js";

// send otp
otpRouter.post("/send", multerMiddleware, sendOTP);

// verify otp
otpRouter.post("/verify", multerMiddleware, verifyOTP);

export default otpRouter;
