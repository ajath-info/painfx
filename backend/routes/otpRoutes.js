import express from "express";
const otpRouter = express.Router();
import { sendOTP, verifyOTP } from "../controller/otp.js";

// send otp
otpRouter.post("/send",  sendOTP);

// verify otp
otpRouter.post("/verify",  verifyOTP);

export default otpRouter;
