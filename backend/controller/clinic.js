import { db } from "../config/db.js";
import { apiResponse } from "../utils/helper.js";
import validator from "validator";

const clinicController = {
  // Add Clinic (Admin)
  addClinic: async (req, res) => {
    const adminId = req.user.id; // assumed from token
    const {
      name,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pin_code,
    } = req.body;

    if (!name || !address_line1 || !city || !state || !country || !pin_code) {
      return apiResponse(res, {
        error: true,
        code: 400,
        message: "Missing required fields",
      });
    }

    try {
      const [result] = await db.query(
        `INSERT INTO clinic (name, address_line1, address_line2, city, state, country, pin_code, created_by_id, created_by_role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          address_line1,
          address_line2 || null,
          city,
          state,
          country,
          pin_code,
          adminId,
          "admin",
        ]
      );

      return apiResponse(res, {
        error: false,
        code: 201,
        message: "Clinic added successfully",
        payload: { clinic_id: result.insertId },
      });
    } catch (error) {
      console.error("Error adding clinic:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Internal server error",
      });
    }
  },

  // Assign or Remove Doctor to/from Clinic (Admin)
  assignOrRemoveDoctorToClinic: async (req, res) => {
    const { clinic_id, doctor_id, action } = req.body;

    if (!clinic_id || !doctor_id || !action) {
      return apiResponse(res, {
        error: true,
        code: 400,
        message:
          "Missing required fields: clinic_id, doctor_id, and action are required",
      });
    }

    if (!["assign", "remove"].includes(action)) {
      return apiResponse(res, {
        error: true,
        code: 400,
        message: "Invalid action. Allowed values: assign, remove",
      });
    }

    try {
      // Check if clinic exists and is active
      const [clinicResult] = await db.query(
        `SELECT id, status FROM clinic WHERE id = ?`,
        [clinic_id]
      );
      if (clinicResult.length === 0) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Clinic not found",
        });
      }
      if (clinicResult[0].status !== "1") {
        return apiResponse(res, {
          error: true,
          code: 403,
          message: "Clinic is inactive. Please activate it first.",
        });
      }

      // Check if doctor exists
      const [doctorResult] = await db.query(
        `SELECT id FROM users WHERE id = ? AND role = 'doctor'`,
        [doctor_id]
      );
      if (doctorResult.length === 0) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Doctor not found",
        });
      }

      if (action === "assign") {
        // Check if already assigned
        const [existing] = await db.query(
          `SELECT id FROM clinic_doctors WHERE clinic_id = ? AND doctor_id = ?`,
          [clinic_id, doctor_id]
        );
        if (existing.length > 0) {
          return apiResponse(res, {
            error: true,
            code: 409,
            message: "Doctor is already assigned to this clinic",
          });
        }

        // Assign doctor
        await db.query(
          `INSERT INTO clinic_doctors (clinic_id, doctor_id) VALUES (?, ?)`,
          [clinic_id, doctor_id]
        );
        return apiResponse(res, {
          error: false,
          code: 200,
          message: "Doctor assigned successfully",
        });
      } else {
        // Check if doctor is mapped before removing
        const [existing] = await db.query(
          `SELECT id FROM clinic_doctors WHERE clinic_id = ? AND doctor_id = ?`,
          [clinic_id, doctor_id]
        );
        if (existing.length === 0) {
          return apiResponse(res, {
            error: true,
            code: 404,
            message: "Doctor is not assigned to this clinic",
          });
        }

        // Remove mapping
        await db.query(
          `DELETE FROM clinic_doctors WHERE clinic_id = ? AND doctor_id = ?`,
          [clinic_id, doctor_id]
        );
        return apiResponse(res, {
          error: false,
          code: 200,
          message: "Doctor removed successfully",
        });
      }
    } catch (error) {
      console.error("Error in assignOrRemoveDoctorToClinic:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Internal server error",
      });
    }
  },

  // Get All Clinics(Admin)
  getAllClinics: async (req, res) => {
    try {
      const [clinics] = await db.query(
        `SELECT * FROM clinic ORDER BY created_at DESC`
      );
      return apiResponse(res, {
        error: false,
        code: 200,
        message: "Clinics retrieved successfully",
        payload: clinics,
      });
    } catch (error) {
      console.error("Error retrieving clinics:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Internal server error",
      });
    }
  },

  // Get Single Clinic by ID(Admin)
  getClinicById: async (req, res) => {
    const { clinic_id } = req.params;
    try {
      if (!clinic_id) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Clinic ID is required",
        });
      }

      const [clinic] = await db.query(`SELECT * FROM clinic WHERE id = ?`, [
        clinic_id,
      ]);

      if (clinic.length === 0) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Clinic not found",
        });
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        message: "Clinic retrieved successfully",
        payload: clinic[0],
      });
    } catch (error) {
      console.error("Error fetching clinic:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Internal server error",
      });
    }
  },

  // Update Clinic by ID (admin)
  updateClinic: async (req, res) => {
    const { clinic_id } = req.params;
    const {
      name,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pin_code,
    } = req.body;

    try {
      if (!clinic_id) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Clinic ID is required",
        });
      }

      const [result] = await db.query(
        `UPDATE clinic SET name=?, address_line1=?, address_line2=?, city=?, state=?, country=?, pin_code=? WHERE id = ?`,
        [
          name,
          address_line1,
          address_line2 || null,
          city,
          state,
          country,
          pin_code,
          clinic_id,
        ]
      );

      if(result.affectedRows === 0){
        return apiResponse(res, {
        error: true,
        code: 404,
        message: "Clinic not found or no changes made",
      });
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        message: "Clinic updated successfully",
      });
    } catch (error) {
      console.error("Error updating clinic:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Internal server error",
      });
    }
  },

  // Get Doctors for a Clinic(admin)
  getClinicDoctors: async (req, res) => {
    const { clinic_id } = req.params;

    try {
      if (!clinic_id) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Clinic ID is required",
        });
      }

      const [doctors] = await db.query(
        `SELECT d.id, d.full_name, d.email, d.phone, d.status, d.profile_image
         FROM users d
         JOIN clinic_doctors cd ON d.id = cd.doctor_id
         WHERE cd.clinic_id = ? AND d.role = 'doctor'`,
        [clinic_id]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        message: "Doctors retrieved successfully",
        payload: doctors,
      });
    } catch (error) {
      console.error("Error retrieving clinic doctors:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Internal server error",
      });
    }
  },

  // Get all Mapped Clinics for a Doctor (Doctor/admin/user)
  getMappedClinicsForDoctor: async (req, res) => {
    const doctor_id = req.query.doctor_id || req.user.id;

    try {
      const [clinics] = await db.query(
        `SELECT c.*
       FROM clinic c
       INNER JOIN clinic_doctors cd ON cd.clinic_id = c.id
       WHERE cd.doctor_id = ? AND cd.status = '1'
       ORDER BY c.created_at DESC`,
        [doctor_id]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        message: "Mapped clinics fetched successfully",
        payload: clinics,
      });
    } catch (error) {
      console.error("Error fetching mapped clinics:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Internal server error",
      });
    }
  },

  // Toggle Clinic Status (activate or deactivate)(admin)
  toggleClinicStatus: async (req, res) => {
    const { status, clinic_id } = req.body; // '1' or '2' for active or inactive

    if (!clinic_id || !["1", "2"].includes(status)) {
      return apiResponse(res, {
        error: true,
        code: 400,
        message:
          "Clinic ID and valid status ('1' for activate, '2' for deactivate) are required",
      });
    }

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check if clinic exists
      const [clinicRows] = await connection.query(
        `SELECT id FROM clinic WHERE id = ?`,
        [clinic_id]
      );

      if (!clinicRows.length) {
        await connection.rollback();
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Clinic not found",
        });
      }

      // Update status
      await connection.query(`UPDATE clinic SET status = ? WHERE id = ?`, [
        status,
        clinic_id,
      ]);

      // If deactivating, unmap all doctors
      if (status === "2") {
        await connection.query(
          `DELETE FROM clinic_doctors WHERE clinic_id = ?`,
          [clinic_id]
        );
      }

      await connection.commit();
      return apiResponse(res, {
        error: false,
        code: 200,
        message: `Clinic ${
          status === "1" ? "activated" : "deactivated"
        } successfully`,
      });
    } catch (error) {
      await connection.rollback();
      console.error("Error updating clinic status:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Internal server error",
      });
    } finally {
      connection.release();
    }
  },
};

export default clinicController;
