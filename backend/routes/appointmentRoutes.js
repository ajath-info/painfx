import express from "express";
const appointmentRouter = express.Router();
import appointmentController from "../controller/appointment.js";
import { isAuthenticated } from "../middleware/jwtAuth.js";
import { multerMiddleware } from "../middleware/multerMiddleware.js";

// ----------------------------- Appointment Management -----------------------------

// Book an appointment
appointmentRouter.post(
  "/book",
  multerMiddleware,
  isAuthenticated,
  appointmentController.bookAppointment
);

// GET appointments by ID
appointmentRouter.get(
  "/:appointment_id",
  isAuthenticated,
  appointmentController.getAppointmentById
);

// GET appointments by patient, doctor ID or upcoming, today appointments
appointmentRouter.get(
  "/",
  isAuthenticated,
  appointmentController.getAppointments
);

// Update appointment details or status
appointmentRouter.put(
  "/update",
  multerMiddleware,
  isAuthenticated,
  appointmentController.updateAppointmentStatus
);

// Update appointment payment details
appointmentRouter.put(
  "/payment",
  multerMiddleware,
  isAuthenticated,
  appointmentController.updatePaymentStatus
);

export default appointmentRouter;
