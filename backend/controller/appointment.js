import { db } from "../config/db.js";
import moment from "moment";
import { apiResponse } from "../utils/helper.js";
import validator from "validator";

const appointmentController = {
  // BOOK APPOINTMENT
  bookAppointment: async (req, res) => {
    const {
      user_id, doctor_id, caregiver_id, clinic_id,
      appointment_date, appointment_time, consultation_type,
      appointment_type, payment_status, amount, currency,
      address_line1, address_line2, city, state, country, pin_code,
      is_caregiver
    } = req.body;

    try {
      // === Input validation ===
      if (!user_id || !doctor_id || !appointment_date || !appointment_time ||
          !consultation_type || !appointment_type || !payment_status ||
          !amount || !currency) {
        return apiResponse(res, { error: true, code: 400, message: "Missing required fields" });
      }

      if (!validator.isISO8601(appointment_date)) {
        return apiResponse(res, { error: true, code: 400, message: "Invalid appointment date format" });
      }

      if (!validator.isCurrency(amount.toString())) {
        return apiResponse(res, { error: true, code: 400, message: "Invalid amount format" });
      }

      // === Insert appointment ===
      const [result] = await db.query(
        `INSERT INTO appointments (
          user_id, doctor_id, caregiver_id, clinic_id,
          appointment_date, appointment_time, consultation_type,
          appointment_type, payment_status, amount, currency
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id, doctor_id, caregiver_id || null, clinic_id || null,
          appointment_date, appointment_time, consultation_type,
          appointment_type, payment_status, amount, currency
        ]
      );

      const appointment_id = result.insertId;

      // === Insert address if home visit ===
      if (consultation_type === 'home_visit') {
        if (!address_line1 || !city || !state || !country || !pin_code) {
          return apiResponse(res, { error: true, code: 400, message: "Address fields are required for home visit" });
        }

        await db.query(
          `INSERT INTO appointment_address (
            appointment_id, is_caregiver, address_line1, address_line2,
            city, state, country, pin_code
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            appointment_id, !!is_caregiver, address_line1, address_line2 || '',
            city, state, country, pin_code
          ]
        );
      }

      return apiResponse(res, {
        message: "Appointment booked successfully",
        payload: { appointment_id }
      });

    } catch (error) {
      console.error("Error booking appointment:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to book appointment"
      });
    }
  },

  // GET APPOINTMENTS
  getAppointments: async (req, res) => {
    const { user_id, doctor_id, type, date } = req.query;

    try {
      let where = [];
      let params = [];

      if (user_id) {
        where.push("a.user_id = ?");
        params.push(user_id);
      }

      if (doctor_id) {
        where.push("a.doctor_id = ?");
        params.push(doctor_id);
      }

      if (type === "upcoming") {
        where.push("a.appointment_date >= CURDATE()");
      } else if (type === "today") {
        where.push("DATE(a.appointment_date) = CURDATE()");
      }

      const [appointments] = await db.query(
        `SELECT 
          a.*, 
          u.f_name AS patient_fname, u.l_name AS patient_lname,
          d.f_name AS doctor_fname, d.l_name AS doctor_lname,
          ad.address_line1, ad.city, ad.state, ad.country,
          c.address_line1 AS clinic_address, c.city AS clinic_city,
          doc.address_line1 AS doctor_address, doc.city AS doctor_city,
          cg.address_line1 AS caregiver_address, cg.city AS caregiver_city,
          pu.address_line1 AS patient_address, pu.city AS patient_city
        FROM appointments a
        JOIN users u ON u.id = a.user_id
        JOIN users d ON d.id = a.doctor_id
        LEFT JOIN appointment_address ad ON ad.appointment_id = a.id
        LEFT JOIN clinics c ON c.id = a.clinic_id
        LEFT JOIN users doc ON doc.id = a.doctor_id
        LEFT JOIN users cg ON cg.id = a.caregiver_id
        LEFT JOIN users pu ON pu.id = a.user_id
        ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
        ORDER BY a.appointment_date DESC`,
        params
      );

      const formattedAppointments = appointments.map(appt => {
        let resolvedAddress = null;

        // Address priority logic
        if (appt.consultation_type === "home_visit") {
          if (appt.address_line1) {
            resolvedAddress = {
              line1: appt.address_line1,
              city: appt.city,
              state: appt.state,
              country: appt.country,
            };
          } else if (appt.caregiver_id && appt.caregiver_address) {
            resolvedAddress = {
              line1: appt.caregiver_address,
              city: appt.caregiver_city,
            };
          } else if (appt.patient_address) {
            resolvedAddress = {
              line1: appt.patient_address,
              city: appt.patient_city,
            };
          }
        } else if (appt.clinic_id && appt.clinic_address) {
          resolvedAddress = {
            line1: appt.clinic_address,
            city: appt.clinic_city,
          };
        } else if (appt.doctor_address) {
          resolvedAddress = {
            line1: appt.doctor_address,
            city: appt.doctor_city,
          };
        }

        return {
          ...appt,
          resolved_address: resolvedAddress,
        };
      });

      return apiResponse(res, {
        message: "Appointments fetched successfully",
        payload: formattedAppointments
      });

    } catch (error) {
      console.error("Error fetching appointments:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to get appointments"
      });
    }
  },

  // UPDATE APPOINTMENT STATUS
  updateAppointmentStatus: async (req, res) => {
    const { appointment_id, status, appointment_date, appointment_time, reason } = req.body;
    const changed_by = req.user?.id;

    try {
      // Fetch previous status
      const [[prev]] = await db.query(`SELECT status FROM appointments WHERE id = ?`, [appointment_id]);
      if (!prev) return apiResponse(res, { error: true, code: 404, message: "Appointment not found" });

      if (status === "reschedule" && appointment_date && appointment_time) {
        await db.query(
          `UPDATE appointments SET appointment_date = ?, appointment_time = ?, status = 'pending' WHERE id = ?`,
          [appointment_date, appointment_time, appointment_id]
        );

        await db.query(
          `INSERT INTO appointment_logs (appointment_id, changed_by, previous_status, new_status, reason)
           VALUES (?, ?, ?, ?, ?)`,
          [appointment_id, changed_by, prev.status, "pending", reason || "Rescheduled"]
        );
      } else {
        await db.query(`UPDATE appointments SET status = ? WHERE id = ?`, [status, appointment_id]);

        await db.query(
          `INSERT INTO appointment_logs (appointment_id, changed_by, previous_status, new_status, reason)
           VALUES (?, ?, ?, ?, ?)`,
          [appointment_id, changed_by, prev.status, status, reason || null]
        );
      }

      return apiResponse(res, { message: "Appointment status updated successfully" });

    } catch (error) {
      console.error("Error updating appointment:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to update appointment"
      });
    }
  },
};

export default appointmentController;
