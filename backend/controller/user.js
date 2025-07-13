import { apiResponse } from "../utils/helper.js";
import userModel from "../models/userModel.js";

const userController = {
  // get all doctor/patient list for admin with pagination
  getAllUsers: async (req, res) => {
    const { role, name, status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
      if (!role || !["doctor", "patient"].includes(role)) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Invalid role. Must be 'doctor' or 'patient'",
        });
      }

      const result = await userModel.getUsers({
        role,
        name,
        status,
        limit,
        offset,
      });

      return apiResponse(res, {
        message: `${
          role.charAt(0).toUpperCase() + role.slice(1)
        } list fetched successfully`,
        payload: result,
      });
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },

  getDoctorProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await userModel.getDoctorProfile(id);
      if (!data) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Doctor not found",
        });
      }

      return apiResponse(res, {
        message: "Doctor profile fetched successfully",
        payload: data,
      });
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to fetch doctor profile",
      });
    }
  },

  getPatientProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await userModel.getPatientProfile(id);
      if (!data) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Patient not found",
        });
      }

      return apiResponse(res, {
        message: "Patient profile fetched successfully",
        payload: data,
      });
    } catch (error) {
      console.error("Error fetching patient profile:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to fetch patient profile",
      });
    }
  },

  // change status of doctor or patient
  changeUserStatus: async (req, res) => {
    const { status, id } = req.body;

    if (!["1", "2", "3"].includes(String(status))) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message:
          "Invalid status. Must be 1 (Active), 2 (Inactive), or 3 (Pending)",
      });
    }

    try {
      const success = await userModel.updateUserStatus(id, status);
      if (!success) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "User not found or status unchanged",
        });
      }

      return apiResponse(res, {
        message: "User status updated successfully",
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to update user status",
      });
    }
  },
};

export default userController;
