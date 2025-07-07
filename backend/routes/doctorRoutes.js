import express from "express";
const doctorRouter = express.Router();
import { multerMiddleware } from "../middleware/multerMiddleware.js";
import doctorController from "../controller/doctor.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";


//-----------------------------services-----------------------------
// Route to add or map specialization
doctorRouter.post(
  "/add-or-map-specialization",
  multerMiddleware,
  isAuthenticated,
  authorizeRoles(["doctor"]),
  doctorController.addOrMapSpecialization
);

// Route to get search specialization
doctorRouter.get(
  "/search-specialization",
  doctorController.searchSpecializations
);

// Route to get doctor's specializations
doctorRouter.get(
  "/get-specializations",
  multerMiddleware,
  isAuthenticated,
  doctorController.getDoctorSpecializations
);

// Route to delete specialization mapping
doctorRouter.delete(
  "/delete-specialization-mapping/:map_id",
  multerMiddleware,
  isAuthenticated,
  authorizeRoles(["doctor"]),
  doctorController.removeSpecializationFromDoctor
);


//-----------------------------services-----------------------------
// 1. Add or map a service
doctorRouter.post(
  "/add-or-map-service",
  multerMiddleware,
  isAuthenticated,
  authorizeRoles(["doctor"]),
  doctorController.addOrMapService
);

// 2. Search available services
doctorRouter.get(
  "/search-service",
  doctorController.searchServices
);

// 3. Get all services mapped to doctor
doctorRouter.get(
  "/get-services",
  multerMiddleware,
  isAuthenticated,
  doctorController.getDoctorServices
);

// 4. Remove mapped service (hard delete)
doctorRouter.delete(
  "/delete-service-mapping/:map_id",
  multerMiddleware,
  isAuthenticated,
  authorizeRoles(["doctor"]),
  doctorController.removeServiceFromDoctor
);



export default doctorRouter;
