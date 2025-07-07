import { db } from "../config/db.js";
import { apiResponse } from "../utils/helper.js";
/**
 * Doctor Controller
 * Handles requests related to doctors
 */
export const doctorController = {
  // Fetch all doctors
  getDoctors: async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM doctors");
      return apiResponse(res, {
        payload: rows,
        message: "Doctors fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching doctors:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to fetch doctors",
      });
    }
  },

  
};
