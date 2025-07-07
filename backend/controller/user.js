// controllers/userController.js
import { db } from "../config/db.js";
import { apiResponse } from "../utils/helper.js";

export const userController = {
  // Get full doctor profile with related data
  getDoctorProfile: async (req, res) => {
    try {
      const { id } = req.params;

      const [[doctor]] = await db.query(
        "SELECT * FROM users WHERE id = ? AND role = 'doctor'",
        [id]
      );
      if (!doctor) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Doctor not found",
        });
      }

      const [educations] = await db.query(
        "SELECT * FROM educations WHERE doctor_id = ?",
        [id]
      );
      const [experiences] = await db.query(
        "SELECT * FROM experiences WHERE doctor_id = ?",
        [id]
      );
      const [memberships] = await db.query(
        "SELECT * FROM memberships WHERE doctor_id = ?",
        [id]
      );
      const [awards] = await db.query(
        "SELECT * FROM awards WHERE doctor_id = ?",
        [id]
      );
      const [registration] = await db.query(
        "SELECT * FROM doctor_registration WHERE doctor_id = ?",
        [id]
      );
      const [availability] = await db.query(
        "SELECT * FROM doctor_availability WHERE doctor_id = ?",
        [id]
      );
      const [unavailability] = await db.query(
        "SELECT * FROM doctor_unavailability WHERE doctor_id = ?",
        [id]
      );
      const [ratings] = await db.query(
        "SELECT * FROM rating WHERE doctor_id = ?",
        [id]
      );

      const [specializations] = await db.query(
        `SELECT 
           ds.id AS doctor_specialization_id,
           ds.status,
           ds.created_at,
           ds.updated_at,
           s.id AS specialization_id,
           s.name
         FROM doctor_specializations ds
         JOIN specializations s ON s.id = ds.specialization_id
         WHERE ds.doctor_id = ?`,
        [id]
      );

      const [services] = await db.query(
        `SELECT 
          ds.id AS doctor_service_id,
          ds.status,
          ds.created_at,
          ds.updated_at,
          s.id AS services_id,
          s.name
        FROM doctor_services ds
        JOIN services s ON s.id = ds.services_id
        WHERE ds.doctor_id = ?`,
        [id]
      );

      const [clinics] = await db.query(
        `SELECT c.* FROM clinic_doctors cd
         JOIN clinic c ON c.id = cd.clinic_id
         WHERE cd.doctor_id = ?`,
        [id]
      );

      return apiResponse(res, {
        message: "Doctor profile fetched successfully",
        payload: {
          doctor,
          educations,
          experiences,
          memberships,
          awards,
          registration: registration[0] || null,
          availability,
          unavailability,
          ratings,
          specializations: specializations,
          services: services,
          clinics,
        },
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

  // Get full patient profile with related data
  getPatientProfile: async (req, res) => {
    try {
      const { id } = req.params;

      const [[patient]] = await db.query(
        "SELECT * FROM users WHERE id = ? AND role = 'patient'",
        [id]
      );
      if (!patient) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Patient not found",
        });
      }

      const [caregivers] = await db.query(
        "SELECT * FROM patient_caregiver WHERE user_id = ?",
        [id]
      );
      const [appointments] = await db.query(
        "SELECT * FROM appointments WHERE user_id = ?",
        [id]
      );
      const [invoices] = await db.query(
        "SELECT * FROM invoices WHERE user_id = ?",
        [id]
      );
      const [supportTickets] = await db.query(
        "SELECT * FROM support_tickets WHERE user_id = ?",
        [id]
      );
      const [notifications] = await db.query(
        "SELECT * FROM notifications WHERE user_id = ?",
        [id]
      );

      return apiResponse(res, {
        message: "Patient profile fetched successfully",
        payload: {
          patient,
          caregivers,
          appointments,
          invoices,
          supportTickets,
          notifications,
        },
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
};
