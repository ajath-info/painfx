import express from 'express';
const doctorRouter = express.Router();
import doctorController from '../controller/doctor.js';

// Route to get all doctors
doctorRouter.get('/', doctorController.getDoctors);



export default doctorRouter;