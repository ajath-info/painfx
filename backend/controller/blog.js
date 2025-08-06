import BlogModel from "../models/blogModel.js";
import { apiResponse } from "../utils/helper.js";
import { uploadImage, deleteImage } from "../utils/fileHelper.js";
import validator from "validator";

const blogController = {
  addOrUpdate: async (req, res) => {
    try {
      const { id, title, description } = req.body;

      // Validate title
      if (!title || validator.isEmpty(title.trim())) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Blog title is required",
        });
      }

      let existing = null;
      let image_url = null;

      // If updating, check if blog exists
      if (id) {
        existing = await BlogModel.getById(id);
        if (!existing) {
          return apiResponse(res, {
            error: true,
            code: 404,
            status: 0,
            message: "Blog not found",
          });
        }
        image_url = existing.image_url;
      }

      // Handle image upload
      if (req.files?.image) {
        // If updating and old image exists, delete it
        if (existing?.image_url) {
          deleteImage(existing.image_url);
        }
        image_url = await uploadImage(req.files.image, "blog");
      }

      // Image is required for new blog creation
      if (!id && !image_url) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Image is required for adding a new blog",
        });
      }

      await BlogModel.addOrUpdate({ id, title, description, image_url });
      return apiResponse(res, {
        error: false,
        code: id ? 200 : 201,
        status: 1,
        message: id ? "Blog updated successfully" : "Blog added successfully",
      });
    } catch (error) {
      console.error("Error in addOrUpdate:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },

  getAll: async (req, res) => {
    try {
      let { page = 1, limit = 10 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const offset = (page - 1) * limit;

      const { total, rows } = await BlogModel.getPaginated(limit, offset);
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: { total, page, limit, data: rows },
      });
    } catch (error) {
      console.error("Error in getAll:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch blogs",
      });
    }
  },

  get: async (req, res) => {
    try {
      const { id } = req.params;
      const blog = await BlogModel.getById(id);

      if (!blog) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Blog not found",
        });
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: blog,
      });
    } catch (error) {
      console.error("Error in get:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },

  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await BlogModel.getById(id);

      if (!existing) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Blog not found",
        });
      }

      await BlogModel.toggleStatus(id);
      const newStatus = existing.status === "1" ? "2" : "1";

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: `Blog ${newStatus === "1" ? "activated" : "deactivated"} successfully`,
      });
    } catch (error) {
      console.error("Error in toggleStatus:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },

  deleteBlog: async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await BlogModel.getById(id);

      if (!existing) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Blog not found",
        });
      }

      if (existing.image_url) {
        deleteImage(existing.image_url);
      }

      await BlogModel.deleteById(id);
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Blog deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteBlog:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },

  getActive: async (req, res) => {
    try {
      const rows = await BlogModel.getLatestActive();
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: rows,
      });
    } catch (error) {
      console.error("Error in getActive:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch active blogs",
      });
    }
  },
};

export default blogController;