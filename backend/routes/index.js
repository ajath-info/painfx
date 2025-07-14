import authRouter from "./authRoutes.js";
import userRouter from "./userRoutes.js";
import otpRouter from "./otpRoutes.js";
import doctorRouter from "./doctorRoutes.js";
import doctorAvailabilityRouter from "./doctorAvailblityRoutes.js";
import clinicRouter from "./clinicRoutes.js";
import appointmentRouter from "./appointmentRoutes.js";
import specialtyRouter from "./specialtyRoutes.js"
import partnerRouter from "./partnerRoutes.js";
import patientRouter from "./patientRoutes.js";
import adminRouter from "./adminRoutes.js";
import ratingRouter from "./ratingRoutes.js";
const routes = {
    authRouter,
    userRouter,
    otpRouter,
    doctorRouter,
    doctorAvailabilityRouter,
    clinicRouter,
    appointmentRouter,
    specialtyRouter,
    partnerRouter,
    patientRouter,
    adminRouter,
    ratingRouter,
}

export default routes;