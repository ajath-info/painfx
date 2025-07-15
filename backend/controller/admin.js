import adminModel from "../models/adminModel.js"
import { uploadImage, deleteImage } from "../utils/fileHelper.js"
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
    const { f_name, l_name, phone, phone_code, email, prefix, user_name } =
      req.body;

    try {
      const admin = await adminModel.getById(id);
      if (!admin) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Admin not found",
        });
      }

      let profile_image = admin.profile_image;
      if (req.files?.image) {
        if (profile_image) {
          deleteImage(profile_image);
        }
        profile_image = await uploadImage(req.files.image, "admin");
      }

      const updatedData = {
        ...(f_name && { f_name }),
        ...(l_name && { l_name }),
        ...(prefix && { prefix }),
        ...(phone && { phone }),
        ...(phone_code && { phone_code }),
        ...(email && { email }),
        ...(user_name && { user_name }),
        ...(profile_image && { profile_image }),
      };

      // Auto-update full_name if name or prefix changed
      if (f_name || l_name || prefix) {
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
};

export default adminController;
