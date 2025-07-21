import caregiverModel from "../models/caregiverModel.js";
import { apiResponse } from "../utils/helper.js";
import validator from "validator";

const caregiverController = {
  addOrUpdate: async (req, res) => {
    try {
      const patientId = req.user.id;
      const {
        id,
        name,
        phone,
        email,
        relationship,
        address_line1,
        address_line2,
        city,
        state,
        country,
        pin_code,
      } = req.body;

      if (!name || validator.isEmpty(name.trim())) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Name is required",
        });
      }

      if (id) {
        const existing = await caregiverModel.getById(id, patientId);
        if (!existing) {
          return apiResponse(res, {
            error: true,
            code: 404,
            status: 0,
            message: "Caregiver not found",
          });
        }
        await caregiverModel.update(id, {
          name,
          phone,
          email,
          relationship,
          address_line1,
          address_line2,
          city,
          state,
          country,
          pin_code,
        });

        return apiResponse(res, {
          error: false,
          code: 200,
          status: 1,
          message: "Caregiver updated successfully",
        });
      } else {
        await caregiverModel.create(patientId, {
          name,
          phone,
          email,
          relationship,
          address_line1,
          address_line2,
          city,
          state,
          country,
          pin_code,
        });

        return apiResponse(res, {
          error: false,
          code: 201,
          status: 1,
          message: "Caregiver added successfully",
        });
      }
    } catch (error) {
      console.error("Error in addOrUpdate Caregiver:", error);
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
      const patientId = req.user.id;
      const { page = 1, limit = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const { total, rows } = await caregiverModel.getPaginated(
        patientId,
        parseInt(limit),
        offset
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: { total, page: parseInt(page), limit: parseInt(limit), data: rows },
      });
    } catch (error) {
      console.error("Error in getAll caregivers:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch caregivers",
      });
    }
  },

  getActiveWithSearch: async (req, res) => {
    try {
      const patientId = req.user.id;
      const { search = "" } = req.query;
      const data = await caregiverModel.getActive(patientId, search);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: data,
      });
    } catch (error) {
      console.error("Error in getActiveWithSearch:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch active caregivers",
      });
    }
  },

  toggleStatus: async (req, res) => {
    try {
      const patientId = req.user.id;
      const { id } = req.params;
      const existing = await caregiverModel.getById(id, patientId);
      if (!existing) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Caregiver not found",
        });
      }

      const newStatus = existing.status === "1" ? "2" : "1";
      await caregiverModel.toggleStatus(id, newStatus);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: `Caregiver ${newStatus === "1" ? "activated" : "deactivated"} successfully`,
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
};

export default caregiverController;
