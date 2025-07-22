import { apiResponse } from "../utils/helper.js";
import userModel from "../models/userModel.js";

const userController = {
  // get all doctor/patient list for admin with pagination
  getAllUsers: async (req, res) => {
    try {
      const { role, search, page, limit } = req.query;
      if (!["doctor", "patient"].includes(role)) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Invalid role",
        });
      }

      const result = await userModel.getUsersByRole(
        role,
        { search },
        { page, limit },
        req.user // from auth middleware
      );

      return apiResponse(res, {
        message: "User list fetched successfully",
        payload: {
          users: result.users,
          total: result.total,
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 20,
        },
      });
    } catch (err) {
      console.error(err);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Something went wrong",
      });
    }
  },

  getDoctorProfile: async (req, res) => {
    try {
      let { id } = req.query;

      // Use logged-in user's ID if not explicitly provided
      if (!id && req.user) {
        id = req.user.id;
      }

      // If still no ID, reject the request
      if (!id) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Doctor ID is required",
        });
      }
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
      let { id } = req.query;

      // Use logged-in user's ID if not explicitly provided
      if (!id && req.user) {
        id = req.user.id;
      }

      // If still no ID, reject the request
      if (!id) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "User ID is required",
        });
      }
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
