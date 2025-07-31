import validator from "validator";
import { apiResponse } from "../utils/helper.js";
import { deleteImage, uploadImage } from "../utils/fileHelper.js";
import PrescriptionModel from "../models/prescriptionModel.js";

const prescriptionController = {
  addOrUpdatePrescription: async (req, res) => {
    try {
      const { id, appointment_id, prescribed_to, notes, file_type } = req.body;
      const prescribed_by = req.user.id; 

      // Validate required fields
      if (!appointment_id || !prescribed_to) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Appointment ID and prescribed to are required",
        });
      }

      if (
        !validator.isInt(appointment_id.toString()) ||
        !validator.isInt(prescribed_to.toString())
      ) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Invalid appointment ID or prescribed to ID",
        });
      }

      let file_url = null;
      let existing = null;

      // Check if this is an update operation
      if (id) {
        existing = await PrescriptionModel.getById(id);
        if (!existing) {
          return apiResponse(res, {
            error: true,
            code: 404,
            status: 0,
            message: "Prescription not found",
          });
        }
        if (existing.prescribed_by !== prescribed_by) {
          return apiResponse(res, {
            error: true,
            code: 403,
            status: 0,
            message: "Not authorized to update this prescription",
          });
        }
      }

      // Handle file upload
      if (req.files && req.files.file) {
        if (!["pdf", "image"].includes(file_type)) {
          return apiResponse(res, {
            error: true,
            code: 400,
            status: 0,
            message: "Invalid file type. Must be 'pdf' or 'image'",
          });
        }
        if (existing?.file_url) {
          deleteImage(existing.file_url);
        }
        file_url = await uploadImage(req.files.file, "prescription");
      }

      // If update
      if (id) {
        const updated = await PrescriptionModel.update(
          id,
          { appointment_id, prescribed_to, notes, file_type, file_url },
          prescribed_by
        );

        if (!updated) {
          return apiResponse(res, {
            error: true,
            code: 403,
            status: 0,
            message: "Not authorized to update this prescription",
          });
        }

        return apiResponse(res, {
          error: false,
          code: 200,
          status: 1,
          message: "Prescription updated successfully",
        });
      }

      // If create
      const newId = await PrescriptionModel.create({
        appointment_id,
        prescribed_by,
        prescribed_to,
        notes,
        file_type,
        file_url,
      });

      return apiResponse(res, {
        error: false,
        code: 201,
        status: 1,
        message: "Prescription added successfully",
        payload: { id: newId },
      });
    } catch (error) {
      console.error("Error in addOrUpdatePrescription:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },

  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const prescribed_by = req.user.id;

      if (!id) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Prescription ID is required",
        });
      }

      const existing = await PrescriptionModel.getById(id);
      if (!existing) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Prescription not found",
        });
      }

      const newStatus = existing.status === "1" ? "2" : "1";

      const toggled = await PrescriptionModel.toggleStatus(
        id,
        newStatus,
        prescribed_by
      );
      if (!toggled) {
        return apiResponse(res, {
          error: true,
          code: 403,
          status: 0,
          message: "Not authorized to change status of this prescription",
        });
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: `Prescription ${
          newStatus === "1" ? "restored" : "deleted"
        } successfully`,
      });
    } catch (error) {
      console.error("Error in toggleStatus:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },

  getByFilter: async (req, res) => {
    try {
      let {
        appointment_id,
        prescribed_by,
        prescribed_to,
        status,
        page = 1,
        limit = 10,
      } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const offset = (page - 1) * limit;

      const userRole = req.user.role;
      const userId = req.user.id;

      // Validate pagination parameters
      if (page < 1 || limit < 1) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Invalid pagination parameters",
        });
      }

      const { total, rows } = await PrescriptionModel.getByFilter({
        appointment_id,
        prescribed_by,
        prescribed_to,
        status,
        limit,
        offset,
        userRole,
        userId,
      });

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
      console.error("Error in getByFilter:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch prescriptions",
      });
    }
  },

  getDetailsById: async (req, res) => {
    try {
      const { id } = req.params;
      const userRole = req.user.role;
      const userId = req.user.id;

      if (!id || !validator.isInt(id.toString())) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Valid prescription ID is required",
        });
      }

      const prescription = await PrescriptionModel.getDetailsById(id);
      if (!prescription) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Prescription not found",
        });
      }

      // Authorization checks
      if (userRole === "doctor" && prescription.prescribed_by !== userId) {
        return apiResponse(res, {
          error: true,
          code: 403,
          status: 0,
          message: "Not authorized to view this prescription",
        });
      }
      if (userRole === "patient" && prescription.prescribed_to !== userId) {
        return apiResponse(res, {
          error: true,
          code: 403,
          status: 0,
          message: "Not authorized to view this prescription",
        });
      }
      if (userRole === "clinic") {
        // Verify clinic is associated with the doctor
        const [doctor] = await db.query(
          `SELECT clinic_id FROM users WHERE id = ? AND role = 'doctor'`,
          [prescription.prescribed_by]
        );
        if (!doctor[0] || doctor[0].clinic_id !== userId) {
          return apiResponse(res, {
            error: true,
            code: 403,
            status: 0,
            message: "Not authorized to view this prescription",
          });
        }
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: prescription,
      });
    } catch (error) {
      console.error("Error in getDetailsById:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch prescription details",
      });
    }
  },
};

export default prescriptionController;
