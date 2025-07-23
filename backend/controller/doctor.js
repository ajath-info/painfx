import { db } from "../config/db.js";
import moment from "moment";
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcryptjs";
import { apiResponse, emailCheck, isUsernameTaken } from "../utils/helper.js";
import { uploadImage, deleteImage } from "../utils/fileHelper.js";
import {
  sendLoginNotificationEmail,
  sendWelcomeEmail,
} from "../middleware/emailMiddleware.js";

const doctorController = {
  // listing of approved and active doctors by recently added with search filters
  getActiveDoctors: async (req, res) => {
    const { name, location } = req.query;

    try {
      let baseQuery = `SELECT 
     u.id, u.prefix, u.f_name, u.l_name, u.bio,
     u.address_line1, u.address_line2, u.city, u.state, u.country,
     u.consultation_fee, u.consultation_fee_type, u.profile_image
   FROM users u
   WHERE u.role = 'doctor' AND u.status = '1'`;

      const params = [];

      if (location) {
        baseQuery += ` AND (u.city LIKE ? OR u.state LIKE ? OR u.country LIKE ?)`;
        const locPattern = `%${location.trim()}%`;
        params.push(locPattern, locPattern, locPattern);
      }

      if (name) {
        baseQuery += ` AND (u.f_name LIKE ? OR u.l_name LIKE ?)`;
        const namePattern = `%${name.trim()}%`;
        params.push(namePattern, namePattern);
      }

      baseQuery += ` ORDER BY u.created_at DESC`;

      const [doctors] = await db.query(baseQuery, params);

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

        // Next available date
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
          next_available: nextAvailableDate || null,
        });
      }

      return apiResponse(res, {
        message: "Doctors fetched successfully",
        payload: result,
      });
    } catch (error) {
      console.error("Error fetching active doctors:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch active doctors",
      });
    }
  },

  // update profile
  updateProfile: async (req, res) => {
    const doctor_id = req.user.id;
    const {
      prefix,
      f_name,
      l_name,
      phone,
      phone_code,
      DOB,
      gender,
      bio,
      profile_image,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pin_code,
      consultation_fee_type,
      consultation_fee,
    } = req.body;

    try {
      const validPrefixes = ["Mr", "Mrs", "Ms", "Dr"];
      const validGenders = ["male", "female", "other"];
      const validFeeTypes = ["free", "paid"];

      const [[doctor]] = await db.query(
        `SELECT * FROM users WHERE id = ? AND role = 'doctor'`,
        [doctor_id]
      );
      if (!doctor) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "User not found",
        });
      }

      // VALIDATION
      if (prefix && !validPrefixes.includes(prefix)) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Invalid prefix",
        });
      }

      if (phone) {
        if (!validator.isMobilePhone(phone + "", "any")) {
          return apiResponse(res, {
            error: true,
            code: 400,
            status: 0,
            message: "Invalid phone number",
          });
        }
        if (!phone_code) {
          return apiResponse(res, {
            error: true,
            code: 400,
            status: 0,
            message: "Phone code is required if phone is provided",
          });
        }
      }

      if (gender && !validGenders.includes(gender)) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Invalid gender",
        });
      }

      if (
        consultation_fee_type &&
        !validFeeTypes.includes(consultation_fee_type)
      ) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Invalid consultation fee type",
        });
      }

      if (
        consultation_fee_type === "paid" &&
        (!consultation_fee || isNaN(consultation_fee))
      ) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Consultation fee must be a number",
        });
      }

      // BUILD dynamic update query
      const fields = [];
      const values = [];

      if (prefix) {
        fields.push("prefix = ?");
        values.push(prefix);
      }

      if (f_name) {
        fields.push("f_name = ?");
        values.push(f_name.trim());
      }

      if (l_name) {
        fields.push("l_name = ?");
        values.push(l_name.trim());
      }

      // Update full_name only if any name or prefix changes
      const newFName = f_name ? f_name.trim() : doctor.f_name;
      const newLName = l_name ? l_name.trim() : doctor.l_name;
      const newPrefix = prefix || doctor.prefix;
      if (f_name || l_name || prefix) {
        fields.push("full_name = ?");
        values.push(`${newPrefix} ${newFName} ${newLName}`);
      }

      if (phone) {
        fields.push("phone = ?");
        values.push(phone.trim());
        fields.push("phone_code = ?");
        values.push(phone_code.trim());
      }

      if (DOB) {
        fields.push("DOB = ?");
        values.push(DOB);
      }

      if (gender) {
        fields.push("gender = ?");
        values.push(gender);
      }

      if (bio !== undefined) {
        fields.push("bio = ?");
        values.push(bio.trim());
      }

      if (profile_image !== undefined) {
        fields.push("profile_image = ?");
        values.push(profile_image.trim());
      }

      if (address_line1 !== undefined) {
        fields.push("address_line1 = ?");
        values.push(address_line1.trim());
      }

      if (address_line2 !== undefined) {
        fields.push("address_line2 = ?");
        values.push(address_line2.trim());
      }

      if (city !== undefined) {
        fields.push("city = ?");
        values.push(city.trim());
      }

      if (state !== undefined) {
        fields.push("state = ?");
        values.push(state.trim());
      }

      if (country !== undefined) {
        fields.push("country = ?");
        values.push(country.trim());
      }

      if (pin_code !== undefined) {
        fields.push("pin_code = ?");
        values.push(pin_code.trim());
      }

      if (consultation_fee_type) {
        fields.push("consultation_fee_type = ?");
        values.push(consultation_fee_type);
      }

      if (consultation_fee_type === "paid") {
        fields.push("consultation_fee = ?");
        values.push(consultation_fee);
      }

      // Nothing to update
      if (fields.length === 0) {
        return apiResponse(res, {
          error: false,
          code: 200,
          status: 1,
          message: "No changes provided",
        });
      }

      // Add updated_at
      fields.push("updated_at = NOW()");

      const updateQuery = `UPDATE users SET ${fields.join(
        ", "
      )} WHERE id = ? AND role = 'doctor'`;
      values.push(doctor_id);

      await db.query(updateQuery, values);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to update profile",
      });
    }
  },

  // master update profile section of doctor by doctor, admin, associated clinic
  masterUpdate: async (req, res) => {
    const user = req.user;
    let doctor_id = null;

    if (user.role === "admin" && req.query.id) {
      doctor_id = req.query.id;
    } else if (user.role === "clinic" && req.query.id) {
      const [mapping] = await db.query(
        `SELECT id FROM clinic_doctors WHERE clinic_id = ? AND doctor_id = ?`,
        [user.id, req.query.id]
      );
      if (mapping.length) {
        doctor_id = req.query.id;
      } else {
        return apiResponse(res, {
          error: true,
          code: 403,
          status: 0,
          message: "You do not have permission to update this doctor's profile",
        });
      }
    } else if (user.role === "doctor") {
      doctor_id = user.id;
    } else {
      return apiResponse(res, {
        error: true,
        code: 403,
        status: 0,
        message: "Unauthorized to update doctor profile",
      });
    }

    const {
      profile,
      services = [],
      specializations = [],
      educations = [],
      experiences = [],
      awards = [],
      memberships = [],
      registration,
    } = req.body;

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [[doctor]] = await connection.query(
        `SELECT * FROM users WHERE id = ? AND role = 'doctor'`,
        [doctor_id]
      );
      if (!doctor) {
        await connection.rollback();
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Doctor not found",
        });
      }

      let profile_image = doctor.profile_image;
      if (req.files?.image) {
        if (profile_image) deleteImage(profile_image);
        profile_image = await uploadImage(req.files.image, "patients");
      }

      if (profile) {
        const {
          prefix,
          f_name,
          l_name,
          phone,
          phone_code,
          DOB,
          gender,
          bio,
          address_line1,
          address_line2,
          city,
          state,
          country,
          pin_code,
          consultation_fee_type,
          consultation_fee,
        } = profile;

        const validPrefixes = ["Mr", "Mrs", "Ms", "Dr"];
        const validGenders = ["male", "female", "other"];
        const validFeeTypes = ["free", "paid"];

        if (prefix && !validPrefixes.includes(prefix)) {
          throw new Error("Invalid prefix");
        }

        if (phone && !validator.isMobilePhone(phone + "", "any")) {
          throw new Error("Invalid phone number");
        }

        if (phone && !phone_code) {
          throw new Error("Phone code is required if phone is provided");
        }

        if (gender && !validGenders.includes(gender)) {
          throw new Error("Invalid gender");
        }

        if (
          consultation_fee_type &&
          !validFeeTypes.includes(consultation_fee_type)
        ) {
          throw new Error("Invalid consultation fee type");
        }

        if (
          consultation_fee_type === "paid" &&
          (!consultation_fee || isNaN(consultation_fee) || consultation_fee < 0)
        ) {
          throw new Error(
            "Consultation fee must be a valid non-negative number"
          );
        }

        if (DOB && moment(DOB).isAfter(moment())) {
          throw new Error("DOB cannot be in the future");
        }

        const fields = [];
        const values = [];

        if (prefix) {
          fields.push("prefix = ?");
          values.push(prefix);
        }
        if (f_name) {
          fields.push("f_name = ?");
          values.push(f_name.trim());
        }
        if (l_name) {
          fields.push("l_name = ?");
          values.push(l_name.trim());
        }
        if (f_name || l_name || prefix) {
          const newFName = f_name ? f_name.trim() : doctor.f_name;
          const newLName = l_name ? l_name.trim() : doctor.l_name;
          const newPrefix = prefix || doctor.prefix;
          fields.push("full_name = ?");
          values.push(`${newPrefix} ${newFName} ${newLName}`);
        }
        if (phone) {
          fields.push("phone = ?");
          values.push(phone.trim());
          fields.push("phone_code = ?");
          values.push(phone_code.trim());
        }
        if (DOB) {
          fields.push("DOB = ?");
          values.push(DOB);
        }
        if (gender) {
          fields.push("gender = ?");
          values.push(gender);
        }
        if (bio !== undefined) {
          fields.push("bio = ?");
          values.push(bio?.trim() || null);
        }
        if (profile_image !== undefined) {
          fields.push("profile_image = ?");
          values.push(profile_image?.trim() || null);
        }
        if (address_line1 !== undefined) {
          fields.push("address_line1 = ?");
          values.push(address_line1?.trim() || null);
        }
        if (address_line2 !== undefined) {
          fields.push("address_line2 = ?");
          values.push(address_line2?.trim() || null);
        }
        if (city !== undefined) {
          fields.push("city = ?");
          values.push(city?.trim() || null);
        }
        if (state !== undefined) {
          fields.push("state = ?");
          values.push(state?.trim() || null);
        }
        if (country !== undefined) {
          fields.push("country = ?");
          values.push(country?.trim() || null);
        }
        if (pin_code !== undefined) {
          fields.push("pin_code = ?");
          values.push(pin_code?.trim() || null);
        }
        if (consultation_fee_type) {
          fields.push("consultation_fee_type = ?");
          values.push(consultation_fee_type);
        }
        if (consultation_fee_type === "paid") {
          fields.push("consultation_fee = ?");
          values.push(consultation_fee);
        }
        if (fields.length) {
          fields.push("updated_at = NOW()");
          await connection.query(
            `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
            [...values, doctor_id]
          );
        }
      }

      await connection.query(
        `DELETE FROM doctor_services WHERE doctor_id = ?`,
        [doctor_id]
      );
      for (let name of services) {
        name = name?.trim()?.toLowerCase();
        if (!name) continue;

        const [existing] = await connection.query(
          `SELECT id FROM services WHERE name = ?`,
          [name]
        );
        let serviceId = existing.length
          ? existing[0].id
          : (
              await connection.query(
                `INSERT INTO services (name, status) VALUES (?, '1')`,
                [name]
              )
            )[0].insertId;

        await connection.query(
          `INSERT INTO doctor_services (doctor_id, services_id, status) VALUES (?, ?, '1')`,
          [doctor_id, serviceId]
        );
      }

      await connection.query(
        `DELETE FROM doctor_specializations WHERE doctor_id = ?`,
        [doctor_id]
      );
      for (const spId of specializations) {
        if (!spId || isNaN(spId)) continue;

        const [exists] = await connection.query(
          `SELECT id FROM specializations WHERE id = ? AND status = '1'`,
          [spId]
        );

        if (exists.length) {
          await connection.query(
            `INSERT INTO doctor_specializations (doctor_id, specialization_id, status) VALUES (?, ?, '1')`,
            [doctor_id, spId]
          );
        }
      }

      await connection.query(`DELETE FROM educations WHERE doctor_id = ?`, [
        doctor_id,
      ]);
      for (const edu of educations) {
        const { degree, institution, year_of_passing } = edu;
        if (
          !degree?.trim() ||
          !institution?.trim() ||
          !year_of_passing ||
          year_of_passing < 1900 ||
          year_of_passing > new Date().getFullYear()
        )
          continue;

        await connection.query(
          `INSERT INTO educations (doctor_id, degree, institution, year_of_passing) VALUES (?, ?, ?, ?)`,
          [doctor_id, degree.trim(), institution.trim(), year_of_passing]
        );
      }

      await connection.query(`DELETE FROM experiences WHERE doctor_id = ?`, [
        doctor_id,
      ]);
      for (const exp of experiences) {
        const {
          hospital,
          start_date,
          end_date,
          currently_working,
          designation,
        } = exp;
        if (!hospital?.trim() || !start_date || !designation?.trim()) continue;

        const isCurrent =
          currently_working === true ||
          currently_working === "true" ||
          currently_working == 1;
        const parsedEnd = isCurrent ? null : end_date;

        if (!isCurrent && parsedEnd && moment(start_date).isAfter(parsedEnd))
          continue;

        await connection.query(
          `INSERT INTO experiences (doctor_id, hospital, start_date, end_date, currently_working, designation) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            doctor_id,
            hospital.trim(),
            start_date,
            parsedEnd,
            isCurrent ? 1 : 0,
            designation.trim(),
          ]
        );
      }

      await connection.query(`DELETE FROM awards WHERE doctor_id = ?`, [
        doctor_id,
      ]);
      for (const award of awards) {
        const { title, year } = award;
        if (
          !title?.trim() ||
          !year ||
          isNaN(year) ||
          year < 1900 ||
          year > new Date().getFullYear()
        )
          continue;

        await connection.query(
          `INSERT INTO awards (doctor_id, title, year) VALUES (?, ?, ?)`,
          [doctor_id, title.trim(), year]
        );
      }

      await connection.query(`DELETE FROM memberships WHERE doctor_id = ?`, [
        doctor_id,
      ]);
      for (const m of memberships) {
        if (!m.text?.trim()) continue;
        await connection.query(
          `INSERT INTO memberships (doctor_id, text) VALUES (?, ?)`,
          [doctor_id, m.text.trim()]
        );
      }

      await connection.query(
        `DELETE FROM doctor_registration WHERE doctor_id = ?`,
        [doctor_id]
      );
      if (registration) {
        const { registration_number, registration_date } = registration;
        if (registration_number?.trim() && registration_date) {
          await connection.query(
            `INSERT INTO doctor_registration (doctor_id, registration_number, registration_date) VALUES (?, ?, ?)`,
            [doctor_id, registration_number.trim(), registration_date]
          );
        }
      }

      await connection.commit();
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Doctor profile updated successfully",
      });
    } catch (error) {
      await connection.rollback();
      console.error("Error in masterUpdate:", error.message);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: error.message || "Failed to update doctor profile",
      });
    } finally {
      connection.release();
    }
  },

  //  admin or clinic can only add or update 
  addOrUpdateDoctor: async (req, res) => {
    const {
      email,
      password,
      f_name,
      l_name,
      phone,
      phone_code,
      prefix,
      DOB,
      gender,
      bio,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pin_code,
      consultation_fee_type,
      consultation_fee,
      // clinic_ids = [],
      services = [],
      specializations = [],
      educations = [],
      experiences = [],
      awards = [],
      memberships = [],
      registration,
    } = req.body;

// Normalize clinic_ids
let clinic_ids = [];
try {
  if (typeof req.body.clinic_ids === "string") {
    clinic_ids = JSON.parse(req.body.clinic_ids);
  } else if (Array.isArray(req.body.clinic_ids)) {
    clinic_ids = req.body.clinic_ids;
  }

  // Final check: ensure it's an array of numbers
  if (!Array.isArray(clinic_ids)) {
    throw new Error("clinic_ids is not an array");
  }

  clinic_ids = clinic_ids
    .map((id) => parseInt(id))
    .filter((id) => !isNaN(id));
} catch (err) {
  return apiResponse(res, {
    error: true,
    code: 400,
    status: 0,
    message: `Invalid clinic_ids array: ${JSON.stringify(
      req.body.clinic_ids
    )}`,
  });
}
    const { id: requesterId, role: requesterRole } = req.user;
    const doctor_id = req.query.doctor_id;

    if (!["admin", "clinic"].includes(requesterRole)) {
      return apiResponse(res, {
        error: true,
        code: 403,
        status: 0,
        message: "Only admin or clinic can add or update doctors",
      });
    }

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      let doctorId = doctor_id;

      if (!doctor_id) {
        // ----- CREATE FLOW -----
        if (!email || !password || !f_name || !l_name) {
          throw new Error(
            "Email, password, first name, and last name are required"
          );
        }
        if (!validator.isEmail(email)) {
          throw new Error("Invalid email format");
        }
        if (phone && !phone_code) {
          throw new Error("Phone code is required when phone is provided");
        }

        const lowerEmail = email.toLowerCase();
        const emailExists = await emailCheck(lowerEmail);
        if (emailExists) throw new Error("Email already exists");

        const emailPrefix = lowerEmail.split("@")[0].replace(/\s+/g, "");
        let user_name;
        let isUnique = false;
        while (!isUnique) {
          const suffix = Math.floor(100 + Math.random() * 900);
          user_name = `${emailPrefix}${suffix}`;
          const usernameTaken = await isUsernameTaken(user_name);
          if (!usernameTaken) isUnique = true;
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const full_name = `${f_name} ${l_name}`.trim();
        const status = requesterRole === "admin" ? "1" : "3";

        const [result] = await connection.query(
          `INSERT INTO users (email, password, f_name, l_name, full_name, user_name, role, phone, phone_code, status, prefix)
         VALUES (?, ?, ?, ?, ?, ?, 'doctor', ?, ?, ?, ?)`,
          [
            lowerEmail,
            hashedPassword,
            f_name,
            l_name,
            full_name,
            user_name,
            phone || null,
            phone_code || null,
            status,
            prefix || "Dr",
          ]
        );

        doctorId = result.insertId;

        // Assign clinics
        if (requesterRole === "clinic") {
          await connection.query(
            `INSERT INTO clinic_doctors (clinic_id, doctor_id, status) VALUES (?, ?, '1')`,
            [requesterId, doctorId]
          );
        } else if (requesterRole === "admin" && clinic_ids.length) {
          for (const clinicId of clinic_ids) {
            const [clinicExists] = await connection.query(
              `SELECT id FROM clinic WHERE id = ? AND status = '1'`,
              [clinicId]
            );
            if (!clinicExists.length)
              throw new Error(`Invalid clinic_id: ${clinicId}`);

            await connection.query(
              `INSERT INTO clinic_doctors (clinic_id, doctor_id, status) VALUES (?, ?, '1')`,
              [clinicId, doctorId]
            );
          }
        }

        await sendWelcomeEmail(lowerEmail, full_name, "doctor");
      } else {
        // ----- UPDATE FLOW -----
        const [[doctor]] = await connection.query(
          `SELECT * FROM users WHERE id = ? AND role = 'doctor'`,
          [doctorId]
        );
        if (!doctor) throw new Error("Doctor not found");

        if (requesterRole === "clinic") {
          const [mapping] = await connection.query(
            `SELECT id FROM clinic_doctors WHERE clinic_id = ? AND doctor_id = ?`,
            [requesterId, doctorId]
          );
          if (!mapping.length) {
            throw new Error("You do not have permission to update this doctor");
          }
        }

        // Handle image
        let profile_image = doctor.profile_image;
        if (req.files?.image) {
          if (profile_image) deleteImage(profile_image);
          profile_image = await uploadImage(req.files.image, "doctors");
        }

        // Validations
        if (phone && !validator.isMobilePhone(phone + "", "any")) {
          throw new Error("Invalid phone");
        }
        if (phone && !phone_code) {
          throw new Error("Phone code is required with phone");
        }
        const validPrefixes = ["Mr", "Mrs", "Ms", "Dr"];
        const validGenders = ["male", "female", "other"];
        const validFeeTypes = ["free", "paid"];
        if (prefix && !validPrefixes.includes(prefix)) {
          throw new Error("Invalid prefix");
        }
        if (gender && !validGenders.includes(gender)) {
          throw new Error("Invalid gender");
        }
        if (
          consultation_fee_type &&
          !validFeeTypes.includes(consultation_fee_type)
        ) {
          throw new Error("Invalid consultation fee type");
        }
        if (
          consultation_fee_type === "paid" &&
          (!consultation_fee || isNaN(consultation_fee) || consultation_fee < 0)
        ) {
          throw new Error("Invalid consultation fee");
        }
        if (DOB && moment(DOB).isAfter(moment())) {
          throw new Error("DOB cannot be in future");
        }

        // Build update
        const fields = [];
        const values = [];

        if (prefix) fields.push("prefix = ?"), values.push(prefix);
        if (f_name) fields.push("f_name = ?"), values.push(f_name.trim());
        if (l_name) fields.push("l_name = ?"), values.push(l_name.trim());
        if (prefix || f_name || l_name) {
          const newF = f_name ?? doctor.f_name;
          const newL = l_name ?? doctor.l_name;
          const newP = prefix ?? doctor.prefix;
          fields.push("full_name = ?"), values.push(`${newP} ${newF} ${newL}`);
        }
        if (phone) fields.push("phone = ?"), values.push(phone.trim());
        if (phone_code)
          fields.push("phone_code = ?"), values.push(phone_code.trim());
        if (DOB) fields.push("DOB = ?"), values.push(DOB);
        if (gender) fields.push("gender = ?"), values.push(gender);
        if (bio !== undefined)
          fields.push("bio = ?"), values.push(bio?.trim() || null);
        if (profile_image)
          fields.push("profile_image = ?"), values.push(profile_image);
        if (address_line1 !== undefined)
          fields.push("address_line1 = ?"),
            values.push(address_line1?.trim() || null);
        if (address_line2 !== undefined)
          fields.push("address_line2 = ?"),
            values.push(address_line2?.trim() || null);
        if (city !== undefined)
          fields.push("city = ?"), values.push(city?.trim() || null);
        if (state !== undefined)
          fields.push("state = ?"), values.push(state?.trim() || null);
        if (country !== undefined)
          fields.push("country = ?"), values.push(country?.trim() || null);
        if (pin_code !== undefined)
          fields.push("pin_code = ?"), values.push(pin_code?.trim() || null);
        if (consultation_fee_type)
          fields.push("consultation_fee_type = ?"),
            values.push(consultation_fee_type);
        if (consultation_fee_type === "paid")
          fields.push("consultation_fee = ?"), values.push(consultation_fee);

        if (fields.length) {
          fields.push("updated_at = NOW()");
          await connection.query(
            `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
            [...values, doctorId]
          );
        }

        // Clinic re-mapping (continued in next part...)
        // --- Clinic assignment (admin only) ---
        if (requesterRole === "admin" && Array.isArray(clinic_ids)) {
          const [existing] = await connection.query(
            `SELECT clinic_id FROM clinic_doctors WHERE doctor_id = ? AND status = '1'`,
            [doctorId]
          );
          const existingIds = existing.map((row) => row.clinic_id);

          // Mark removed as inactive
          for (const oldId of existingIds) {
            if (!clinic_ids.includes(oldId)) {
              await connection.query(
                `UPDATE clinic_doctors SET status = '2' WHERE doctor_id = ? AND clinic_id = ?`,
                [doctorId, oldId]
              );
            }
          }

          // Add or reactivate
          for (const clinicId of clinic_ids) {
            const [clinicExists] = await connection.query(
              `SELECT id FROM clinic WHERE id = ? AND status = '1'`,
              [clinicId]
            );
            if (!clinicExists.length)
              throw new Error(`Invalid clinic_id: ${clinicId}`);

            const [mapping] = await connection.query(
              `SELECT id FROM clinic_doctors WHERE doctor_id = ? AND clinic_id = ?`,
              [doctorId, clinicId]
            );
            if (mapping.length) {
              await connection.query(
                `UPDATE clinic_doctors SET status = '1' WHERE doctor_id = ? AND clinic_id = ?`,
                [doctorId, clinicId]
              );
            } else {
              await connection.query(
                `INSERT INTO clinic_doctors (clinic_id, doctor_id, status) VALUES (?, ?, '1')`,
                [clinicId, doctorId]
              );
            }
          }
        }
      }

      // --- Services ---
      await connection.query(
        `DELETE FROM doctor_services WHERE doctor_id = ?`,
        [doctorId]
      );
      for (let name of services) {
        name = name?.trim()?.toLowerCase();
        if (!name) continue;

        const [existing] = await connection.query(
          `SELECT id FROM services WHERE name = ?`,
          [name]
        );
        const serviceId = existing.length
          ? existing[0].id
          : (
              await connection.query(
                `INSERT INTO services (name, status) VALUES (?, '1')`,
                [name]
              )
            )[0].insertId;

        await connection.query(
          `INSERT INTO doctor_services (doctor_id, services_id, status) VALUES (?, ?, '1')`,
          [doctorId, serviceId]
        );
      }

      // --- Specializations ---
      await connection.query(
        `DELETE FROM doctor_specializations WHERE doctor_id = ?`,
        [doctorId]
      );
      for (const spId of specializations) {
        if (!spId || isNaN(spId)) continue;
        const [exists] = await connection.query(
          `SELECT id FROM specializations WHERE id = ? AND status = '1'`,
          [spId]
        );
        if (exists.length) {
          await connection.query(
            `INSERT INTO doctor_specializations (doctor_id, specialization_id, status) VALUES (?, ?, '1')`,
            [doctorId, spId]
          );
        }
      }

      // --- Educations ---
      await connection.query(`DELETE FROM educations WHERE doctor_id = ?`, [
        doctorId,
      ]);
      for (const edu of educations) {
        const { degree, institution, year_of_passing } = edu;
        if (
          !degree?.trim() ||
          !institution?.trim() ||
          year_of_passing < 1900 ||
          year_of_passing > new Date().getFullYear()
        )
          continue;

        await connection.query(
          `INSERT INTO educations (doctor_id, degree, institution, year_of_passing) VALUES (?, ?, ?, ?)`,
          [doctorId, degree.trim(), institution.trim(), year_of_passing]
        );
      }

      // --- Experiences ---
      await connection.query(`DELETE FROM experiences WHERE doctor_id = ?`, [
        doctorId,
      ]);
      for (const exp of experiences) {
        const {
          hospital,
          start_date,
          end_date,
          currently_working,
          designation,
        } = exp;
        if (!hospital?.trim() || !start_date || !designation?.trim()) continue;

        const isCurrent =
          currently_working === true ||
          currently_working === "true" ||
          currently_working == 1;
        const parsedEnd = isCurrent ? null : end_date;
        if (!isCurrent && parsedEnd && moment(start_date).isAfter(parsedEnd))
          continue;

        await connection.query(
          `INSERT INTO experiences (doctor_id, hospital, start_date, end_date, currently_working, designation)
         VALUES (?, ?, ?, ?, ?, ?)`,
          [
            doctorId,
            hospital.trim(),
            start_date,
            parsedEnd,
            isCurrent ? 1 : 0,
            designation.trim(),
          ]
        );
      }

      // --- Awards ---
      await connection.query(`DELETE FROM awards WHERE doctor_id = ?`, [
        doctorId,
      ]);
      for (const award of awards) {
        const { title, year } = award;
        if (
          !title?.trim() ||
          isNaN(year) ||
          year < 1900 ||
          year > new Date().getFullYear()
        )
          continue;

        await connection.query(
          `INSERT INTO awards (doctor_id, title, year) VALUES (?, ?, ?)`,
          [doctorId, title.trim(), year]
        );
      }

      // --- Memberships ---
      await connection.query(`DELETE FROM memberships WHERE doctor_id = ?`, [
        doctorId,
      ]);
      for (const m of memberships) {
        if (!m.text?.trim()) continue;
        await connection.query(
          `INSERT INTO memberships (doctor_id, text) VALUES (?, ?)`,
          [doctorId, m.text.trim()]
        );
      }

      // --- Registration ---
      await connection.query(
        `DELETE FROM doctor_registration WHERE doctor_id = ?`,
        [doctorId]
      );
      if (registration) {
        const { registration_number, registration_date } = registration;
        if (registration_number?.trim() && registration_date) {
          await connection.query(
            `INSERT INTO doctor_registration (doctor_id, registration_number, registration_date)
           VALUES (?, ?, ?)`,
            [doctorId, registration_number.trim(), registration_date]
          );
        }
      }

      await connection.commit();

      return apiResponse(res, {
        error: false,
        code: doctor_id ? 200 : 201,
        status: 1,
        message: doctor_id
          ? "Doctor profile updated successfully"
          : "Doctor registered successfully",
      });
    } catch (err) {
      await connection.rollback();
      console.error("AddOrUpdateDoctor Error:", err);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: err.message || "Internal server error",
      });
    } finally {
      connection.release();
    }
  },

  // -----------------------------Specialization crud-----------------------------

  // 1. Add or Map Specialization only docotr can add or mapped unique specilization
  addOrMapSpecialization: async (req, res) => {
    let { name, specialization_id } = req.body;
    const doctor_id = req.user.id;
    name = name?.trim();
    name = name?.toLowerCase();

    try {
      let spId;

      if (specialization_id) {
        spId = specialization_id;
      } else {
        const [existing] = await db.query(
          `SELECT id FROM specializations WHERE name = ?`,
          [name]
        );
        if (existing.length > 0) {
          spId = existing[0].id;
        } else {
          const [result] = await db.query(
            `INSERT INTO specializations (name) VALUES (?)`,
            [name]
          );
          spId = result.insertId;
        }
      }

      // Check mapping
      const [mapped] = await db.query(
        `SELECT id, status FROM doctor_specializations WHERE doctor_id = ? AND specialization_id = ?`,
        [doctor_id, spId]
      );

      if (mapped.length === 0) {
        await db.query(
          `INSERT INTO doctor_specializations (doctor_id, specialization_id, status) VALUES (?, ?, '1')`,
          [doctor_id, spId]
        );
      } else if (mapped[0].status === 0) {
        await db.query(
          `UPDATE doctor_specializations SET status = '1', updated_at = NOW() WHERE id = ?`,
          [mapped[0].id]
        );
      } else {
        return apiResponse(res, {
          error: true,
          code: 409,
          status: 0,
          message: "Specialization already added",
        });
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Specialization added successfully",
      });
    } catch (error) {
      console.error("Error adding/mapping specialization:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to map specialization",
      });
    }
  },

  // 2. Search Specializations
  searchSpecializations: async (req, res) => {
    let { search = "" } = req.query;
    search = search?.trim();
    search = search?.toLowerCase();

    try {
      const [results] = await db.query(
        `SELECT id, name FROM specializations WHERE name LIKE ? AND status = '1' ORDER BY name ASC`,
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

  // 3. Get Doctor's Specializations
  getDoctorSpecializations: async (req, res) => {
    const doctor_id = req.user.id;

    try {
      const [results] = await db.query(
        `SELECT ds.id, s.name, ds.specialization_id, ds.status, ds.created_at, ds.updated_at
         FROM doctor_specializations ds
         JOIN specializations s ON ds.specialization_id = s.id
         WHERE ds.doctor_id = ? AND ds.status = '1' AND s.status = '1'`,
        [doctor_id]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: results,
      });
    } catch (error) {
      console.error("Error fetching doctor's specializations:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch specializations",
      });
    }
  },

  // 4. Remove Mapping (Hard Delete)
  removeSpecializationFromDoctor: async (req, res) => {
    const doctor_id = req.user.id;
    // map_id is the ID of the mapping in doctor_specializations
    const { map_id } = req.params;

    try {
      // Check if the mapping exists
      const [checkMapping] = await db.query(
        `SELECT id FROM doctor_specializations WHERE id = ? AND doctor_id = ?`,
        [map_id, doctor_id]
      );
      if (checkMapping.length === 0) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Specialization mapping not found",
        });
      }
      const [result] = await db.query(
        `DELETE FROM doctor_specializations WHERE id = ? AND doctor_id = ?`,
        [map_id, doctor_id]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Specialization mapping deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting specialization mapping:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to delete specialization mapping",
      });
    }
  },

  // -----------------------------services crud-----------------------------

  addOrMapService: async (req, res) => {
    let { name, services_id } = req.body;
    const doctor_id = req.user.id;
    name = name?.trim()?.toLowerCase();

    try {
      let srvId;

      if (services_id) {
        srvId = services_id;
      } else {
        const [existing] = await db.query(
          `SELECT id FROM services WHERE name = ?`,
          [name]
        );
        if (existing.length > 0) {
          srvId = existing[0].id;
        } else {
          const [result] = await db.query(
            `INSERT INTO services (name) VALUES (?)`,
            [name]
          );
          srvId = result.insertId;
        }
      }

      const [mapped] = await db.query(
        `SELECT id, status FROM doctor_services WHERE doctor_id = ? AND services_id = ?`,
        [doctor_id, srvId]
      );

      if (mapped.length === 0) {
        await db.query(
          `INSERT INTO doctor_services (doctor_id, services_id, status) VALUES (?, ?, '1')`,
          [doctor_id, srvId]
        );
      } else if (mapped[0].status === "2") {
        await db.query(
          `UPDATE doctor_services SET status = '1', updated_at = NOW() WHERE id = ?`,
          [mapped[0].id]
        );
      } else {
        return apiResponse(res, {
          error: true,
          code: 409,
          status: 0,
          message: "Service already added",
        });
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Service added successfully",
      });
    } catch (error) {
      console.error("Error adding/mapping service:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to map service",
      });
    }
  },

  searchServices: async (req, res) => {
    let { search = "" } = req.query;
    search = search?.trim()?.toLowerCase();

    try {
      const [results] = await db.query(
        `SELECT id, name FROM services WHERE name LIKE ? AND status = '1' ORDER BY name ASC`,
        [`%${search}%`]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: results,
      });
    } catch (error) {
      console.error("Error searching services:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch services",
      });
    }
  },

  getDoctorServices: async (req, res) => {
    const doctor_id = req.user.id;

    try {
      const [results] = await db.query(
        `SELECT ds.id, s.name, ds.services_id, ds.status, ds.created_at, ds.updated_at
       FROM doctor_services ds
       JOIN services s ON ds.services_id = s.id
       WHERE ds.doctor_id = ? AND ds.status = '1' AND s.status = '1'`,
        [doctor_id]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: results,
      });
    } catch (error) {
      console.error("Error fetching doctor's services:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch services",
      });
    }
  },

  removeServiceFromDoctor: async (req, res) => {
    const doctor_id = req.user.id;
    const { map_id } = req.params;

    try {
      const [checkMapping] = await db.query(
        `SELECT id FROM doctor_services WHERE id = ? AND doctor_id = ?`,
        [map_id, doctor_id]
      );

      if (checkMapping.length === 0) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Service mapping not found",
        });
      }

      await db.query(
        `DELETE FROM doctor_services WHERE id = ? AND doctor_id = ?`,
        [map_id, doctor_id]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Service mapping deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting service mapping:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to delete service mapping",
      });
    }
  },

  //-------------------------------Education crud-------------------------------

  //Add single or multiple educations
  addEducations: async (req, res) => {
    const doctor_id = req.user.id;
    let { educations } = req.body;
    console.log("Received educations:", educations);
    try {
      if (!educations) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Education data is required",
        });
      }

      // Convert to array if only single object is passed
      if (!Array.isArray(educations)) {
        educations = [educations];
      }

      for (const edu of educations) {
        let { degree, institution, year_of_passing } = edu;
        degree = degree?.trim();
        institution = institution?.trim();
        year_of_passing = year_of_passing ? parseInt(year_of_passing) : null;

        if (!degree || !institution || !year_of_passing) continue;

        await db.query(
          `INSERT INTO educations (doctor_id, degree, institution, year_of_passing) VALUES (?, ?, ?, ?)`,
          [doctor_id, degree.trim(), institution.trim(), year_of_passing]
        );
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Education(s) added successfully",
      });
    } catch (error) {
      console.error("Error adding educations:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to add educations",
      });
    }
  },

  updateEducation: async (req, res) => {
    const doctor_id = req.user.id;
    const { id } = req.params;
    const { degree, institution, year_of_passing } = req.body;

    try {
      const [existing] = await db.query(
        `SELECT id FROM educations WHERE id = ? AND doctor_id = ?`,
        [id, doctor_id]
      );
      if (existing.length === 0) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Education record not found",
        });
      }

      await db.query(
        `UPDATE educations SET degree = ?, institution = ?, year_of_passing = ?, updated_at = NOW() WHERE id = ? AND doctor_id = ?`,
        [degree?.trim(), institution?.trim(), year_of_passing, id, doctor_id]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Education updated successfully",
      });
    } catch (error) {
      console.error("Error updating education:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to update education",
      });
    }
  },

  deleteEducation: async (req, res) => {
    const doctor_id = req.user.id;
    const { id } = req.params;

    try {
      const [existing] = await db.query(
        `SELECT id FROM educations WHERE id = ? AND doctor_id = ?`,
        [id, doctor_id]
      );
      if (existing.length === 0) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Education record not found",
        });
      }

      await db.query(`DELETE FROM educations WHERE id = ? AND doctor_id = ?`, [
        id,
        doctor_id,
      ]);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Education deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting education:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to delete education",
      });
    }
  },

  getEducations: async (req, res) => {
    const doctor_id = req.user.id;

    try {
      const [results] = await db.query(
        `SELECT id, degree, institution, year_of_passing, created_at, updated_at FROM educations WHERE doctor_id = ? ORDER BY year_of_passing DESC`,
        [doctor_id]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: results,
      });
    } catch (error) {
      console.error("Error fetching educations:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch educations",
      });
    }
  },

  //-------------------------------Experience crud-------------------------------
  addExperiences: async (req, res) => {
    const doctor_id = req.user.id;
    let { experiences } = req.body;

    try {
      if (!experiences) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Experience data is required",
        });
      }

      if (!Array.isArray(experiences)) {
        experiences = [experiences];
      }

      for (const exp of experiences) {
        const {
          hospital,
          start_date,
          end_date,
          currently_working,
          designation,
        } = exp;

        if (!hospital || !start_date || !designation) continue;

        const isCurrentlyWorking =
          !!currently_working || currently_working === "true";
        const parsedEndDate = isCurrentlyWorking ? null : end_date || null;

        await db.query(
          `INSERT INTO experiences (
          doctor_id, hospital, start_date, end_date, currently_working, designation
        ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            doctor_id,
            hospital.trim(),
            start_date,
            parsedEndDate,
            isCurrentlyWorking ? 1 : 0,
            designation.trim(),
          ]
        );
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Experience(s) added successfully",
      });
    } catch (error) {
      console.error("Error adding experiences:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to add experiences",
      });
    }
  },

  updateExperience: async (req, res) => {
    const doctor_id = req.user.id;
    const { id } = req.params;
    const { hospital, start_date, end_date, currently_working, designation } =
      req.body;

    try {
      const [existing] = await db.query(
        `SELECT id FROM experiences WHERE id = ? AND doctor_id = ?`,
        [id, doctor_id]
      );

      if (existing.length === 0) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Experience record not found",
        });
      }

      // Convert and validate values
      const isCurrentlyWorking =
        currently_working === true ||
        currently_working === "true" ||
        currently_working === 1 ||
        currently_working === "1";

      const parsedEndDate = isCurrentlyWorking ? null : end_date || null;

      await db.query(
        `UPDATE experiences
       SET hospital = ?, start_date = ?, end_date = ?, currently_working = ?, designation = ?, updated_at = NOW()
       WHERE id = ? AND doctor_id = ?`,
        [
          hospital?.trim(),
          start_date,
          parsedEndDate,
          isCurrentlyWorking ? 1 : 0,
          designation?.trim(),
          id,
          doctor_id,
        ]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Experience updated successfully",
      });
    } catch (error) {
      console.error("Error updating experience:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to update experience",
      });
    }
  },

  deleteExperience: async (req, res) => {
    const doctor_id = req.user.id;
    const { id } = req.params;

    try {
      const [existing] = await db.query(
        `SELECT id FROM experiences WHERE id = ? AND doctor_id = ?`,
        [id, doctor_id]
      );
      if (existing.length === 0) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "Experience record not found",
        });
      }

      await db.query(`DELETE FROM experiences WHERE id = ? AND doctor_id = ?`, [
        id,
        doctor_id,
      ]);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Experience deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting experience:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to delete experience",
      });
    }
  },

  getExperiences: async (req, res) => {
    const doctor_id = req.user.id;

    try {
      const [results] = await db.query(
        `SELECT id, hospital, start_date, end_date, currently_working, designation, created_at, updated_at
       FROM experiences
       WHERE doctor_id = ?
       ORDER BY start_date DESC`,
        [doctor_id]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: results,
      });
    } catch (error) {
      console.error("Error fetching experiences:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to fetch experiences",
      });
    }
  },

  // -------------------------------awards crud-------------------------------
  addAwards: async (req, res) => {
    const doctor_id = req.user.id;
    let { awards } = req.body;

    try {
      if (!awards)
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Awards required",
        });
      if (!Array.isArray(awards)) awards = [awards];

      for (const award of awards) {
        const { title, year } = award;
        if (
          !title ||
          !year ||
          isNaN(year) ||
          year < 1900 ||
          year > new Date().getFullYear()
        )
          continue;
        await db.query(
          `INSERT INTO awards (doctor_id, title, year) VALUES (?, ?, ?)`,
          [doctor_id, title.trim(), year]
        );
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Awards added successfully",
      });
    } catch (error) {
      console.error("Error adding awards:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to add awards",
      });
    }
  },

  getAwards: async (req, res) => {
    try {
      const [results] = await db.query(
        `SELECT * FROM awards WHERE doctor_id = ? ORDER BY year DESC`,
        [req.user.id]
      );
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: results,
      });
    } catch (error) {
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to get awards",
      });
    }
  },

  deleteAward: async (req, res) => {
    try {
      await db.query(`DELETE FROM awards WHERE id = ? AND doctor_id = ?`, [
        req.params.id,
        req.user.id,
      ]);
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Award deleted",
      });
    } catch (error) {
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to delete award",
      });
    }
  },

  //------------------------------membership crud----------------------------
  addMemberships: async (req, res) => {
    const doctor_id = req.user.id;
    let { memberships } = req.body;

    try {
      if (!memberships)
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Memberships required",
        });
      if (!Array.isArray(memberships)) memberships = [memberships];

      for (const m of memberships) {
        if (!m.text) continue;
        await db.query(
          `INSERT INTO memberships (doctor_id, text) VALUES (?, ?)`,
          [doctor_id, m.text.trim()]
        );
      }

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Memberships added successfully",
      });
    } catch (error) {
      console.error("Error adding memberships:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to add memberships",
      });
    }
  },

  getMemberships: async (req, res) => {
    try {
      const [results] = await db.query(
        `SELECT * FROM memberships WHERE doctor_id = ?`,
        [req.user.id]
      );
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: results,
      });
    } catch (error) {
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to get memberships",
      });
    }
  },

  deleteMembership: async (req, res) => {
    try {
      await db.query(`DELETE FROM memberships WHERE id = ? AND doctor_id = ?`, [
        req.params.id,
        req.user.id,
      ]);
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Membership deleted",
      });
    } catch (error) {
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to delete membership",
      });
    }
  },

  //----------------------------registration----------------------------------
  addDoctorRegistration: async (req, res) => {
    const doctor_id = req.user.id;
    const { registration_number, registration_date } = req.body;

    if (!registration_number || !registration_date) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Registration number and date are required",
      });
    }

    try {
      const [existing] = await db.query(
        `SELECT id FROM doctor_registration WHERE doctor_id = ?`,
        [doctor_id]
      );
      if (existing.length > 0) {
        return apiResponse(res, {
          error: true,
          code: 409,
          status: 0,
          message: "Registration already exists",
        });
      }

      await db.query(
        `INSERT INTO doctor_registration (doctor_id, registration_number, registration_date) VALUES (?, ?, ?)`,
        [doctor_id, registration_number.trim(), registration_date]
      );

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Doctor registration added",
      });
    } catch (error) {
      console.error("Error adding doctor registration:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to add registration",
      });
    }
  },

  getDoctorRegistration: async (req, res) => {
    try {
      const [result] = await db.query(
        `SELECT * FROM doctor_registration WHERE doctor_id = ?`,
        [req.user.id]
      );
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        payload: result[0] || null,
      });
    } catch (error) {
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to get registration",
      });
    }
  },

  deleteDoctorRegistration: async (req, res) => {
    try {
      const id = req.params.id;
      await db.query(
        `DELETE FROM doctor_registration WHERE doctor_id = ? And id = ?`,
        [req.user.id, id]
      );
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Registration deleted",
      });
    } catch (error) {
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Failed to delete registration",
      });
    }
  },
};

export default doctorController;
