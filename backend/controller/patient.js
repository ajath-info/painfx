import patientModel from "../models/patientModel.js";
import { apiResponse } from "../utils/helper.js";
import { uploadImage, deleteImage } from "../utils/fileHelper.js";
import validator from "validator";

const patientController = {
  toggleFavoriteDoctor: async (req, res) => {
    try {
      const patient_id = req.user.id; // from JWT
      const { doctor_id } = req.body;

      if (!doctor_id) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Doctor ID is required",
        });
      }

      const result = await patientModel.toggleFavoriteDoctor(
        patient_id,
        doctor_id
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: `Doctor successfully ${result.action} from favorites`,
      });
    } catch (error) {
      console.error("Error in toggling favorite doctors:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },
  
  getFavoriteDoctors: async (req, res) => {
    try {
      const patient_id = req.user.id;
      let { page = 1, limit = 10 } = req.query;

      page = parseInt(page);
      limit = parseInt(limit);
      const offset = (page - 1) * limit;

      const { total, rows } = await patientModel.getFavoriteDoctors(
        patient_id,
        limit,
        offset
      );

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
      console.error("Error in fetching favorite doctors:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },
};

export default patientController;
