import { db } from "../config/db.js";

// api response helper function
// This function standardizes the API response format for all endpoints
export const apiResponse = (res, { error = false, code = 200, status = 1, message, payload = {} } = {}) => {
  const resposneBody = { error, code, status, message, payload };
  return res.status(code).json(resposneBody);
};

// Generate a random 4-digit OTP (One-Time Password)
// This function can be used for user verification, password reset, etc.
export const generateOTP = () => {
  // Generate a random 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp;
};

/**
 * Checks if email exists in admin, users (doctor/patient), or franchisee based on type
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} - Returns true if email exists, otherwise false
 */
export const emailCheck = async (email) => {
  try {
    const lowerEmail = email.toLowerCase();

    // Check admin
    const [admin] = await db.query("SELECT id FROM admin WHERE email = ?", [lowerEmail]);
    if (admin.length) return true;

    // Check users (doctors or patients)
    const [users] = await db.query("SELECT id FROM users WHERE email = ?", [lowerEmail]);
    if (users.length) return true;

    // No match found
    return false;
  } catch (error) {
    console.error("Error in emailCheck:", error);
    return false;
  }
};

/**
 * Checks if username exists in admin or users table
 * @param {string} userName - Username to check
 * @returns {Promise<boolean>} - true if taken, false otherwise
 */
export const isUsernameTaken = async (userName) => {
  try {
    // Check in users table
    const [user] = await db.query("SELECT id FROM users WHERE user_name = ?", [userName]);
    if (user.length) return true;

    // Check in admin table
    const [admin] = await db.query("SELECT id FROM admin WHERE user_name = ?", [userName]);
    if (admin.length) return true;

    return false;
  } catch (error) {
    console.error("Error in isUsernameTaken:", error);
    return true; // assume taken to prevent conflict on error
  }
};
