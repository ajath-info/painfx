import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import fileUpload from "express-fileupload";

import * as DB from "./config/db.js";
import * as DOTENV from "./utils/dotEnv.js";
import { apiResponseError } from "./utils/error.js";
import routes from "./routes/index.js";

const PORT = DOTENV.PORT || 5000;
const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// Session management
app.use(
  session({
    secret: DOTENV.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: DOTENV.NODE_ENV === "production",
    },
  })
);
// Express Rate Limiter
const expressRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res
      .status(429)
      .json({ success: false, status: 429, message: "Too many requests" });
  },
  keyGenerator: (req) => req.user?.id ?? req.ip,
});
app.use(expressRateLimiter);

// for file upload
app.use(fileUpload());
app.use("/uploads", express.static("public/uploads"));

// routes
app.use(`/api/auth`, routes.authRouter);
app.use("/api/admin", routes.adminRouter);
app.use(`/api/user`, routes.userRouter);
app.use(`/api/otp`, routes.otpRouter);
app.use(`/api/doctor`, routes.doctorRouter);
app.use(`/api/availability`, routes.doctorAvailabilityRouter);
app.use(`/api/clinic`, routes.clinicRouter);
app.use(`/api/appointment`, routes.appointmentRouter);
app.use("/api/specialty", routes.specialtyRouter);
app.use("/api/partner", routes.partnerRouter);
app.use("/api/patient", routes.patientRouter);
app.use("/api/rating", routes.ratingRouter);
app.use("/api/payment", routes.paymentRouter);
app.use("/api/invoice", routes.invoiceRouter);


// Global API Response Error Middleware
app.use(apiResponseError);

// Initialize DB and start server
(async () => {
  try {
    await DB.connectDB();
    await DB.createTable();
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("Startup Error:", err);
    process.exit(1);
  }
})();
