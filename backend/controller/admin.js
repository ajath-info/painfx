import adminModel from "../models/adminModel.js";
import { uploadImage, deleteImage } from "../utils/fileHelper.js";
import { apiResponse } from "../utils/helper.js";

const adminController = {
  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const admin = await adminModel.getById(id);
      if (!admin) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Admin not found",
        });
      }
      return apiResponse(res, {
        message: "Admin profile fetched successfully",
        payload: admin,
      });
    } catch (error) {
      console.error("Get admin error:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Internal server error",
      });
    }
  },

  updateProfile: async (req, res) => {
    const { id } = req.params;
    const {
      f_name,
      l_name,
      prefix,
      phone,
      phone_code,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pin_code,
    } = req.body;

    try {
      const admin = await adminModel.getById(id);
      if (!admin) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Admin not found",
        });
      }

      // === Validation ===
      if (f_name !== undefined && f_name.trim() === "") {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "First name cannot be empty",
        });
      }
      if (l_name !== undefined && l_name.trim() === "") {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Last name cannot be empty",
        });
      }
      if (prefix !== undefined && !["Mr", "Mrs", "Ms", "Dr"].includes(prefix)) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Invalid prefix",
        });
      }

      // === Image Handling ===
      let profile_image = admin.profile_image;
      if (req.files?.image) {
        if (profile_image) deleteImage(profile_image);
        profile_image = await uploadImage(req.files.image, "admin");
      }

      // === Prepare Update Data ===
      const updatedData = {
        ...(f_name !== undefined && { f_name }),
        ...(l_name !== undefined && { l_name }),
        ...(prefix !== undefined && { prefix }),
        ...(phone !== undefined && { phone }),
        ...(phone_code !== undefined && { phone_code }),
        ...(address_line1 !== undefined && { address_line1 }),
        ...(address_line2 !== undefined && { address_line2 }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(country !== undefined && { country }),
        ...(pin_code !== undefined && { pin_code }),
        ...(profile_image && { profile_image }),
      };

      // === Update full_name dynamically ===
      if (
        f_name !== undefined ||
        l_name !== undefined ||
        prefix !== undefined
      ) {
        updatedData.full_name = `${prefix || admin.prefix} ${
          f_name || admin.f_name
        } ${l_name || admin.l_name}`;
      }

      await adminModel.update(id, updatedData);

      return apiResponse(res, {
        message: "Admin profile updated successfully",
      });
    } catch (error) {
      console.error("Update admin error:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to update admin profile",
      });
    }
  },

  dashboardAnalyticsData: async (req, res) => {
    try {
      const analyticsData = await adminModel.getDashboardAnalytics();
      return apiResponse(res, {
        status: 1,
        message: "Dashboard analytics data fetched successfully",
        error: false,
        payload: analyticsData,
      });
    } catch (err) {
      console.error("Error fetching dashboard analytics:", err);
      return apiResponse(res, {
        status: 0,
        error: true,
        message: "Internal server error",
      });
    }
  },
};

export default adminController;
