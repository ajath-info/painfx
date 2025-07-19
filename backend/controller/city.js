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
      console.log(cities);

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
        `SELECT * FROM users 
       WHERE id IN (${doctorPlaceholders}) 
       AND role = 'doctor' 
       AND status = '1'
       ORDER BY f_name ASC, l_name ASC`,
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
};
