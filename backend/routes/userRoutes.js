import express from 'express';
const userRouter = express.Router();
import {userController} from '../controller/user.js';
import { multerMiddleware } from '../middleware/multerMiddleware.js';

// Route to login admin, doctor, or patient
userRouter.get('/doctor-profile/:id', userController.getDoctorProfile);

// Route to register a new user (doctor or patient)
userRouter.get('/patient-profile/:id', userController.getPatientProfile);


export default userRouter;