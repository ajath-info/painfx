import express from 'express';
const doctorRouter = express.Router();
import {userController} from '../controller/user.js';

// Route to get all doctors
doctorRouter.get('/doctor/:id', userController.getDoctorProfile);

export default doctorRouter;