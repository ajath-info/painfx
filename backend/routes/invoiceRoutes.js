import express from "express";
import invoiceController from "../controller/invoice.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

const invoiceRouter = express.Router();

invoiceRouter.post("/generate", isAuthenticated, authorizeRoles(["patient"]), invoiceController.generateInvoice);
invoiceRouter.get("/by-appointment/:appointment_id", isAuthenticated, invoiceController.getByAppointment);
invoiceRouter.get("/by-user", isAuthenticated, authorizeRoles(["patient"]), invoiceController.getByUser);
invoiceRouter.get("/by-doctor", isAuthenticated, authorizeRoles(["doctor"]), invoiceController.getByDoctor);
invoiceRouter.get("/all", isAuthenticated, authorizeRoles(["admin", "clinic"]), invoiceController.getAll);
invoiceRouter.get("/filter", isAuthenticated, authorizeRoles(["admin", "clinic"]), invoiceController.getFiltered);
invoiceRouter.patch("/update-status/:id", isAuthenticated, authorizeRoles(["admin", "doctor"]), invoiceController.updateStatus);
invoiceRouter.get('/details/:invoice_id', invoiceController.getInvoiceDetails);

export default invoiceRouter;