import validator from "validator";
import { apiResponse } from "../utils/helper.js";
import { uploadImage, deleteImage } from "../utils/fileHelper.js";
import SpecializationModel from "../models/specialtyModel.js";

const specialtyController = {
  addOrUpdateSpecialty: async (req, res) => {
    try {
      const { id, name } = req.body;
      // Use req.user info for role and clinic_id
      const userRole = req.user.role;
      const clinic_id = userRole === "clinic" ? req.user.id : null;

      if (!name || validator.isEmpty(name.trim())) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Specialization name is required",
        });
      }

      let image_url = null;
      let existing = null;

      if (id) {
        existing = await SpecializationModel.getById(id);
        if (!existing) {
          return apiResponse(res, {
            error: true,
            code: 404,
            status: 0,
            message: "Specialization not found",
          });
        }
      }

      if (req.files && req.files.image) {
        if (existing?.image_url) deleteImage(existing.image_url);
        image_url = await uploadImage(req.files.image, "spec");
      }

      if (id) {
        const updated = await SpecializationModel.update(id, { name, image_url }, clinic_id, userRole);
        if (!updated) {
          return apiResponse(res, {
            error: true,
            code: 403,
            status: 0,
            message: "Not authorized to update this specialization",
          });
        }
        return apiResponse(res, {
          error: false,
          code: 200,
          status: 1,
          message: "Specialization updated successfully",
        });
      } else {
        const exists = await SpecializationModel.existsByName(name, clinic_id);
        if (exists) {
          return apiResponse(res, {
            error: true,
            code: 409,
            status: 0,
            message: "Specialization with this name already exists",
          });
        }

        await SpecializationModel.create({ name, image_url, clinic_id });
        return apiResponse(res, {
          error: false,
          code: 201,
          status: 1,
          message: "Specialization added successfully",
        });
      }
    } catch (error) {
      console.error("Error in addOrUpdateSpecialty:", error);
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
      const userRole = req.user.role;
      const clinic_id = userRole === "clinic" ? req.user.id : null;

      if (!id) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "ID is required",
        });
      }

      const existing = await SpecializationModel.getById(id);
      if (!existing) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Specialization not found",
        });
      }

      const newStatus = existing.status === "1" ? "2" : "1";

      const toggled = await SpecializationModel.toggleStatus(id, newStatus, clinic_id, userRole);
      if (!toggled) {
        return apiResponse(res, {
          error: true,
          code: 403,
          status: 0,
          message: "Not authorized to change status of this specialization",
        });
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: `Specialization ${newStatus === "1" ? "activated" : "deactivated"} successfully`,
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

  getAll: async (req, res) => {
    try {
      let { page = 1, limit = 10, status } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const offset = (page - 1) * limit;

      const userRole = req.user.role;
      const clinic_id = userRole === "clinic" ? req.user.id : null;

      const { total, rows } = await SpecializationModel.getPaginated(status, limit, offset, userRole, clinic_id);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: {
          total,
          page,
          limit,
          data: rows,
        },
      });
    } catch (error) {
      console.error("Error in getAll:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch specializations",
      });
    }
  },

  searchOrListSpecializations: async (req, res) => {
    try {
      const search = req.query.search?.trim() || "";
      const rows = await SpecializationModel.searchPublic(search);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: rows,
      });
    } catch (error) {
      console.error("Error searching specializations:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch specializations",
      });
    }
  },
};

export default specialtyController;
