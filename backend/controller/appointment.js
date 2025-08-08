import { db } from "../config/db.js";
import moment from "moment";
import { apiResponse } from "../utils/helper.js";
import validator from "validator";
import invoiceModel from "../models/invoiceModel.js";
import {
  sendAppointmentCancellationEmail,
  sendAppointmentEmail,
} from "../middleware/emailMiddleware.js";

const appointmentController = {
  bookAppointment: async (req, res) => {
    const {
      user_id,
      doctor_id,
      caregiver_id,
      clinic_id,
      appointment_date,
      appointment_time,
      consultation_type,
      appointment_type,
      payment_status,
      amount,
      currency,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pin_code,
      is_caregiver,
    } = req.body;

    let request_user = req.user;

    try {
      // === Input validation ===
      if (
        !user_id ||
        !doctor_id ||
        !appointment_date ||
        !appointment_time ||
        !consultation_type ||
        !appointment_type ||
        !payment_status ||
        !amount ||
        !currency
      ) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Missing required fields",
        });
      }

      if (!validator.isISO8601(appointment_date)) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Invalid appointment date format",
        });
      }

      if (!validator.isCurrency(amount.toString())) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Invalid amount format",
        });
      }

      // === Insert appointment ===
      const [result] = await db.query(
        `INSERT INTO appointments (
        user_id, doctor_id, caregiver_id, clinic_id,
        appointment_date, appointment_time, consultation_type,
        appointment_type, payment_status, amount, currency
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          doctor_id,
          caregiver_id || null,
          clinic_id || null,
          appointment_date,
          appointment_time,
          consultation_type,
          appointment_type,
          payment_status,
          amount,
          currency,
        ]
      );

      const appointment_id = result.insertId;

      // === Insert address if home visit ===
      if (consultation_type === "home_visit") {
        if (!address_line1 || !city || !state || !country || !pin_code) {
          return apiResponse(res, {
            error: true,
            code: 400,
            message: "Address fields are required for home visit",
          });
        }

        await db.query(
          `INSERT INTO appointment_address (
          appointment_id, is_caregiver, address_line1, address_line2,
          city, state, country, pin_code
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            appointment_id,
            !!is_caregiver,
            address_line1,
            address_line2 || "",
            city,
            state,
            country,
            pin_code,
          ]
        );
      }

      // generate invoice
      await invoiceModel.createInvoice({
        appointment_id,
        user_id,
        doctor_id,
        total_amount: amount,
        payment_status,
      });

      // === Fetch user, doctor, and clinic details for email ===
      const [[user]] = await db.query(
        `SELECT full_name, email FROM users WHERE id = ?`,
        [user_id]
      );
      const [[doctor]] = await db.query(
        `SELECT full_name, email FROM users WHERE id = ?`,
        [doctor_id]
      );

      let clinic = null;
      if (clinic_id) {
        const [[clinicData]] = await db.query(
          `SELECT name, email, address_line1, address_line2, city FROM clinic WHERE id = ?`,
          [clinic_id]
        );
        clinic = clinicData;
      }

      // === Format fields for email ===
      const appointmentDateFormatted =
        moment(appointment_date).format("Do MMMM YYYY");
      const appointmentTimeFormatted = moment(
        appointment_time,
        "HH:mm:ss"
      ).format("hh:mm A");

      let location = "N/A";
      if (consultation_type === "clinic_visit" && clinic) {
        location = [clinic.address_line1, clinic.address_line2, clinic.city]
          .filter(Boolean)
          .join(", ");
      } else if (consultation_type === "home_visit") {
        location = [address_line1, address_line2, city]
          .filter(Boolean)
          .join(", ");
      }

      const appointmentData = {
        patientName: user.full_name,
        doctorName: doctor.full_name,
        appointmentDate: appointmentDateFormatted,
        appointmentTime: appointmentTimeFormatted,
        appointment_type,
        department: "",
        location,
        appointmentId: appointment_id,
        consultationFee: amount,
        instructions: "",
        clinicName: clinic?.name || "",
        bookedBy: request_user.role,
        bookedByName: request_user?.full_name,
      };

      // === Send emails based on who booked the appointment ===
      const emailPromises = [];

      if (request_user.role === "patient") {
        // Patient books for themselves - send to patient, doctor, and clinic
        emailPromises.push(
          sendAppointmentEmail(
            user.email,
            appointmentData,
            "patient",
            "patient"
          )
        );
        emailPromises.push(
          sendAppointmentEmail(
            doctor.email,
            appointmentData,
            "doctor",
            "patient"
          )
        );
        if (clinic?.email) {
          emailPromises.push(
            sendAppointmentEmail(
              clinic.email,
              appointmentData,
              "clinic",
              "patient"
            )
          );
        }
      } else if (request_user.role === "clinic") {
        // Clinic books appointment - send to patient and doctor
        emailPromises.push(
          sendAppointmentEmail(user.email, appointmentData, "patient", "clinic")
        );
        emailPromises.push(
          sendAppointmentEmail(
            doctor.email,
            appointmentData,
            "doctor",
            "clinic"
          )
        );
      } else if (request_user.role === "admin") {
        // Admin books appointment - send to patient, doctor, and clinic
        emailPromises.push(
          sendAppointmentEmail(user.email, appointmentData, "patient", "admin")
        );
        emailPromises.push(
          sendAppointmentEmail(doctor.email, appointmentData, "doctor", "admin")
        );
        if (clinic?.email) {
          emailPromises.push(
            sendAppointmentEmail(
              clinic.email,
              appointmentData,
              "clinic",
              "admin"
            )
          );
        }
      }

      // Send all emails
      await Promise.all(emailPromises);

      return apiResponse(res, {
        message: "Appointment booked successfully",
        payload: { appointment_id },
      });
    } catch (error) {
      console.error("Error booking appointment:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to book appointment",
      });
    }
  },

  // GET APPOINTMENT BY ID
  getAppointmentById: async (req, res) => {
    const { appointment_id } = req.params;

    try {
      const [[appointment]] = await db.query(
        `SELECT 
        a.*, 
        u.f_name AS patient_fname, u.l_name AS patient_lname, u.profile_image AS patient_profile_image, u.email AS patient_email, u.phone AS patient_phone, u.phone_code AS patient_phone_code,
        d.f_name AS doctor_fname, d.l_name AS doctor_lname, d.prefix AS doctor_prefix, d.profile_image AS doctor_profile_image, d.email AS doctor_email, d.phone AS doctor_phone, d.phone_code AS doctor_phone_code,
        ad.address_line1, ad.address_line2, ad.city, ad.state, ad.country, ad.pin_code,
        c.address_line1 AS clinic_address_line1, c.address_line2 AS clinic_address_line2, c.city AS clinic_city, c.state AS clinic_state, c.country AS clinic_country, c.pin_code AS clinic_pin,
        doc.address_line1 AS doctor_address_line1, doc.address_line2 AS doctor_address_line2, doc.city AS doctor_city, doc.state AS doctor_state, doc.country AS doctor_country, doc.pin_code AS doctor_pin,
        cg.address_line1 AS caregiver_address_line1, cg.address_line2 AS caregiver_address_line2, cg.city AS caregiver_city, cg.state AS caregiver_state, cg.country AS caregiver_country, cg.pin_code AS caregiver_pin,
        pu.address_line1 AS patient_address_line1, pu.address_line2 AS patient_address_line2, pu.city AS patient_city, pu.state AS patient_state, pu.country AS patient_country, pu.pin_code AS patient_pin
      FROM appointments a
      JOIN users u ON u.id = a.user_id
      JOIN users d ON d.id = a.doctor_id
      LEFT JOIN appointment_address ad ON ad.appointment_id = a.id
      LEFT JOIN clinic c ON c.id = a.clinic_id
      LEFT JOIN users doc ON doc.id = a.doctor_id
      LEFT JOIN patient_caregiver cg ON cg.id = a.caregiver_id
      LEFT JOIN users pu ON pu.id = a.user_id
      WHERE a.id = ?`,
        [appointment_id]
      );

      if (!appointment) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Appointment not found",
        });
      }

      // Fetch doctor specializations
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
        WHERE ds.doctor_id = ? AND ds.status = '1' AND s.status = '1'`,
        [appointment.doctor_id]
      );

      // Format specializations to match getAppointments structure
      const formattedSpecializations = specializations.map((spec) => ({
        id: spec.specialization_id,
        name: spec.name,
        doctor_specialization_id: spec.doctor_specialization_id,
        status: spec.status,
        created_at: spec.created_at,
        updated_at: spec.updated_at,
      }));

      // Address resolution aligned with getAppointments
      let resolvedAddress = null;

      if (appointment.consultation_type === "clinic_visit") {
        if (appointment.clinic_address_line1) {
          resolvedAddress = {
            line1: appointment.clinic_address_line1,
            line2: appointment.clinic_address_line2,
            city: appointment.clinic_city,
            state: appointment.clinic_state,
            country: appointment.clinic_country,
            pin_code: appointment.clinic_pin,
          };
        }
      } else if (appointment.consultation_type === "home_visit") {
        const hasAppointmentAddress = appointment.address_line1;
        if (!appointment.caregiver_id) {
          // No caregiver
          if (hasAppointmentAddress) {
            resolvedAddress = {
              line1: appointment.address_line1,
              line2: appointment.address_line2,
              city: appointment.city,
              state: appointment.state,
              country: appointment.country,
              pin_code: appointment.pin_code,
            };
          } else if (appointment.patient_address_line1) {
            resolvedAddress = {
              line1: appointment.patient_address_line1,
              line2: appointment.patient_address_line2,
              city: appointment.patient_city,
              state: appointment.patient_state,
              country: appointment.patient_country,
              pin_code: appointment.patient_pin,
            };
          }
        } else {
          // Caregiver present
          if (hasAppointmentAddress) {
            resolvedAddress = {
              line1: appointment.address_line1,
              line2: appointment.address_line2,
              city: appointment.city,
              state: appointment.state,
              country: appointment.country,
              pin_code: appointment.pin_code,
            };
          } else if (appointment.caregiver_address_line1) {
            resolvedAddress = {
              line1: appointment.caregiver_address_line1,
              line2: appointment.caregiver_address_line2,
              city: appointment.caregiver_city,
              state: appointment.caregiver_state,
              country: appointment.caregiver_country,
              pin_code: appointment.caregiver_pin,
            };
          }
        }
      } else if (appointment.doctor_address_line1) {
        resolvedAddress = {
          line1: appointment.doctor_address_line1,
          line2: appointment.doctor_address_line2,
          city: appointment.doctor_city,
          state: appointment.doctor_state,
          country: appointment.doctor_country,
          pin_code: appointment.doctor_pin,
        };
      }

      const formattedAppointment = {
        ...appointment,
        specializations: formattedSpecializations,
        resolved_address: resolvedAddress,
      };

      return apiResponse(res, {
        message: "Appointment fetched successfully",
        payload: formattedAppointment,
      });
    } catch (error) {
      console.error("Error fetching appointment:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to fetch appointment",
      });
    }
  },

  // GET APPOINTMENTS WITH PAGINATION
  getAppointments: async (req, res) => {
    const { user_id, doctor_id, type, page = 1, limit = 10 } = req.query;
    const { role, id } = req.user;

    try {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;

      let where = [];
      let params = [];

      // 🔐 Role-based access control
      if (role === "patient") {
        where.push("a.user_id = ?");
        params.push(id); // Logged-in patient
      } else if (role === "doctor") {
        where.push("a.doctor_id = ?");
        params.push(id); // Logged-in doctor
      } else if (role === "clinic") {
        where.push("a.clinic_id = ?");
        params.push(id); // Logged-in clinic
      } else if (role === "admin") {
        if (user_id) {
          where.push("a.user_id = ?");
          params.push(user_id);
        }
        if (doctor_id) {
          where.push("a.doctor_id = ?");
          params.push(doctor_id);
        }
      }

      // Type filter
      if (type === "upcoming") {
        where.push(
          "CONCAT(DATE(a.appointment_date), ' ', a.appointment_time) >= NOW()"
        );
      } else if (type === "today") {
        where.push("DATE(a.appointment_date) = CURDATE()");
      }

      const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

      // Get total count
      const [[{ total }]] = await db.query(
        `SELECT COUNT(*) AS total FROM appointments a ${whereClause}`,
        params
      );

      // Fetch paginated appointments
      const [appointments] = await db.query(
        `SELECT 
        a.*, 
        u.f_name AS patient_fname, u.l_name AS patient_lname, u.profile_image AS patient_profile_image, u.email AS patient_email, u.phone AS patient_phone, u.phone_code AS patient_phone_code,
        d.f_name AS doctor_fname, d.l_name AS doctor_lname, d.prefix AS doctor_prefix, d.profile_image AS doctor_profile_image, d.email AS doctor_email, d.phone AS doctor_phone, d.phone_code AS doctor_phone_code,
        ad.address_line1, ad.address_line2, ad.city, ad.state, ad.country, ad.pin_code,
        c.address_line1 AS clinic_address_line1, c.address_line2 AS clinic_address_line2, c.city AS clinic_city, c.state AS clinic_state, c.country AS clinic_country, c.pin_code AS clinic_pin,
        doc.address_line1 AS doctor_address_line1, doc.address_line2 AS doctor_address_line2, doc.city AS doctor_city, doc.state AS doctor_state, doc.country AS doctor_country, doc.pin_code AS doctor_pin,
        cg.address_line1 AS caregiver_address_line1, cg.address_line2 AS caregiver_address_line2, cg.city AS caregiver_city, cg.state AS caregiver_state, cg.country AS caregiver_country, cg.pin_code AS caregiver_pin,
        pu.address_line1 AS patient_address_line1, pu.address_line2 AS patient_address_line2, pu.city AS patient_city, pu.state AS patient_state, pu.country AS patient_country, pu.pin_code AS patient_pin
      FROM appointments a
      JOIN users u ON u.id = a.user_id
      JOIN users d ON d.id = a.doctor_id
      LEFT JOIN appointment_address ad ON ad.appointment_id = a.id
      LEFT JOIN clinic c ON c.id = a.clinic_id
      LEFT JOIN users doc ON doc.id = a.doctor_id
      LEFT JOIN patient_caregiver cg ON cg.id = a.caregiver_id
      LEFT JOIN users pu ON pu.id = a.user_id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?`,
        [...params, limitNum, offset]
      );

      // Fetch all doctor specializations in one query
      const doctorIds = [
        ...new Set(appointments.map((appt) => appt.doctor_id)),
      ];
      let specializations = [];
      if (doctorIds.length > 0) {
        const [specs] = await db.query(
          `SELECT 
          ds.id AS doctor_specialization_id, 
          ds.status, 
          ds.created_at, 
          ds.updated_at, 
          s.id AS specialization_id, 
          s.name, 
          ds.doctor_id
        FROM doctor_specializations ds
        JOIN specializations s ON s.id = ds.specialization_id
        WHERE ds.doctor_id IN (?) AND ds.status = 1 AND s.status = 1`,
          [doctorIds]
        );
        specializations = specs;
      }

      // Map specializations to appointments
      const specializationMap = specializations.reduce((acc, spec) => {
        if (!acc[spec.doctor_id]) {
          acc[spec.doctor_id] = [];
        }
        acc[spec.doctor_id].push({
          id: spec.specialization_id,
          name: spec.name,
          doctor_specialization_id: spec.doctor_specialization_id,
          status: spec.status,
          created_at: spec.created_at,
          updated_at: spec.updated_at,
        });
        return acc;
      }, {});

      // Address resolution and attach specializations
      const formattedAppointments = appointments.map((appt) => {
        let resolvedAddress = null;

        if (appt.consultation_type === "clinic_visit") {
          if (appt.clinic_address_line1) {
            resolvedAddress = {
              line1: appt.clinic_address_line1,
              line2: appt.clinic_address_line2,
              city: appt.clinic_city,
              state: appt.clinic_state,
              country: appt.clinic_country,
              pin_code: appt.clinic_pin,
            };
          }
        } else if (appt.consultation_type === "home_visit") {
          const hasAppointmentAddress = appt.address_line1;
          if (!appt.caregiver_id) {
            // No caregiver
            if (hasAppointmentAddress) {
              resolvedAddress = {
                line1: appt.address_line1,
                line2: appt.address_line2,
                city: appt.city,
                state: appt.state,
                country: appt.country,
                pin_code: appt.pin_code,
              };
            } else if (appt.patient_address_line1) {
              resolvedAddress = {
                line1: appt.patient_address_line1,
                line2: appt.patient_address_line2,
                city: appt.patient_city,
                state: appt.patient_state,
                country: appt.patient_country,
                pin_code: appt.patient_pin,
              };
            }
          } else {
            // Caregiver present
            if (hasAppointmentAddress) {
              resolvedAddress = {
                line1: appt.address_line1,
                line2: appt.address_line2,
                city: appt.city,
                state: appt.state,
                country: appt.country,
                pin_code: appt.pin_code,
              };
            } else if (appt.caregiver_address_line1) {
              resolvedAddress = {
                line1: appt.caregiver_address_line1,
                line2: appt.caregiver_address_line2,
                city: appt.caregiver_city,
                state: appt.caregiver_state,
                country: appt.caregiver_country,
                pin_code: appt.caregiver_pin,
              };
            }
          }
        } else if (appt.doctor_address_line1) {
          resolvedAddress = {
            line1: appt.doctor_address_line1,
            line2: appt.doctor_address_line2,
            city: appt.doctor_city,
            state: appt.doctor_state,
            country: appt.doctor_country,
            pin_code: appt.doctor_pin,
          };
        }

        return {
          ...appt,
          specializations: specializationMap[appt.doctor_id] || [],
          resolved_address: resolvedAddress,
        };
      });

      return apiResponse(res, {
        message: "Appointments fetched successfully",
        payload: {
          total,
          page: pageNum,
          limit: limitNum,
          data: formattedAppointments,
        },
      });
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to get appointments",
      });
    }
  },

  // UPDATE APPOINTMENT STATUS
  updateAppointmentStatus: async (req, res) => {
    const {
      appointment_id,
      status,
      appointment_date,
      appointment_time,
      reason,
    } = req.body;

    const changed_by = req.user?.id;

    // Define allowed status values
    const allowedStatuses = [
      "pending",
      "confirmed",
      "cancelled",
      "completed",
      "rescheduled",
    ];

    try {
      // === Input validations ===
      if (!appointment_id || !status) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "appointment_id and status are required",
        });
      }

      if (!allowedStatuses.includes(status)) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: `Invalid status. Allowed values: ${allowedStatuses.join(
            ", "
          )}`,
        });
      }

      // Check appointment exists
      const [[prev]] = await db.query(
        `SELECT status FROM appointments WHERE id = ?`,
        [appointment_id]
      );

      if (!prev) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Appointment not found",
        });
      }

      // === Update logic ===
      if (status === "rescheduled") {
        if (!appointment_date || !appointment_time) {
          return apiResponse(res, {
            error: true,
            code: 400,
            message:
              "appointment_date and appointment_time are required for rescheduling",
          });
        }

        await db.query(
          `UPDATE appointments SET appointment_date = ?, appointment_time = ?, status = ? WHERE id = ?`,
          [appointment_date, appointment_time, "rescheduled", appointment_id]
        );

        await db.query(
          `INSERT INTO appointment_logs (appointment_id, changed_by, previous_status, new_status, reason)
         VALUES (?, ?, ?, ?, ?)`,
          [
            appointment_id,
            changed_by,
            prev.status,
            "rescheduled",
            reason || "Rescheduled",
          ]
        );
      } else {
        await db.query(`UPDATE appointments SET status = ? WHERE id = ?`, [
          status,
          appointment_id,
        ]);

        await db.query(
          `INSERT INTO appointment_logs (appointment_id, changed_by, previous_status, new_status, reason)
         VALUES (?, ?, ?, ?, ?)`,
          [appointment_id, changed_by, prev.status, status, reason || null]
        );
      }

      return apiResponse(res, {
        message: "Appointment status updated successfully",
      });
    } catch (error) {
      console.error("Error updating appointment:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to update appointment",
      });
    }
  },

  // update payment status not in used
  updatePaymentStatus: async (req, res) => {
    try {
      const { appointment_id, payment_status, amount, currency } = req.body;

      // === Validate input ===
      if (!appointment_id || !payment_status || !amount || !currency) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Missing required fields",
        });
      }

      if (!validator.isCurrency(amount.toString())) {
        return apiResponse(res, {
          error: true,
          code: 400,
          message: "Invalid amount format",
        });
      }

      // === Check if appointment exists ===
      const [[appointment]] = await db.query(
        `SELECT id FROM appointments WHERE id = ?`,
        [appointment_id]
      );

      if (!appointment) {
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Appointment not found",
        });
      }

      // === Update payment status ===
      await db.query(
        `UPDATE appointments SET payment_status = ?, amount = ?, currency = ? WHERE id = ?`,
        [payment_status, amount, currency, appointment_id]
      );

      return apiResponse(res, {
        message: "Payment status updated successfully",
      });
    } catch (error) {
      console.error("Error updating payment status of appointment:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Failed to update payment status of appointment",
      });
    }
  },

  // actually change payment status
  // This function is used to change the payment status of an appointment and invoice both using transaction
  changePaymentStatus: async (req, res) => {
    const { appointment_id, payment_status } = req.body;

    // Validate input
    if (!appointment_id || !payment_status) {
      return apiResponse(res, {
        error: true,
        code: 400,
        message: "appointment_id and payment_status are required",
      });
    }

    // Validate payment_status
    const validStatuses = ["paid", "unpaid"];
    if (!validStatuses.includes(payment_status)) {
      return apiResponse(res, {
        error: true,
        code: 400,
        message: "Invalid payment status",
      });
    }

    const connection = await db.getConnection();

    try {
      // Start transaction
      await connection.beginTransaction();

      // Check if appointment exists
      const [[appointment]] = await connection.query(
        `SELECT id FROM appointments WHERE id = ?`,
        [appointment_id]
      );

      if (!appointment) {
        await connection.rollback();
        return apiResponse(res, {
          error: true,
          code: 404,
          message: "Appointment not found",
        });
      }

      // Check if invoice exists for the appointment
      const [[invoice]] = await connection.query(
        `SELECT id FROM invoices WHERE appointment_id = ?`,
        [appointment_id]
      );

      // Update appointment payment status
      await connection.query(
        `UPDATE appointments SET payment_status = ? WHERE id = ?`,
        [payment_status, appointment_id]
      );

      // Update invoice status if invoice exists
      if (invoice) {
        const invoiceStatus = payment_status === "paid" ? "paid" : "unpaid";
        await connection.query(
          `UPDATE invoices SET status = ? WHERE appointment_id = ?`,
          [invoiceStatus, appointment_id]
        );
      }

      // Commit transaction
      await connection.commit();

      return apiResponse(res, {
        message: "Payment status updated successfully",
      });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      return apiResponse(res, {
        error: true,
        code: 500,
        message: "Error updating payment status: " + error.message,
      });
    } finally {
      connection.release();
    }
  },
};

export default appointmentController;
