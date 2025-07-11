import PartnerModel from "../models/partnerModel.js";
import { apiResponse } from "../utils/helper.js";
import { uploadImage, deleteImage } from "../utils/fileHelper.js";
import validator from "validator";

const partnerController = {
  addOrUpdate: async (req, res) => {
    try {
      const { id, name, website_url } = req.body;

      // Validate name
      if (!name || validator.isEmpty(name.trim())) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Partner name is required",
        });
      }

      let existing = null;
      let image_url = null;

      // If updating, check if partner exists
      if (id) {
        existing = await PartnerModel.getById(id);
        if (!existing) {
          return apiResponse(res, {
            error: true,
            code: 404,
            status: 0,
            message: "Partner not found",
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
        image_url = await uploadImage(req.files.image, "partner");
      }

      // Image is required for new partner creation
      if (!id && !image_url) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Image is required for adding a new partner",
        });
      }

      if (id) {
        // Update partner
        await PartnerModel.update(id, { name, image_url, website_url });
        return apiResponse(res, {
          error: false,
          code: 200,
          status: 1,
          message: "Partner updated successfully",
        });
      } else {
        // Add new partner
        await PartnerModel.create({ name, image_url, website_url });
        return apiResponse(res, {
          error: false,
          code: 201,
          status: 1,
          message: "Partner added successfully",
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

      const { total, rows } = await PartnerModel.getPaginated(limit, offset);
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
        message: "Failed to fetch partners",
      });
    }
  },

  getActive: async (req, res) => {
    try {
      const rows = await PartnerModel.getActive();
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
        message: "Failed to fetch active partners",
      });
    }
  },

  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await PartnerModel.getById(id);

      if (!existing) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Partner not found",
        });
      }

      const newStatus = existing.status === "1" ? "2" : "1";
      await PartnerModel.toggleStatus(id, newStatus);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: `Partner ${
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

  deletePartner: async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await PartnerModel.getById(id);

      if (!existing) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Partner not found",
        });
      }

      if (existing.image_url) {
        deleteImage(existing.image_url);
      }

      await PartnerModel.delete(id);
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Partner deleted successfully",
      });
    } catch (error) {
      console.error("Error in deletePartner:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },
};

export default partnerController;
