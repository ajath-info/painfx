import express from "express";
const doctorAvailabilityRouter = express.Router();
import doctorAvailabilityController from "../controller/doctorAvailblity.js"
import { isAuthenticated } from "../middleware/jwtAuth.js";

// Route to add or update doctor availability
doctorAvailabilityRouter.post(
    "/add-or-update-availability",
    isAuthenticated,
    doctorAvailabilityController.addOrUpdateAvailability
);

// Route to get doctor availability pass clinic_id for clinic visit or leave it empty for home visit
doctorAvailabilityRouter.get(
    "/get-availability",
    isAuthenticated,
    doctorAvailabilityController.getAvailabilityGroupedByDayWithSlots
);

// Route to get doctor availability by date, doctor id and clinic_id optional
doctorAvailabilityRouter.get(
    "/get-availability-by-date",
    doctorAvailabilityController.getSlotsForDate
);

export default doctorAvailabilityRouter;