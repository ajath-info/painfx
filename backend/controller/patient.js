import patientModel from "../models/patientModel.js";
import { apiResponse } from "../utils/helper.js";
import { uploadImage, deleteImage } from "../utils/fileHelper.js";
import validator from "validator";

const patientController = {
  // patient can add or remove doctor from own favorite list
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

  // list of favorite doctor for patient
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

  // Doctor's patient list with pagination on the basis of appointment booked
  doctorPatients: async (req, res) => {
    try {
      const doctor_id = req.user?.id;

      // Pagination
      let { page = 1, limit = 10 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const offset = (page - 1) * limit;

      const { total, patients } = await patientModel.getDoctorPatients(
        doctor_id,
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
          data: patients,
        },
      });
    } catch (error) {
      console.error("Error in fetching doctor patients:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },

  // update profile of patient
  updateProfile: async (req, res) => {
    const patient_id = req.user.id;
    const {
      prefix,
      f_name,
      l_name,
      phone,
      phone_code,
      DOB,
      gender,
      bio,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pin_code,
    } = req.body;

    try {
      const validPrefixes = ["Mr", "Mrs", "Ms", "Dr"];
      const validGenders = ["male", "female", "other"];

      const patient = await patientModel.getById(patient_id);
      if (!patient) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Patient not found",
        });
      }

      // VALIDATIONS
      if (prefix && !validPrefixes.includes(prefix)) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Invalid prefix",
        });
      }

      if (phone) {
        if (!validator.isMobilePhone(phone + "", "any")) {
          return apiResponse(res, {
            error: true,
            code: 400,
            status: 0,
            message: "Invalid phone number",
          });
        }
        if (!phone_code) {
          return apiResponse(res, {
            error: true,
            code: 400,
            status: 0,
            message: "Phone code is required if phone is provided",
          });
        }
      }

      if (gender && !validGenders.includes(gender)) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Invalid gender",
        });
      }

      // Upload image if new one provided
      let profile_image = patient.profile_image;
      if (req.files?.image) {
        if (profile_image) {
          deleteImage(profile_image);
        }
        profile_image = await uploadImage(req.files.image, "patients");
      }

      const updatedData = {
        prefix,
        f_name,
        l_name,
        full_name: `${prefix || patient.prefix} ${f_name || patient.f_name} ${
          l_name || patient.l_name
        }`,
        phone,
        phone_code,
        DOB,
        gender,
        bio,
        profile_image,
        address_line1,
        address_line2,
        city,
        state,
        country,
        pin_code,
      };

      await patientModel.update(patient_id, updatedData);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating patient profile:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to update profile",
      });
    }
  },
};

export default patientController;
