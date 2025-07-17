import express from "express";
const faqRouter = express.Router();

import faqController from "../controller/faq.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

// ---------------- Admin APIs ----------------
faqRouter.post(
  "/add-or-update",
  isAuthenticated,
  authorizeRoles(["admin"]),
  faqController.addOrUpdate
);

faqRouter.get(
  "/get-all",
  isAuthenticated,
  authorizeRoles(["admin"]),
  faqController.getAll
);

faqRouter.put(
  "/toggle-status/:id",
  isAuthenticated,
  authorizeRoles(["admin"]),
  faqController.toggleStatus
);

faqRouter.delete(
  "/delete/:id",
  isAuthenticated,
  authorizeRoles(["admin"]),
  faqController.deleteFAQ
);

// ---------------- Public API ----------------
faqRouter.get("/get-active", faqController.getActive);

export default faqRouter;
