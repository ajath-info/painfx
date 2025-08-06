import express from "express";
import blogController from "../controller/blog.js";
import { isAuthenticated, authorizeRoles } from "../middleware/jwtAuth.js";

const blogRouter = express.Router();

// Admin Blog Routes
blogRouter.post(
  "/",
  isAuthenticated,
  authorizeRoles(["admin"]),
  blogController.addOrUpdate
);

blogRouter.get("/latest", blogController.getActive);
blogRouter.get("/", isAuthenticated, authorizeRoles(["admin"]), blogController.getAll);


blogRouter.patch(
  "/:id/status",
  isAuthenticated,
  authorizeRoles(["admin"]),
  blogController.toggleStatus
);

blogRouter.get("/:id", blogController.get);

blogRouter.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles(["admin"]),
  blogController.deleteBlog
);

// Public route to fetch latest active blogs

export default blogRouter;