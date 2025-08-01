import ComplianceModel from "../models/complianceModel.js";
import { apiResponse } from "../utils/helper.js";
import { uploadImage, deleteImage } from "../utils/fileHelper.js";
import validator from "validator";

const complianceController = {
  addOrUpdate: async (req, res) => {
    try {
      const { id, name, redirect_link, type } = req.body;

      // Validate mandatory fields
      if (!name || validator.isEmpty(name.trim())) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Compliance name is required",
        });
      }

      if (!redirect_link || validator.isEmpty(redirect_link.trim())) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Redirect link is required",
        });
      }

      if (!type || !["cta", "compliance"].includes(type)) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Valid type (cta or compliance) is required",
        });
      }

      let existing = null;
      let image_url = null;

      // If updating, check if compliance exists
      if (id) {
        existing = await ComplianceModel.getById(id);
        if (!existing) {
          return apiResponse(res, {
            error: true,
            code: 404,
            status: 0,
            message: "Compliance not found",
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
        image_url = await uploadImage(req.files.image, "compliance");
      }

      if (id) {
        // Update compliance
        await ComplianceModel.update(id, { name, image_url, redirect_link, type });
        return apiResponse(res, {
          error: false,
          code: 200,
          status: 1,
          message: "Compliance updated successfully",
        });
      } else {
        // Add new compliance
        await ComplianceModel.create({ name, image_url, redirect_link, type });
        return apiResponse(res, {
          error: false,
          code: 201,
          status: 1,
          message: "Compliance added successfully",
        });
      }
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

      const { total, rows } = await ComplianceModel.getPaginated(limit, offset);
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
        message: "Failed to fetch compliances",
      });
    }
  },

  getActive: async (req, res) => {
    try {
      const { type } = req.params;
      if (!["cta", "compliance"].includes(type)) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Invalid type. Must be 'cta' or 'compliance'",
        });
      }

      const rows = await ComplianceModel.getActive(type);
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
        message: "Failed to fetch active compliances",
      });
    }
  },

  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await ComplianceModel.getById(id);

      if (!existing) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Compliance not found",
        });
      }

      const newStatus = existing.status === "1" ? "2" : "1";
      await ComplianceModel.toggleStatus(id, newStatus);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: `Compliance ${
          newStatus === "1" ? "activated" : "deactivated"
        } successfully`,
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

  deleteCompliance: async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await ComplianceModel.getById(id);

      if (!existing) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Compliance not found",
        });
      }

      if (existing.image_url) {
        deleteImage(existing.image_url);
      }

      await ComplianceModel.delete(id);
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Compliance deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteCompliance:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },
};

export default complianceController;