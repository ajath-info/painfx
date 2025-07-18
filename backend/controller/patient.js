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

  // master update profile of patient
  updateProfile: async (req, res) => {
    const patient_id = req.user.id;
    try {
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
        doctor_name,
        doctor_address,
        permission_to_contact,
        referral_source,
        injury_location,
        reason_for_services,
        treatment_goals,
        problem_duration,
        had_similar_problem,
        pain_description,
        symptoms,
        problem_status,
        pain_triggers,
        pain_interference,
        insurance_name,
        veterans_card_number,
        medicare_epc,
        claim_through_worker_comp,
        type_of_work,
        other_health_professionals,
        medications,
        ever_taken_cortisone,
        pregnancy_status,
        medical_conditions,
      } = req.body;

      console.log("Received files:", req.files); // Log req.files to verify
      const validPrefixes = ["Mr", "Mrs", "Ms", "Dr"];
      const validGenders = ["male", "female", "other"];
      const validProblemStatus = [
        "about_same",
        "getting_better",
        "getting_worse",
      ];
      const validPregnancyStatus = ["yes", "no", "na"];

      const patient = await patientModel.getById(patient_id);
      if (!patient) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Patient not found",
        });
      }

      // Validate enums
      if (prefix && !validPrefixes.includes(prefix)) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Invalid prefix",
        });
      }
      if (gender && !validGenders.includes(gender)) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Invalid gender",
        });
      }
      if (problem_status && !validProblemStatus.includes(problem_status)) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Invalid problem status",
        });
      }
      if (
        pregnancy_status &&
        !validPregnancyStatus.includes(pregnancy_status)
      ) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Invalid pregnancy status",
        });
      }

      if (
        phone &&
        (!validator.isMobilePhone(phone.trim(), "any") || !phone_code)
      ) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Invalid phone or missing code",
        });
      }

      let profile_image = patient.profile_image;
      if (req.files?.image) {
        if (profile_image) deleteImage(profile_image);
        profile_image = await uploadImage(req.files.image, "patients");
      }

      const sanitize = (v) => (typeof v === "string" ? v.trim() : v);

      const userData = {
        prefix: sanitize(prefix),
        f_name: sanitize(f_name),
        l_name: sanitize(l_name),
        full_name: `${sanitize(prefix || patient.prefix)} ${sanitize(
          f_name || patient.f_name
        )} ${sanitize(l_name || patient.l_name)}`,
        phone: sanitize(phone),
        phone_code: sanitize(phone_code),
        DOB,
        gender,
        bio: sanitize(bio),
        profile_image,
        address_line1: sanitize(address_line1),
        address_line2: sanitize(address_line2),
        city: sanitize(city),
        state: sanitize(state),
        country: sanitize(country),
        pin_code: sanitize(pin_code),
      };

      const profileFields = {
        doctor_name: sanitize(doctor_name),
        doctor_address: sanitize(doctor_address),
        permission_to_send_letter:
          permission_to_contact === "true" || permission_to_contact === true,
        referral_source: sanitize(referral_source),
        injury_location: sanitize(injury_location),
        reason: sanitize(reason_for_services),
        treatment_goals: sanitize(treatment_goals),
        duration_of_problem: sanitize(problem_duration),
        similar_problem_before:
          had_similar_problem === "true" || had_similar_problem === true,
        pain_description: Array.isArray(pain_description)
          ? JSON.stringify(pain_description)
          : null,
        symptoms: Array.isArray(symptoms) ? JSON.stringify(symptoms) : null,
        problem_status,
        pain_triggers: Array.isArray(pain_triggers)
          ? JSON.stringify(pain_triggers)
          : null,
        pain_interference: Array.isArray(pain_interference)
          ? JSON.stringify(pain_interference)
          : null,
        private_insurance_name: sanitize(insurance_name),
        veterans_card_number: sanitize(veterans_card_number),
        has_medicare_plan: medicare_epc === "true" || medicare_epc === true,
        claiming_compensation:
          claim_through_worker_comp === "true" ||
          claim_through_worker_comp === true,
        type_of_work: sanitize(type_of_work),
        other_health_professionals_seen: sanitize(other_health_professionals),
        medications: sanitize(medications),
        taken_cortisone:
          ever_taken_cortisone === "true" || ever_taken_cortisone === true,
        pregnancy_status,
        high_blood_pressure: !!medical_conditions?.includes?.(
          "high_blood_pressure"
        ),
        heart_problems: !!medical_conditions?.includes?.("heart_problems"),
        diabetes: !!medical_conditions?.includes?.("diabetes"),
        cancer: !!medical_conditions?.includes?.("cancer"),
      };

      await patientModel.update(patient_id, userData);
      await patientModel.upsert(patient_id, profileFields);

      return apiResponse(res, {
        error: false,
        code: 200,
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating patient profile:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to update profile",
      });
    }
  },
};

export default patientController;
