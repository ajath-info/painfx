import authRouter from "./authRoutes.js";
import userRouter from "./userRoutes.js";
import otpRouter from "./otpRoutes.js";
import doctorRouter from "./doctorRoutes.js";
import doctorAvailabilityRouter from "./doctorAvailblityRoutes.js";
import clinicRouter from "./clinicRoutes.js";
import appointmentRouter from "./appointmentRoutes.js";
import specialtyRouter from "./specilityRoutes.js"

const routes = {
    authRouter,
    userRouter,
    otpRouter,
    doctorRouter,
    doctorAvailabilityRouter,
    clinicRouter,
    appointmentRouter,
    specialtyRouter,
}

export default routes;