import express from "express";
import { cityController } from "../controller/city.js";
const cityRouter = express.Router();

cityRouter.get("/cities", cityController.getCities);
cityRouter.get("/clinics", cityController.getClinicsAndDoctorsByCity);

export default cityRouter;
