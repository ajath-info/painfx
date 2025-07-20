// authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import moment from "moment";
import { db } from "../config/db.js";
import { apiResponse, emailCheck, isUsernameTaken } from "../utils/helper.js";
import * as DOTENV from "../utils/dotEnv.js";
import { uploadImage, deleteImage } from "../utils/fileHelper.js";
import {
  sendLoginNotificationEmail,
  sendWelcomeEmail,
} from "../middleware/emailMiddleware.js";

export const authController = {
  // login user(doctor/patient), admin, clinic
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Email and password are required",
      });
    }

    const lowerEmail = email.toLowerCase();
    let user = null;
    let source = "";

    // Try admin
    const [adminResult] = await db.query(
      "SELECT *, 'admin' AS role FROM admin WHERE email = ?",
      [lowerEmail]
    );
    if (adminResult.length) {
      user = adminResult[0];
      source = "admin";
    }

    // Try user (doctor/patient)
    if (!user) {
      const [userResult] = await db.query(
        "SELECT *, role AS role FROM users WHERE email = ?",
        [lowerEmail]
      );
      if (userResult.length) {
        user = userResult[0];
        source = "user";
      }
    }

    // Try clinic
    if (!user) {
      const [clinicResult] = await db.query(
        "SELECT *, 'clinic' AS role FROM clinic WHERE email = ?",
        [lowerEmail]
      );
      if (clinicResult.length) {
        user = clinicResult[0];
        source = "clinic";
      }
    }

    if (!user) {
      return apiResponse(res, {
        error: true,
        code: 401,
        status: 0,
        message: "Invalid credentials",
      });
    }

    // Inactive check
    if (
      ["doctor", "patient", "clinic", "staff"].includes(user.role) &&
      user.status === "2"
    ) {
      return apiResponse(res, {
        error: true,
        code: 403,
        status: 0,
        message: "Your account is inactive. Please contact the administrator.",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return apiResponse(res, {
        error: true,
        code: 401,
        status: 0,
        message: "Invalid credentials",
      });
    }

    const lastLogin = new Date();
    const lastIp = req.ip;

    if (source === "admin") {
      await db.query(
        "UPDATE admin SET last_login = ?, last_ip = ? WHERE id = ?",
        [lastLogin, lastIp, user.id]
      );
    } else if (source === "user") {
      await db.query(
        "UPDATE users SET last_login = ?, last_ip = ? WHERE id = ?",
        [lastLogin, lastIp, user.id]
      );
    } else if (source === "clinic") {
      await db.query("UPDATE clinic SET updated_at = ? WHERE id = ?", [
        lastLogin,
        user.id,
      ]);
    }

    const tokenPayload = {
      id: user.id,
      full_name:
        user.full_name ||
        user.name ||
        `${user.f_name || ""} ${user.l_name || ""}`.trim(),
      email: user.email,
      role: user.role,
      source,
    };

    // Only attach profile_image for admin and user
    if (source === "admin" || source === "user") {
      tokenPayload.profile_image = user.profile_image || null;
    }

    const token = jwt.sign(tokenPayload, DOTENV.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    return apiResponse(res, {
      error: false,
      code: 200,
      status: 1,
      message: "Login successful",
      payload: {
        token,
        user: tokenPayload,
      },
    });
  },

  // register or add clinic by admin only
  registerClinic: async (req, res) => {
    const {
      email,
      password,
      name,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pin_code,
      lat,
      lng,
    } = req.body;
    const adminId = req.user.id;

    if (
      !email ||
      !password ||
      !name ||
      !address_line1 ||
      !city ||
      !state ||
      !country ||
      !pin_code
    ) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Required fields are missing",
      });
    }

    if (!validator.isEmail(email)) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Invalid email format",
      });
    }

    const lowerEmail = email.toLowerCase();

    const emailExists = await emailCheck(lowerEmail);
    if (emailExists) {
      return apiResponse(res, {
        error: true,
        code: 409,
        status: 0,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const uploadedGallery = [];

    if (req.files && req.files.gallery) {
      const galleryFiles = Array.isArray(req.files.gallery)
        ? req.files.gallery
        : [req.files.gallery];

      for (const file of galleryFiles) {
        const uploadedPath = await uploadImage(file, "clinic_gallery");
        uploadedGallery.push(uploadedPath);
      }
    }

    const galleryJSON = JSON.stringify(uploadedGallery);

    const [result] = await db.query(
      `INSERT INTO clinic 
        (email, password, name, address_line1, address_line2, city, state, country, pin_code, lat, lng, gallery, created_by_role, created_by_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lowerEmail,
        hashedPassword,
        name,
        address_line1,
        address_line2 || null,
        city,
        state,
        country,
        pin_code,
        lat || null,
        lng || null,
        galleryJSON,
        "admin",
        adminId,
      ]
    );

    const tokenPayload = {
      id: result.insertId,
      full_name: name,
      email: lowerEmail,
      role: "clinic",
    };

    const token = jwt.sign(tokenPayload, DOTENV.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    return apiResponse(res, {
      error: false,
      code: 201,
      status: 1,
      message: "Clinic registered successfully",
      payload: {
        token,
        user: tokenPayload,
      },
    });
  },

  // register doctor by admin or clinic
  registerDoctor: async (req, res) => {
    const {
      email,
      password,
      f_name,
      l_name,
      phone,
      phone_code,
      clinic_ids = [], // Optional for admin
    } = req.body;
    const { id: requesterId, role: requesterRole } = req.user;

    if (!["admin", "clinic"].includes(requesterRole)) {
      return apiResponse(res, {
        error: true,
        code: 403,
        status: 0,
        message: "Only admin or clinic can register a doctor",
      });
    }

    if (!email || !password || !f_name || !l_name) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Email, password, first name, and last name are required",
      });
    }

    if (!validator.isEmail(email)) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Invalid email format",
      });
    }

    if (phone && !phone_code) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Phone code is required when phone is provided",
      });
    }

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const lowerEmail = email.toLowerCase();
      const full_name = `${f_name} ${l_name}`.trim();

      const emailExists = await emailCheck(lowerEmail);
      if (emailExists) {
        await connection.rollback();
        return apiResponse(res, {
          error: true,
          code: 409,
          status: 0,
          message: "Email already exists",
        });
      }

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
      const status = requesterRole === "admin" ? "1" : "3"; // Active for admin, pending for clinic
      const prefix = "Dr";

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
          prefix,
        ]
      );

      const doctorId = result.insertId;

      if (requesterRole === "clinic") {
        await connection.query(
          `INSERT INTO clinic_doctors (clinic_id, doctor_id, status) VALUES (?, ?, '1')`,
          [requesterId, doctorId]
        );
      } else if (requesterRole === "admin" && clinic_ids.length > 0) {
        for (const clinicId of clinic_ids) {
          const [clinicExists] = await connection.query(
            `SELECT id FROM clinic WHERE id = ? AND status = '1'`,
            [clinicId]
          );
          if (!clinicExists.length) {
            await connection.rollback();
            return apiResponse(res, {
              error: true,
              code: 400,
              status: 0,
              message: `Invalid clinic_id: ${clinicId}`,
            });
          }
          await connection.query(
            `INSERT INTO clinic_doctors (clinic_id, doctor_id, status) VALUES (?, ?, '1')`,
            [clinicId, doctorId]
          );
        }
      }

      await connection.commit();

      const tokenPayload = {
        id: doctorId,
        full_name,
        user_name,
        email: lowerEmail,
        role: "doctor",
      };

      const token = jwt.sign(tokenPayload, DOTENV.JWT_SECRET_KEY, {
        expiresIn: "7d",
      });

      await sendWelcomeEmail(lowerEmail, full_name, "doctor");

      return apiResponse(res, {
        error: false,
        code: 201,
        status: 1,
        message: "Doctor registered successfully",
        payload: {
          token,
          user: tokenPayload,
        },
      });
    } catch (error) {
      await connection.rollback();
      console.error("Doctor registration error:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    } finally {
      connection.release();
    }
  },

  // change password of clinic, user(doctor/patient)and admin
  changePassword: async (req, res) => {
    const { old_password, new_password } = req.body;
    const { id, role } = req.user;

    if (!old_password || !new_password) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Old and new passwords are required",
      });
    }

    const table =
      role === "admin" ? "admin" : role === "clinic" ? "clinic" : "users";

    const [result] = await db.query(
      `SELECT password FROM ${table} WHERE id = ?`,
      [id]
    );

    if (!result.length) {
      return apiResponse(res, {
        error: true,
        code: 404,
        status: 0,
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(old_password, result[0].password);
    if (!match) {
      return apiResponse(res, {
        error: true,
        code: 401,
        status: 0,
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 12);

    await db.query(`UPDATE ${table} SET password = ? WHERE id = ?`, [
      hashedPassword,
      id,
    ]);

    return apiResponse(res, {
      error: false,
      code: 200,
      status: 1,
      message: "Password updated successfully",
    });
  },

  // Register user (doctor/patient)
  register: async (req, res) => {
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();
    const f_name = req.body.f_name?.trim();
    const l_name = req.body.l_name?.trim();
    const role = req.body.role?.trim();
    const phone = req.body.phone?.trim();
    const phone_code = req.body.phone_code?.trim();

    if (!email || !password || !f_name || !l_name || !role) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message:
          "Email, password, first name, last name, and role are required",
      });
    }

    if (!validator.isEmail(email)) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Invalid email format",
      });
    }

    if (phone && !phone_code) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Phone code is required when phone is provided",
      });
    }

    if (role !== "doctor" && role !== "patient") {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Role must be either 'doctor' or 'patient'",
      });
    }

    try {
      const lowerEmail = email.toLowerCase();
      const full_name = `${f_name} ${l_name}`.trim();

      const existingUser = await emailCheck(lowerEmail);
      if (existingUser) {
        return apiResponse(res, {
          error: true,
          code: 409,
          status: 0,
          message: "Email already exists",
        });
      }

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
      const status = role === "doctor" ? 3 : 1;
      const prefix = role === "doctor" ? "Dr" : "Mr";

      const [result] = await db.query(
        `INSERT INTO users (email, password, f_name, l_name, full_name, user_name, role, phone, phone_code, status, prefix) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          lowerEmail,
          hashedPassword,
          f_name,
          l_name,
          full_name,
          user_name,
          role,
          phone || null,
          phone_code || null,
          status,
          prefix,
        ]
      );

      const tokenPayload = {
        id: result.insertId,
        full_name,
        user_name,
        email: lowerEmail,
        role,
      };

      const token = jwt.sign(tokenPayload, DOTENV.JWT_SECRET_KEY, {
        expiresIn: "7d",
      });

      // send welcome mail
      await sendWelcomeEmail(email, tokenPayload.full_name, tokenPayload.role);

      return apiResponse(res, {
        error: false,
        code: 201,
        status: 1,
        message: "Registration successful",
        payload: {
          token,
          user: tokenPayload,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },

  // Admin registration handled by admin
  adminRegister: async (req, res) => {
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();
    const f_name = req.body.f_name?.trim();
    const l_name = req.body.l_name?.trim();
    const phone = req.body.phone?.trim();
    const phone_code = req.body.phone_code?.trim();
    const role = "admin";

    if (!email || !password || !f_name || !l_name) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Email, password, first name, and last name are required",
      });
    }

    if (!validator.isEmail(email)) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Invalid email format",
      });
    }

    if (phone && !phone_code) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Phone code is required when phone number is provided",
      });
    }

    try {
      const lowerEmail = email.toLowerCase();
      const full_name = `${f_name} ${l_name}`.trim();

      const emailExists = await emailCheck(lowerEmail);
      if (emailExists) {
        return apiResponse(res, {
          error: true,
          code: 409,
          status: 0,
          message: "Email already exists",
        });
      }

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

      const [result] = await db.query(
        `INSERT INTO admin (email, password, f_name, l_name, full_name, user_name, phone, phone_code, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          lowerEmail,
          hashedPassword,
          f_name,
          l_name,
          full_name,
          user_name,
          phone || null,
          phone_code || null,
          role,
        ]
      );

      const tokenPayload = {
        id: result.insertId,
        full_name,
        user_name,
        role,
        email: lowerEmail,
      };

      const token = jwt.sign(tokenPayload, DOTENV.JWT_SECRET_KEY, {
        expiresIn: "7d",
      });

      return apiResponse(res, {
        error: false,
        code: 201,
        status: 1,
        message: "Admin registration successful",
        payload: {
          token,
          user: tokenPayload,
        },
      });
    } catch (error) {
      console.error("Admin registration error:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },

  // Check if email exists in admin or users (doctor/patient)
  checkEmailExists: async (req, res) => {
    try {
      const { email } = req.body;

      // 1. Validate
      if (!email || !validator.isEmail(email.trim())) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Invalid or missing email",
        });
      }

      const lowerEmail = email.trim().toLowerCase();

      // 2. Check existence
      const exists = await emailCheck(lowerEmail);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: exists ? "Email already exists" : "Email available",
        payload: {
          exists,
        },
      });
    } catch (error) {
      console.error("Email check error:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },

  // forgot password function for both admin and user (doctor/patient)
  forgotPassword: async (req, res) => {
    try {
      let { email, otp, newPassword } = req.body;
      if (!email || !otp || !newPassword) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Email, OTP, and new password are required",
        });
      }

      email = email.toLowerCase();

      // 1. Verify OTP
      const [otpRows] = await db.query(
        `SELECT * FROM otp WHERE email = ? AND otp_code = ? ORDER BY created_at DESC LIMIT 1`,
        [email, otp]
      );
      const otpRecord = otpRows[0];
      if (!otpRecord) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Invalid OTP",
        });
      }
      if (moment().isAfter(moment(otpRecord.expires_at))) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "OTP expired",
        });
      }

      // 2. Check if user exists in admin table
      const [adminRows] = await db.query(
        `SELECT id FROM admin WHERE email = ?`,
        [email]
      );

      // 3. Check if user exists in users table if not admin
      let userId = null,
        userType = null;
      if (adminRows.length > 0) {
        userId = adminRows[0].id;
        userType = "admin";
      } else {
        const [userRows] = await db.query(
          `SELECT id FROM users WHERE email = ?`,
          [email]
        );
        if (userRows.length === 0) {
          return apiResponse(res, {
            error: true,
            code: 404,
            status: 0,
            message: "User not found",
          });
        }
        userId = userRows[0].id;
        userType = "user";
      }

      // 4. Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // 5. Update password accordingly
      if (userType === "admin") {
        await db.query(`UPDATE admin SET password = ? WHERE id = ?`, [
          hashedPassword,
          userId,
        ]);
      } else {
        await db.query(`UPDATE users SET password = ? WHERE id = ?`, [
          hashedPassword,
          userId,
        ]);
      }

      // 6. Delete OTP after successful reset
      await db.query(`DELETE FROM otp WHERE id = ?`, [otpRecord.id]);

      // 7. Respond success
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Password reset successful",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },

  // Logout function for both admin and user (doctor/patient)
  logout: async (req, res) => {
    try {
      res.clearCookie("token");
      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Logout successful",
      });
    } catch (error) {
      console.error("Logout error:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
  },
};
