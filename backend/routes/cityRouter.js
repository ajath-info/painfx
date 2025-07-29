import express from "express";
import { cityController } from "../controller/city.js";
const cityRouter = express.Router();
import { isAuthenticated, optionalAuth } from "../middleware/jwtAuth.js";

cityRouter.get("/cities", cityController.getCities);
cityRouter.get("/clinics", cityController.getClinicsAndDoctorsByCity);
cityRouter.get("/doctors/all",optionalAuth, cityController.getAllDoctors);

export default cityRouter;
