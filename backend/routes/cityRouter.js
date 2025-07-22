import express from "express";
import { cityController } from "../controller/city.js";
const cityRouter = express.Router();

cityRouter.get("/cities", cityController.getCities);
cityRouter.get("/clinics", cityController.getClinicsAndDoctorsByCity);
cityRouter.get("/doctors/all", cityController.getAllDoctors);

export default cityRouter;
