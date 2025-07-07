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
doctorRouter.get("/search-service", doctorController.searchServices);

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

//------------------------------education-----------------------------
// Add one or many education records
doctorRouter.post(
  "/add-educations",
  isAuthenticated,
  authorizeRoles(["doctor"]),
  doctorController.addEducations
);

// Update an education record
doctorRouter.put(
  "/update-education/:id",
  multerMiddleware,
  isAuthenticated,
  authorizeRoles(["doctor"]),
  doctorController.updateEducation
);

// Delete an education record
doctorRouter.delete(
  "/delete-education/:id",
  isAuthenticated,
  authorizeRoles(["doctor"]),
  doctorController.deleteEducation
);

// Get all education records for the doctor
doctorRouter.get(
  "/get-educations",
  isAuthenticated,
  doctorController.getEducations
);

//------------------------------experience-----------------------------
// Add one or many experiences
doctorRouter.post(
  "/add-experiences",
  multerMiddleware,
  isAuthenticated,
  authorizeRoles(["doctor"]),
  doctorController.addExperiences
);

// Update a single experience
doctorRouter.put(
  "/update-experience/:id",
  multerMiddleware,
  isAuthenticated,
  authorizeRoles(["doctor"]),
  doctorController.updateExperience
);

// Delete an experience
doctorRouter.delete(
  "/delete-experience/:id",
  isAuthenticated,
  authorizeRoles(["doctor"]),
  doctorController.deleteExperience
);

// Get all experiences of logged-in doctor
doctorRouter.get(
  "/get-experiences",
  multerMiddleware,
  isAuthenticated,
  doctorController.getExperiences
);

// -------------------------------------Awards------------------------------------
doctorRouter.post(
  "/add-awards",
  isAuthenticated,
  authorizeRoles(["doctor"]),
  doctorController.addAwards
);
doctorRouter.get("/get-awards", isAuthenticated, doctorController.getAwards);
doctorRouter.delete(
  "/delete-award/:id",
  isAuthenticated,
  authorizeRoles(["doctor"]),
  doctorController.deleteAward
);

//--------------------------------- Memberships-----------------------------
doctorRouter.post(
  "/add-memberships",
  isAuthenticated,
  authorizeRoles(["doctor"]),
  doctorController.addMemberships
);
doctorRouter.get(
  "/get-memberships",
  isAuthenticated,
  doctorController.getMemberships
);
doctorRouter.delete(
  "/delete-membership/:id",
  isAuthenticated,
  authorizeRoles(["doctor"]),
  doctorController.deleteMembership
);

// -----------------------Doctor Registration------------------------------------
doctorRouter.post(
  "/add-registration",
  isAuthenticated,
  authorizeRoles(["doctor"]),
  doctorController.addDoctorRegistration
);
doctorRouter.get(
  "/get-registration",
  isAuthenticated,
  doctorController.getDoctorRegistration
);
doctorRouter.delete(
  "/delete-registration/:id",
  isAuthenticated,
  authorizeRoles(["doctor"]),
  doctorController.deleteDoctorRegistration
);

export default doctorRouter;
