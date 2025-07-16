import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const VERSION = process.env.VERSION;


// Database
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const DB_NAME = process.env.DB_NAME;
export const DB_PORT = process.env.DB_PORT;

// Authentication
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Session
export const SESSION_SECRET = process.env.SESSION_SECRET;

// Mailer
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
export const EMAIL_FROM = process.env.EMAIL_FROM;

// strip
export const STRIPE_API_KEY = process.env.STRIP_API_KEY;
export const STRIPE_SECRET_KEY = process.env.STRIP_SECRET_KEY;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const BACKEND_URL = process.env.BACKEND_URL;




