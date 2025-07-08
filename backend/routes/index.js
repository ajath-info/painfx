import authRouter from "./authRoutes.js";
import userRouter from "./userRoutes.js";
import otpRouter from "./otpRoutes.js";
import doctorRouter from "./doctorRoutes.js";
import doctorAvailabilityRouter from "./doctorAvailblityRoutes.js";

const routes = {
    authRouter,
    userRouter,
    otpRouter,
    doctorRouter,
    doctorAvailabilityRouter,
}

export default routes;