import { db } from "../config/db.js";
import { apiResponse } from "../utils/helper.js";
import moment from "moment";

// SLOT GENERATION HELPER
export function generateSlots(start_time, end_time, slot_duration) {
  const start = moment(start_time, "HH:mm");
  const end = moment(end_time, "HH:mm");
  const slots = [];

  while (start.clone().add(slot_duration, "minutes").isSameOrBefore(end)) {
    const from = start.format("HH:mm");
    const to = start.clone().add(slot_duration, "minutes").format("HH:mm");
    slots.push({ from, to });
    start.add(slot_duration, "minutes");
  }

  return slots;
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const doctorAvailabilityController = {
  // ADD / UPDATE AVAILABILITY
  addOrUpdateAvailability: async (req, res) => {
    const doctor_id = req.user.id;
    let { day, clinic_id, slot_duration, slotData } = req.body;

    if (!day || !Array.isArray(slotData) || slotData.length === 0) {
      return apiResponse(res, {
        status: 0,
        message: "Required fields: day, slot_duration, slot[]",
        error: true,
      });
    }

    if (!days.includes(day)) {
      return apiResponse(res, {
        status: 0,
        message: `Invalid day "${day}". Allowed values are: ${days.join(", ")}`,
        error: true,
      });
    }

    const consultation_type = clinic_id ? "clinic_visit" : "home_visit";

    try {
      for (const { start_time, end_time, slot_duration } of slotData) {
        const start = moment(start_time, "HH:mm");
        const end = moment(end_time, "HH:mm");
        if (!start.isBefore(end)) {
          return apiResponse(res, {
            status: 0,
            error: true,
            message: `Invalid time slot: start_time (${start_time}) must be before end_time (${end_time})`,
          });
        }
      }

      const deleteQuery = `
        DELETE FROM doctor_availability 
        WHERE doctor_id = ? AND day = ? AND consultation_type = ?
        ${clinic_id ? "AND clinic_id = ?" : "AND clinic_id IS NULL"}
      `;
      const deleteParams = clinic_id
        ? [doctor_id, day, consultation_type, clinic_id]
        : [doctor_id, day, consultation_type];

      await db.query(deleteQuery, deleteParams);

      const insertValues = slotData.map(({ start_time, end_time, slot_duration }) => [
        doctor_id,
        consultation_type,
        clinic_id || null,
        day,
        start_time,
        end_time,
        slot_duration,
      ]);

      await db.query(
        `INSERT INTO doctor_availability 
         (doctor_id, consultation_type, clinic_id, day, start_time, end_time, slot_duration) 
         VALUES ?`,
        [insertValues]
      );

      return apiResponse(res, {
        status: 1,
        message: "Availability added/updated successfully",
        error: false,
      });
    } catch (err) {
      console.error("Error adding/updating availability:", err);
      return apiResponse(res, {
        status: 0,
        message: "Internal server error",
        error: true,
      });
    }
  },

  // GET AVAILABILITY GROUPED BY DAY
  getAvailabilityGroupedByDayWithSlots: async (req, res) => {
    const doctor_id = req.user.id;
    const clinic_id = req.query.clinic_id || null;
    const consultation_type = clinic_id ? "clinic_visit" : "home_visit";

    try {
      const [rows] = await db.query(
        `SELECT id, day, start_time, end_time, slot_duration, consultation_type, clinic_id 
         FROM doctor_availability 
         WHERE doctor_id = ? AND consultation_type = ? AND status = '1'
         ${clinic_id ? "AND clinic_id = ?" : "AND clinic_id IS NULL"}
         ORDER BY FIELD(day, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'), start_time`,
        clinic_id
          ? [doctor_id, consultation_type, clinic_id]
          : [doctor_id, consultation_type]
      );

      const groupedData = days.map((day) => {
        const matchingSlots = rows.filter((row) => row.day === day);
        if (matchingSlots.length === 0) {
          return {
            day,
            clinic_id: clinic_id || null,
            consultation_type,
            slotData: [],
            slots: [],
          };
        }

        const slotData = [];
        const allGeneratedSlots = [];

        matchingSlots.forEach((row) => {
          slotData.push({
            id: row.id,
            start_time: row.start_time,
            end_time: row.end_time,
            slot_duration: row.slot_duration,
          });

          const generated = generateSlots(
            row.start_time,
            row.end_time,
            row.slot_duration
          );
          allGeneratedSlots.push(...generated);
        });

        return {
          day,
          clinic_id: clinic_id || null,
          consultation_type,
          slotData,
          slots: allGeneratedSlots,
        };
      });

      return apiResponse(res, {
        status: 1,
        message: "Doctor availability with slots fetched successfully",
        error: false,
        payload: groupedData,
      });
    } catch (err) {
      console.error("Error fetching doctor availability:", err);
      return apiResponse(res, {
        status: 0,
        error: true,
        message: "Internal server error",
      });
    }
  },

  // GET SLOTS FOR A SPECIFIC DATE (with isBooked)
  getSlotsForDate: async (req, res) => {
    try {
      const doctor_id = req.query.doctor_id;
      const clinic_id = req.query.clinic_id || null;
      let date = req.query.date;

      if (!doctor_id) {
        return apiResponse(res, {
          status: 0,
          error: true,
          message: "doctor_id is required",
        });
      }

      if (!date) {
        date = moment().format("YYYY-MM-DD");
      }

      if (!moment(date, "YYYY-MM-DD", true).isValid()) {
        return apiResponse(res, {
          status: 0,
          error: true,
          message: "Invalid date format. Use YYYY-MM-DD",
        });
      }

      if (moment(date).isBefore(moment().startOf("day"))) {
        return apiResponse(res, {
          status: 0,
          error: true,
          message: "Date must be today or a future date",
        });
      }

      const [doctorRows] = await db.query(
        `SELECT id FROM users WHERE id = ? AND role = 'doctor' AND status = 1`,
        [doctor_id]
      );

      if (doctorRows.length === 0) {
        return apiResponse(res, {
          status: 0,
          error: true,
          message: "Invalid doctor_id: Doctor not found or inactive",
        });
      }

      const day = moment(date).format("dddd");
      const consultation_type = clinic_id ? "clinic_visit" : "home_visit";

      const [availability] = await db.query(
        `SELECT start_time, end_time, slot_duration 
         FROM doctor_availability 
         WHERE doctor_id = ? AND day = ? AND consultation_type = ? AND status = '1'
         ${clinic_id ? "AND clinic_id = ?" : "AND clinic_id IS NULL"}`,
        clinic_id
          ? [doctor_id, day, consultation_type, clinic_id]
          : [doctor_id, day, consultation_type]
      );

      const allSlots = [];

      for (const row of availability) {
        const slots = generateSlots(
          row.start_time,
          row.end_time,
          row.slot_duration
        );
        allSlots.push(...slots);
      }

      // Get booked appointment times for that day
      const startOfDay = `${date} 00:00:00`;
      const endOfDay = `${date} 23:59:59`;

      const [appointments] = await db.query(
        `SELECT appointment_time FROM appointments 
         WHERE doctor_id = ? 
           AND appointment_date BETWEEN ? AND ? 
           AND status IN ('pending', 'confirmed', 'rescheduled', 'completed')`,
        [doctor_id, startOfDay, endOfDay]
      );

      const bookedTimes = appointments.map((appt) =>
        moment(appt.appointment_time, "HH:mm:ss").format("HH:mm")
      );

      const finalSlots = allSlots.map((slot) => ({
        ...slot,
        isBooked: bookedTimes.includes(slot.from),
      }));

      return apiResponse(res, {
        status: 1,
        message: "Available slots fetched successfully",
        error: false,
        payload: {
          date,
          slots: finalSlots,
        },
      });
    } catch (err) {
      console.error("Error fetching slots:", err);
      return apiResponse(res, {
        status: 0,
        error: true,
        message: "Internal server error",
      });
    }
  },
};

export default doctorAvailabilityController;
