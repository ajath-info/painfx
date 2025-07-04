import express from 'express';
const authRouter = express.Router();
import {authController} from '../controller/auth.js';

// Route to login admin, doctor, or patient
authRouter.post('/login', authController.login);

// Route to register a new user (doctor or patient)
authRouter.post('/register', authController.register);

// Route to check email existence
authRouter.post('/check-email', authController.checkEmailExists);

// Route to register a admin
authRouter.post('/register-admin', authController.adminRegister);

export default authRouter;