import { db } from "../config/db.js";
import moment from "moment";
import { apiResponse } from "../utils/helper.js";

export const cityController = {
  getCities: async (req, res, next) => {
    try {
      const query = `SELECT DISTINCT city FROM (
            SELECT city FROM users WHERE role = 'doctor' AND city IS NOT NULL
            UNION 
            SELECT city FROM clinic WHERE city IS NOT NULL
            ) AS combined_cities
            ORDER BY city;`;

      const [cities] = await db.query(query);
      // console.log(cities);

      // Filter out null values and map to get just the city names
      const uniqueCities = cities
        .filter(
          (c) => c.city !== null && c.city !== undefined && c.city.trim() !== ""
        )
        .map((c) => c.city);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Cities fetched successfully",
        payload: {
          cities: uniqueCities,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  getClinicsAndDoctorsByCity: async (req, res, next) => {
    try {
      const { city } = req.query;

      if (!city) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "City parameter is required",
          payload: {},
        });
      }

      // Step 1: Get all clinic IDs for the given city
      const [clinicIds] = await db.query(
        `SELECT id FROM clinic WHERE city = ? AND status = '1'`,
        [city]
      );

      if (clinicIds.length === 0) {
        return apiResponse(res, {
          error: false,
          code: 200,
          status: 1,
          message: "No clinics found in the specified city",
          payload: {
            fetchedDoctor: [],
          },
        });
      }

      console.log("Clinic IDs:", clinicIds);

      // Step 2: Get all unique doctor IDs from those clinics
      const clinicIdList = clinicIds.map((clinic) => clinic.id);
      const placeholders = clinicIdList.map(() => "?").join(",");

      const [doctorIds] = await db.query(
        `SELECT DISTINCT doctor_id FROM clinic_doctors 
       WHERE clinic_id IN (${placeholders}) AND status = '1'`,
        clinicIdList
      );

      if (doctorIds.length === 0) {
        return apiResponse(res, {
          error: false,
          code: 200,
          status: 1,
          message: "No doctors found for clinics in the specified city",
          payload: {
            fetchedDoctor: [],
          },
        });
      }

      console.log("Doctor IDs:", doctorIds);

      // Step 3: Get all doctor details for those unique doctor IDs
      const doctorIdList = doctorIds.map((doctor) => doctor.doctor_id);
      const doctorPlaceholders = doctorIdList.map(() => "?").join(",");

      const [fetchedDoctors] = await db.query(
        `SELECT *, CONCAT(f_name, ' ', l_name) as full_name FROM users 
       WHERE id IN (${doctorPlaceholders}) 
       AND role = 'doctor' 
       AND status = '1'
       ORDER BY created_at DESC, f_name ASC, l_name ASC`,
        doctorIdList
      );

      console.log("Fetched Doctors:", fetchedDoctors);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Clinics and doctors fetched successfully",
        payload: {
          fetchedDoctor: fetchedDoctors,
          total: fetchedDoctors.length,
          city: city,
        },
      });
    } catch (err) {
      console.error("Error fetching clinics and doctors:", err);
      next(err);
    }
  },

  // New endpoint for getting all doctors when no city is selected
  getAllDoctors: async (req, res, next) => {
    try {
      const { page = 1, limit = 50, gender, department, keyword } = req.query;
      const offset = (page - 1) * limit;

      // Base query to get all doctors
      let whereConditions = ["role = 'doctor'", "status = '1'"];
      let queryParams = [];

      // Add gender filter if provided
      if (gender) {
        whereConditions.push("gender = ?");
        queryParams.push(gender.toLowerCase());
      }

      // Add department filter if provided
      if (department) {
        whereConditions.push("department LIKE ?");
        queryParams.push(`%${department}%`);
      }

      // Add keyword search if provided
      if (keyword) {
        whereConditions.push(
          "(f_name LIKE ? OR l_name LIKE ? OR speciality LIKE ? OR department LIKE ?)"
        );
        queryParams.push(
          `%${keyword}%`,
          `%${keyword}%`,
          `%${keyword}%`,
          `%${keyword}%`
        );
      }

      const whereClause = whereConditions.join(" AND ");

      // Get total count for pagination
      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM users WHERE ${whereClause}`,
        queryParams
      );

      const totalDoctors = countResult[0].total;

      // Get doctors with pagination
      const [fetchedDoctors] = await db.query(
        `SELECT *, CONCAT(f_name, ' ', l_name) as full_name FROM users 
       WHERE ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
        [...queryParams, parseInt(limit), parseInt(offset)]
      );

      // Add is_favorite field for each doctor
      const patientId = req.user?.id; // Assuming patient ID is available in req.user.id
      let doctorsWithFavoriteStatus;

      if (!patientId) {
        // If no patientId provided, set is_favorite to false for all doctors
        doctorsWithFavoriteStatus = fetchedDoctors.map((doctor) => ({
          ...doctor,
          is_favorite: false,
        }));
      } else {
        // Verify if patientId belongs to a patient
        const [patientResult] = await db.query(
          `SELECT 1 FROM users WHERE id = ? AND role = 'patient'`,
          [patientId]
        );

        if (patientResult.length === 0) {
          // If patientId is invalid or not a patient, set is_favorite to false
          doctorsWithFavoriteStatus = fetchedDoctors.map((doctor) => ({
            ...doctor,
            is_favorite: false,
          }));
        } else {
          // Check favorite status for each doctor
          doctorsWithFavoriteStatus = await Promise.all(
            fetchedDoctors.map(async (doctor) => {
              const [favoriteResult] = await db.query(
                `SELECT 1 FROM favorite_doctors WHERE patient_id = ? AND doctor_id = ?`,
                [patientId, doctor.id]
              );

              return {
                ...doctor,
                is_favorite: favoriteResult.length > 0, // true if record exists, false otherwise
              };
            })
          );
        }
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "All doctors fetched successfully",
        payload: {
          fetchedDoctor: doctorsWithFavoriteStatus,
          total: totalDoctors,
          page: parseInt(page),
          limit: parseInt(limit),
          hasMore: offset + doctorsWithFavoriteStatus.length < totalDoctors,
        },
      });
    } catch (err) {
      console.error("Error fetching all doctors:", err);
      next(err);
    }
  },
};
