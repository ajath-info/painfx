import express from 'express';
const authRouter = express.Router();
import {authController} from '../controller/auth.js';
import { multerMiddleware } from '../middleware/multerMiddleware.js';

// Route to login admin, doctor, or patient
authRouter.post('/login', multerMiddleware, authController.login);

// Route to register a new user (doctor or patient)
authRouter.post('/register', multerMiddleware, authController.register);

// Route to check email existence
authRouter.post('/check-email', multerMiddleware, authController.checkEmailExists);

// Route to register a admin
authRouter.post('/register-admin', multerMiddleware, authController.adminRegister);

export default authRouter;