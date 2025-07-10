import { db } from "../config/db.js";
import { apiResponse } from "../utils/helper.js";
import validator from "validator";
import { uploadImage, deleteImage } from "../utils/fileHelper.js";

// Generate Unique Code like SP123456
const generateCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = "SP" + Math.floor(100000 + Math.random() * 900000);
    const [row] = await db.query(
      `SELECT id FROM specializations WHERE code = ?`,
      [code]
    );
    exists = row.length > 0;
  }
  return code;
};

const specialtyController = {
  // Add or Update Specialization
  addOrUpdateSpecialty: async (req, res) => {
    try {
      const { id, name } = req.body;

      if (!name || validator.isEmpty(name.trim())) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Specialization name is required",
        });
      }

      let image_url = null;
      let existing = [];

      if (id) {
        [existing] = await db.query(
          `SELECT * FROM specializations WHERE id = ?`,
          [id]
        );
        if (existing.length === 0) {
          return apiResponse(res, {
            error: true,
            code: 404,
            status: 0,
            message: "Specialization not found",
          });
        }
      }

      // Upload image if present
      if (req.files && req.files.image) {
        if (existing.length && existing[0].image_url) {
          deleteImage(existing[0].image_url);
        }
        image_url = await uploadImage(req.files.image, "spec");
      }

      if (id) {
        // Update
        const updates = [`name = ?`];
        const values = [name];

        if (image_url) {
          updates.push(`image_url = ?`);
          values.push(image_url);
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        await db.query(
          `UPDATE specializations SET ${updates.join(", ")} WHERE id = ?`,
          values
        );

        return apiResponse(res, {
          error: false,
          code: 200,
          status: 1,
          message: "Specialization updated successfully",
        });
      } else {
        // Insert
        const [check] = await db.query(
          `SELECT id FROM specializations WHERE name = ?`,
          [name]
        );
        if (check.length > 0) {
          return apiResponse(res, {
            error: true,
            code: 409,
            status: 0,
            message: "Specialization already exists",
          });
        }

        const newCode = await generateCode();
        await db.query(
          `INSERT INTO specializations (name, code, image_url) VALUES (?, ?, ?)`,
          [name, newCode, image_url]
        );

        return apiResponse(res, {
          error: false,
          code: 201,
          status: 1,
          message: "Specialization added successfully",
        });
      }
    } catch (error) {
      console.error("Error in addOrUpdateSpecialty:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },

  // Toggle Status
  toggleStatus: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "ID is required",
        });
      }

      const [rows] = await db.query(
        `SELECT * FROM specializations WHERE id = ?`,
        [id]
      );
      if (rows.length === 0) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Specialization not found",
        });
      }

      const newStatus = rows[0].status === "1" ? "2" : "1";
      await db.query(
        `UPDATE specializations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [newStatus, id]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: `Specialization ${
          newStatus === "1" ? "activated" : "deactivated"
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

  // Get All (Paginated)
  getAll: async (req, res) => {
    try {
      let { page = 1, limit = 10, status } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const offset = (page - 1) * limit;

      let where = `WHERE 1`;
      const values = [];

      if (status) {
        where += ` AND status = ?`;
        values.push(status);
      }

      const [totalRows] = await db.query(
        `SELECT COUNT(*) as count FROM specializations ${where}`,
        values
      );
      const total = totalRows[0].count;

      const [rows] = await db.query(
        `SELECT * FROM specializations ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
        [...values, limit, offset]
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
      console.error("Error in getAll:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch specializations",
      });
    }
  },

  // Public Search
  searchOrListSpecializations: async (req, res) => {
    let { search = "" } = req.query;
    search = search?.trim().toLowerCase();

    try {
      const [results] = await db.query(
        `SELECT * FROM specializations WHERE LOWER(name) LIKE ? AND status = '1' ORDER BY name ASC`,
        [`%${search}%`]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: results,
      });
    } catch (error) {
      console.error("Error searching specializations:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch specializations",
      });
    }
  },
};

export default specialtyController;
