// authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import moment from "moment";
import { db } from "../config/db.js";
import { apiResponse, emailCheck, isUsernameTaken } from "../utils/helper.js";
import * as DOTENV from "../utils/dotEnv.js";

export const authController = {
  // Login function for both admin and user (doctor/patient)
  login: async (req, res) => {
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    if (!email || !password) {
      return apiResponse(res, {
        error: true,
        code: 400,
        status: 0,
        message: "Email and password are required",
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

    try {
      const lowerEmail = email.toLowerCase();
      let user = null;
      let source = "";

      const [adminResult] = await db.query(
        "SELECT * FROM admin WHERE email = ?",
        [lowerEmail]
      );
      if (adminResult.length) {
        user = adminResult[0];
        source = "admin";
      } else {
        const [userResult] = await db.query(
          "SELECT * FROM users WHERE email = ?",
          [lowerEmail]
        );
        if (userResult.length) {
          user = userResult[0];
          source = "user";
        }
      }

      if (!user) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "User not found",
        });
      }

      if (user.status === 2) {
        return apiResponse(res, {
          error: true,
          code: 403,
          status: 0,
          message: "Your account is deactivated. Please contact support.",
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return apiResponse(res, {
          error: true,
          code: 401,
          status: 0,
          message: "Incorrect password",
        });
      }

      // Get current login details
      const lastLogin = new Date();
      console.log(lastLogin)
      const lastIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      // Update last login info in DB
      if (source === "admin") {
        await db.query(
          `UPDATE admin SET last_login = ?, last_ip = ? WHERE id = ?`,
          [lastLogin, lastIp, user.id]
        );
      } else {
        await db.query(
          `UPDATE users SET last_login = ?, last_ip = ? WHERE id = ?`,
          [lastLogin, lastIp, user.id]
        );
      }

      const tokenPayload = {
        id: user.id,
        full_name: user.full_name || `${user.f_name} ${user.l_name}`.trim(),
        user_name: user.user_name || null,
        role: user.role,
        profile_image: user.profile_image || null,
        source,
      };

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
    } catch (error) {
      console.error("Login error:", error);
      return apiResponse(res, {
        error: true,
        code: 500,
        status: 0,
        message: "Internal server error",
      });
    }
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

      const [result] = await db.query(
        `INSERT INTO users (email, password, f_name, l_name, full_name, user_name, role, phone, phone_code, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

  // Change password for both admin and users (doctor/patient)
  changePassword: async (req, res) => {
    try {
      const { id, role } = req.user; // source will be either 'admin' or 'user'
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "Old password and new password are required",
        });
      }

      if (newPassword.length < 6) {
        return apiResponse(res, {
          error: true,
          code: 400,
          status: 0,
          message: "New password must be at least 6 characters long",
        });
      }

      // Determine table name
      const table = role === "admin" ? "admin" : "users";

      // Fetch user details
      const [result] = await db.query(`SELECT * FROM ${table} WHERE id = ?`, [
        id,
      ]);
      if (!result.length) {
        return apiResponse(res, {
          error: true,
          code: 404,
          status: 0,
          message: "User not found",
        });
      }

      const user = result[0];

      // Check old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return apiResponse(res, {
          error: true,
          code: 401,
          status: 0,
          message: "Old password is incorrect",
        });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await db.query(`UPDATE ${table} SET password = ? WHERE id = ?`, [
        hashedNewPassword,
        id,
      ]);

      return apiResponse(res, {
        error: false,
        code: 200,
        status: 1,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
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
