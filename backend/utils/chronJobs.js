import {db} from "../config/db.js";
import { sendAppointmentReminderEmail } from "../middleware/emailMiddleware.js";
import moment from "moment-timezone";

// Helper function to format date with timezone awareness
const formatDate = (dateString, timezone = "Australia/Sydney") => {
  return moment(dateString).tz(timezone).format("dddd, MMMM Do, YYYY");
};

// Helper function to format time with timezone awareness
const formatTime = (timeString, timezone = "Australia/Sydney") => {
  const [hours, minutes] = timeString.split(":");
  return moment()
    .tz(timezone)
    .hours(parseInt(hours))
    .minutes(parseInt(minutes))
    .format("hh:mm A");
};

// Helper function to get Australian timezone aware datetime
const getAustralianDateTime = (hoursOffset = 24) => {
  const australianTime = moment.tz("Australia/Sydney");
  const targetTime = australianTime.clone().add(hoursOffset, "hours");

  return {
    current: australianTime.format("YYYY-MM-DD HH:mm:ss"),
    target: targetTime.format("YYYY-MM-DD HH:mm:ss"),
    targetDate: targetTime.format("YYYY-MM-DD"),
    currentDate: australianTime.format("YYYY-MM-DD"),
  };
};

export const chronJobsFunctions = {
  sendAppointmentReminders: async () => {
    try {
      console.log("Starting appointment reminder job...");

      // Get Australian timezone aware datetimes
      const {
        current: currentDateTime,
        target: reminderDateTime,
        targetDate,
        currentDate,
      } = getAustralianDateTime(24);

      console.log(`Current Australian time: ${currentDateTime}`);
      console.log(`Looking for appointments at: ${reminderDateTime}`);

      // Query to get appointments that need reminders (24 hours ahead)
      const query = `
        SELECT 
          a.id as appointmentId,
          a.appointment_date,
          a.appointment_time,
          a.consultation_type,
          a.appointment_type,
          a.amount as consultationFee,
          a.currency,
          a.status,
          
          -- Patient details
          patient.id as patient_id,
          patient.email as patient_email,
          patient.full_name as patientName,
          patient.phone as patient_phone,
          
          -- Doctor details
          doctor.id as doctor_id,
          doctor.email as doctor_email,
          doctor.full_name as doctorName,
          doctor.phone as doctor_phone,
          
          -- Clinic details (if applicable)
          c.id as clinic_id,
          c.name as clinicName,
          c.email as clinic_email,
          c.address_line1,
          c.address_line2,
          c.city,
          
          -- Address details for home visits
          aa.address_line1 as home_address_line1,
          aa.address_line2 as home_address_line2,
          aa.city as home_city,
          aa.state as home_state,
          aa.country as home_country
          
        FROM appointments a
        JOIN users patient ON a.user_id = patient.id
        JOIN users doctor ON a.doctor_id = doctor.id
        LEFT JOIN clinic c ON a.clinic_id = c.id
        LEFT JOIN appointment_address aa ON a.id = aa.appointment_id
        
        WHERE 
          -- Appointments happening in the next 24 hours (±1 hour window for flexibility)
          a.appointment_date = ?
          AND TIME(a.appointment_time) BETWEEN 
            TIME(DATE_SUB(?, INTERVAL 1 HOUR)) 
            AND TIME(DATE_ADD(?, INTERVAL 1 HOUR))
          
          -- Exclude completed and cancelled appointments
          AND a.status NOT IN ('completed', 'cancelled')
          
          -- Only future appointments (not past ones)
          AND CONCAT(a.appointment_date, ' ', a.appointment_time) > ?
          
          -- Only appointments that haven't been reminded yet
          AND NOT EXISTS (
            SELECT 1 FROM appointment_reminders ar 
            WHERE ar.appointment_id = a.id 
            AND ar.reminder_type = 'email'
            AND ar.status = '1'
            AND DATE(ar.created_at) = ?
          )
        ORDER BY a.appointment_time ASC
      `;

      const [appointments] = await db.query(query, [
        targetDate,
        reminderDateTime,
        reminderDateTime,
        currentDateTime,
        currentDate,
      ]);

      console.log(`Found ${appointments.length} appointments to remind`);

      if (appointments.length === 0) {
        console.log("No appointments found for reminder");
        return;
      }

      for (const appointment of appointments) {
        try {
          // Determine location based on consultation type
          let location = "To be confirmed";
          if (
            appointment.consultation_type === "clinic_visit" &&
            appointment.clinicName
          ) {
            location =
              [
                appointment.address_line1,
                appointment.address_line2,
                appointment.city,
              ]
                .filter(Boolean)
                .join(", ") || appointment.clinicName;
          } else if (appointment.consultation_type === "home_visit") {
            location =
              [
                appointment.home_address_line1,
                appointment.home_address_line2,
                appointment.home_city,
                appointment.home_state,
                appointment.home_country,
              ]
                .filter(Boolean)
                .join(", ") || "Home Visit";
          }

          // Prepare appointment data with Australian timezone formatting
          const appointmentData = {
            appointmentId: appointment.appointmentId,
            patientName: appointment.patientName,
            doctorName: appointment.doctorName,
            appointmentDate: formatDate(
              appointment.appointment_date,
              "Australia/Sydney"
            ),
            appointmentTime: formatTime(
              appointment.appointment_time,
              "Australia/Sydney"
            ),
            appointment_type: appointment.appointment_type,
            consultation_type: appointment.consultation_type,
            consultationFee: appointment.consultationFee || 0,
            currency: appointment.currency || "AUD",
            clinicName: appointment.clinicName,
            location: location,
            status: appointment.status,
          };

          const emailPromises = [];

          // Send reminder to patient ONLY for confirmed appointments
          if (appointment.status === "confirmed") {
            emailPromises.push(
              sendAppointmentReminderEmail(
                appointment.patient_email,
                appointmentData,
                "patient"
              )
            );
            console.log(
              `Reminder queued for patient: ${appointment.patientName} (${appointment.status})`
            );
          } else {
            console.log(
              `Skipping patient reminder for ${appointment.patientName} - status: ${appointment.status} (not confirmed)`
            );
          }

          // Send reminder to doctor for pending, confirmed, and rescheduled appointments
          if (
            ["pending", "confirmed", "rescheduled"].includes(appointment.status)
          ) {
            emailPromises.push(
              sendAppointmentReminderEmail(
                appointment.doctor_email,
                appointmentData,
                "doctor"
              )
            );
            console.log(
              `Reminder queued for doctor: Dr. ${appointment.doctorName} (${appointment.status})`
            );
          }

          // Send reminder to clinic for pending, confirmed, and rescheduled appointments (if clinic exists)
          if (
            appointment.clinic_email &&
            ["pending", "confirmed", "rescheduled"].includes(appointment.status)
          ) {
            emailPromises.push(
              sendAppointmentReminderEmail(
                appointment.clinic_email,
                appointmentData,
                "clinic"
              )
            );
            console.log(
              `Reminder queued for clinic: ${appointment.clinicName} (${appointment.status})`
            );
          }

          // Send all emails
          await Promise.all(emailPromises);

          // Record that reminder was sent to prevent duplicates
          await db.query(
            `INSERT INTO appointment_reminders (
              appointment_id, 
              created_by_user_id, 
              created_by_role, 
              reminder_time, 
              reminder_type, 
              status
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              appointment.appointmentId,
              0, // System generated
              "admin", // System role
              reminderDateTime,
              "email",
              "1", // Active
            ]
          );

          console.log(
            `Reminder processing completed for appointment ID: ${appointment.appointmentId}`
          );
        } catch (emailError) {
          console.error(
            `Failed to send reminder for appointment ${appointment.appointmentId}:`,
            emailError.message
          );

          // Still record the attempt to prevent repeated failures
          try {
            await db.query(
              `INSERT INTO appointment_reminders (
                appointment_id, 
                created_by_user_id, 
                created_by_role, 
                reminder_time, 
                reminder_type, 
                status
              ) VALUES (?, ?, ?, ?, ?, ?)`,
              [
                appointment.appointmentId,
                0,
                "admin",
                reminderDateTime,
                "email",
                "2", // Inactive due to error
              ]
            );
          } catch (dbError) {
            console.error(
              `Failed to record reminder attempt for appointment ${appointment.appointmentId}:`,
              dbError.message
            );
          }
        }
      }

      console.log("Appointment reminder job completed successfully");
    } catch (error) {
      console.error("Error in appointment reminder job:", error.message);
      console.error("Stack trace:", error.stack);
      throw error;
    }
  },

  // Test function for development - can be called manually to test with Indian timezone
  testAppointmentReminders: async (testHoursOffset = 24) => {
    try {
      console.log(
        `Starting TEST appointment reminder job with ${testHoursOffset} hours offset...`
      );

      // For testing in India, use local timezone
      const testTime = moment().add(testHoursOffset, "hours");
      const currentTime = moment();

      console.log(
        `Current local time: ${currentTime.format("YYYY-MM-DD HH:mm:ss")}`
      );
      console.log(
        `Looking for test appointments at: ${testTime.format(
          "YYYY-MM-DD HH:mm:ss"
        )}`
      );

      // Similar query but with local timezone for testing
      const query = `
        SELECT 
          a.id as appointmentId,
          a.appointment_date,
          a.appointment_time,
          a.consultation_type,
          a.appointment_type,
          a.amount as consultationFee,
          a.currency,
          a.status,
          patient.email as patient_email,
          patient.full_name as patientName,
          doctor.email as doctor_email,
          doctor.full_name as doctorName,
          c.name as clinicName,
          c.email as clinic_email
          
        FROM appointments a
        JOIN users patient ON a.user_id = patient.id
        JOIN users doctor ON a.doctor_id = doctor.id
        LEFT JOIN clinic c ON a.clinic_id = c.id
        
        WHERE 
          a.appointment_date = ?
          AND a.status NOT IN ('completed', 'cancelled')
          AND CONCAT(a.appointment_date, ' ', a.appointment_time) > NOW()
        
        LIMIT 5 -- Limit for testing
      `;

      const [appointments] = await db.query(query, [
        testTime.format("YYYY-MM-DD"),
      ]);

      console.log(`Found ${appointments.length} test appointments`);

      // Process similar to main function but with test logging
      for (const appointment of appointments) {
        console.log(
          `TEST: Processing appointment ${appointment.appointmentId} - Status: ${appointment.status}`
        );
        console.log(
          `TEST: Patient gets reminder only if confirmed: ${
            appointment.status === "confirmed"
          }`
        );
        console.log(
          `TEST: Doctor gets reminder: ${[
            "pending",
            "confirmed",
            "rescheduled",
          ].includes(appointment.status)}`
        );
        console.log(
          `TEST: Clinic gets reminder: ${
            appointment.clinic_email &&
            ["pending", "confirmed", "rescheduled"].includes(appointment.status)
          }`
        );
      }

      console.log("Test appointment reminder job completed");
    } catch (error) {
      console.error("Error in test appointment reminder job:", error.message);
      throw error;
    }
  },
};
