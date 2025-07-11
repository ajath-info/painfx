import express from "express";
const partnerRouter = express.Router();

import partnerController from "../controller/partner.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

// ---------------- Admin APIs ----------------
partnerRouter.post(
  "/add-or-update",
  isAuthenticated,
  authorizeRoles(["admin"]),
  partnerController.addOrUpdate
);

partnerRouter.get(
  "/get-all",
  isAuthenticated,
  authorizeRoles(["admin"]),
  partnerController.getAll
);

partnerRouter.put(
  "/toggle-status/:id",
  isAuthenticated,
  authorizeRoles(["admin"]),
  partnerController.toggleStatus
);

partnerRouter.delete(
  "/delete/:id",
  isAuthenticated,
  authorizeRoles(["admin"]),
  partnerController.deletePartner
);

// ---------------- Public API ----------------
partnerRouter.get("/get-active", partnerController.getActive);

export default partnerRouter;
