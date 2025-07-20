import { db } from "../config/db.js";
import { apiResponse } from "../utils/helper.js";
import validator from "validator";
import { uploadImage, deleteImage } from "../utils/fileHelper.js";

const clinicController = {
  // Add Clinic (Admin, clinic)
  updateClinic: async (req, res) => {
    const {
      name,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pin_code,
      lat,
      lng,
      removeGallery = [],
    } = req.body;

    let clinicId;

    // Decide clinic ID from role
    if (req.user.role === "clinic") {
      clinicId = req.user.id;
    } else if (req.user.role === "admin") {
      clinicId = req.body.clinic_id;
      if (!clinicId) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Missing required field: clinic_id is required for admin",
        });
      }
    } else {
      return apiResponse(res, {
        error: true,
        code: 403,
        message: "Unauthorized: Only admin or clinic can update clinic data",
      });
    }

    try {
      const [rows] = await db.query("SELECT gallery FROM clinic WHERE id = ?", [
        clinicId,
      ]);
      if (!rows.length) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Clinic not found",
        });
      }

      let gallery = JSON.parse(rows[0].gallery || "[]");

      // Delete selected gallery images
      let parsedRemoveGallery = removeGallery;
      if (typeof parsedRemoveGallery === "string") {
        try {
          parsedRemoveGallery = JSON.parse(parsedRemoveGallery);
        } catch (e) {
          console.warn("Invalid removeGallery format:", removeGallery);
          parsedRemoveGallery = [];
        }
      }

      // Delete selected gallery images
      for (const img of parsedRemoveGallery) {
        deleteImage(img);
        gallery = gallery.filter((i) => i !== img);
      }

      // Upload new images
      if (req.files && req.files.gallery) {
        const galleryFiles = Array.isArray(req.files.gallery)
          ? req.files.gallery
          : [req.files.gallery];
        for (const file of galleryFiles) {
          const uploadedPath = await uploadImage(file, "clinic_gallery");
          gallery.push(uploadedPath);
        }
      }

      await db.query(
        `UPDATE clinic SET name = ?, address_line1 = ?, address_line2 = ?, city = ?, state = ?, country = ?, pin_code = ?, lat = ?, lng = ?, gallery = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [
          name || null,
          address_line1 || null,
          address_line2 || null,
          city || null,
          state || null,
          country || null,
          pin_code || null,
          lat || null,
          lng || null,
          JSON.stringify(gallery),
          clinicId,
        ]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        message: "Clinic updated successfully",
      });
    } catch (err) {
      console.error("Clinic update error:", err);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Internal server error",
      });
    }
  },

  // Assign or Remove Doctor to/from Clinic (Admin/clinic)
  assignOrRemoveDoctorToClinic: async (req, res) => {
    const { clinic_id, doctor_id, action } = req.body;
    const { role, id: requesterId } = req.user;

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
          message: "Clinic is inactive. Please activate it first or contact to administrator.",
        });
      }

      const [doctorResult] = await db.query(
        `SELECT id, status FROM users WHERE id = ? AND role = 'doctor'`,
        [doctor_id]
      );
      if (doctorResult.length === 0) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Doctor not found",
        });
      }
      if (doctorResult[0].status !== "1") {
        return apiResponse(res, {
          error: true,
          code: 403,
          message: "Doctor is not active",
        });
      }

      if (role === "clinic" && clinic_id !== requesterId) {
        return apiResponse(res, {
          error: true,
          code: 403,
          message: "Clinics can only manage their own doctor mappings",
        });
      }

      if (action === "assign") {
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

        await db.query(
          `INSERT INTO clinic_doctors (clinic_id, doctor_id, status) VALUES (?, ?, '1')`,
          [clinic_id, doctor_id]
        );
        return apiResponse(res, {
          error: false,
          code: 200,
          message: "Doctor assigned successfully",
        });
      } else {
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

  // Get Doctors for a Clinic(admin/clinic)
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
        `SELECT 
        u.id, u.prefix, u.f_name, u.l_name, u.bio,
        u.address_line1, u.address_line2, u.city, u.state, u.country,
        u.consultation_fee, u.consultation_fee_type, u.profile_image, u.status
      FROM users u
      JOIN clinic_doctors cd ON u.id = cd.doctor_id
      WHERE cd.clinic_id = ? AND u.role = 'doctor'`,
        [clinic_id]
      );

      const result = [];

      for (let doctor of doctors) {
        const doctorId = doctor.id;

        // Educations
        const [educations] = await db.query(
          `SELECT id, degree, institution, year_of_passing 
         FROM educations 
         WHERE doctor_id = ? 
         ORDER BY year_of_passing DESC`,
          [doctorId]
        );

        // Specializations
        const [specializations] = await db.query(
          `SELECT s.id, s.name 
         FROM doctor_specializations ds
         JOIN specializations s ON s.id = ds.specialization_id
         WHERE ds.doctor_id = ? AND ds.status = '1'`,
          [doctorId]
        );

        // Services
        const [services] = await db.query(
          `SELECT sv.id, sv.name 
         FROM doctor_services ds
         JOIN services sv ON sv.id = ds.services_id
         WHERE ds.doctor_id = ? AND ds.status = '1'`,
          [doctorId]
        );

        // Ratings
        const [[ratingStats]] = await db.query(
          `SELECT 
           IFNULL(AVG(rating), 0) AS avg_rating,
           COUNT(*) AS total_ratings
         FROM rating
         WHERE doctor_id = ? AND status = '1'`,
          [doctorId]
        );

        // Availability
        const [availabilities] = await db.query(
          `SELECT day FROM doctor_availability 
         WHERE doctor_id = ? 
         ORDER BY FIELD(day, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')`,
          [doctorId]
        );

        const findNextAvailableDate = () => {
          const today = new Date();
          for (let i = 0; i < 14; i++) {
            const checkDate = new Date();
            checkDate.setDate(today.getDate() + i);
            const weekday = checkDate.toLocaleDateString("en-US", {
              weekday: "long",
            });

            if (availabilities.find((a) => a.day === weekday)) {
              return checkDate.toISOString().split("T")[0];
            }
          }
          return null;
        };

        const nextAvailableDate = findNextAvailableDate();

        result.push({
          doctor_id: doctor.id,
          prefix: doctor.prefix,
          f_name: doctor.f_name,
          l_name: doctor.l_name,
          bio: doctor.bio,
          profile_image: doctor.profile_image,
          education: educations,
          specialization: specializations,
          services: services,
          average_rating: Number(parseFloat(ratingStats.avg_rating).toFixed(1)),
          total_ratings: ratingStats.total_ratings || 0,
          address_line1: doctor.address_line1,
          address_line2: doctor.address_line2,
          city: doctor.city,
          state: doctor.state,
          country: doctor.country,
          consultation_fee: doctor.consultation_fee,
          consultation_fee_type: doctor.consultation_fee_type,
          next_available: nextAvailableDate || "Not Available",
          status: doctor.status, // ✅ Include doctor status
        });
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        message: "Clinic doctors retrieved successfully",
        payload: result,
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

  toggleDoctorStatusInClinic: async (req, res) => {
    const { doctor_id, clinic_id, status } = req.body; // status: "1" (active), "2" (inactive)

    if (!clinic_id || !doctor_id || !["1", "2"].includes(status)) {
      return apiResponse(res, {
        error: true,
        code: 400,
        message:
          "clinic_id, doctor_id and valid status ('1' or '2') are required",
      });
    }

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check mapping exists
      const [existing] = await connection.query(
        `SELECT id FROM clinic_doctors WHERE clinic_id = ? AND doctor_id = ?`,
        [clinic_id, doctor_id]
      );

      if (!existing.length) {
        await connection.rollback();
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Doctor is not mapped to this clinic",
        });
      }

      // Update status
      await connection.query(
        `UPDATE clinic_doctors SET status = ? WHERE clinic_id = ? AND doctor_id = ?`,
        [status, clinic_id, doctor_id]
      );

      await connection.commit();
      return apiResponse(res, {
        error: false,
        code: 200,
        message: `Doctor has been ${
          status === "1" ? "activated" : "deactivated"
        } successfully`,
      });
    } catch (err) {
      await connection.rollback();
      console.error("Error toggling doctor status:", err);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Internal server error",
      });
    } finally {
      connection.release();
    }
  },

  searchActiveClinics: async (req, res) => {
    const { search = "" } = req.query;

    try {
      const [clinics] = await db.query(
        `SELECT * 
       FROM clinic 
       WHERE status = '1' AND (name LIKE ? OR city LIKE ?)`,
        [`%${search}%`, `%${search}%`]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        message: "Active clinics fetched successfully",
        payload: clinics,
      });
    } catch (error) {
      console.error("Error searching active clinics:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Internal server error",
      });
    }
  },
};

export default clinicController;
