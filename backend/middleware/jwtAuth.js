import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { apiResponse } from "../utils/helper.js";
import * as DOTENV from "../utils/dotEnv.js";

/**
 * Middleware: Authenticate user and attach user object to req.user
 * Works for admin, doctor, patient, super admin, clinic, staff
 */
export const isAuthenticated = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return apiResponse(res, {
        error: true,
        code: 401,
        status: 0,
        message: "Token missing or malformed",
        payload: {},
      });
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, DOTENV.JWT_SECRET_KEY);

    if (!decoded.id || !decoded.role) {
      return apiResponse(res, {
        error: true,
        code: 401,
        status: 0,
        message: "Invalid token payload",
        payload: {},
      });
    }

    let user = null;

    if (decoded.role === "admin" || decoded.role === "superadmin") {
      [user] = await db.query("SELECT * FROM admin WHERE id = ?", [decoded.id]);
    } else if (decoded.role === "clinic" || decoded.role === "staff") {
      [user] = await db.query("SELECT * FROM clinic WHERE id = ?", [
        decoded.id,
      ]);
    } else {
      [user] = await db.query("SELECT * FROM users WHERE id = ?", [decoded.id]);
    }

    if (!user || user.length === 0) {
      return apiResponse(res, {
        error: true,
        code: 401,
        status: 0,
        message: "User not found",
        payload: {},
      });
    }

    req.user = user[0];
    next();
  } catch (err) {
    return apiResponse(res, {
      error: true,
      code: 500,
      status: 0,
      message: err.message || "Authentication failed",
      payload: {},
    });
  }
};

/**
 * Optional authentication middleware
 * - Decodes token if present and attaches user to req.user
 * - Supports roles: admin, superadmin, clinic, staff, doctor, patient
 * - If no or invalid token, sets req.user = null and continues
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // If no token, allow anonymous access
    if (!authorization || !authorization.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, DOTENV.JWT_SECRET_KEY);

    if (!decoded.id || !decoded.role) {
      req.user = null;
      return next();
    }

    let user = null;

    if (decoded.role === "admin" || decoded.role === "superadmin") {
      [user] = await db.query("SELECT * FROM admin WHERE id = ?", [decoded.id]);
    } else if (decoded.role === "clinic" || decoded.role === "staff") {
      [user] = await db.query("SELECT * FROM clinic WHERE id = ?", [
        decoded.id,
      ]);
    } else {
      [user] = await db.query("SELECT * FROM users WHERE id = ?", [decoded.id]);
    }

    req.user = user && user.length > 0 ? user[0] : null;
    return next();
  } catch (err) {
    // On token error (invalid/expired), don't block; treat as guest
    req.user = null;
    return next();
  }
};

/**
 * Middleware: Authorize based on user roles
 * Pass one or more roles like ['admin', 'doctor']
 */
export const authorizeRoles = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return apiResponse(res, {
        error: true,
        code: 403,
        status: 0,
        message: `Access denied for role: ${req.user?.role}`,
        payload: {},
      });
    }
    next();
  };
};
