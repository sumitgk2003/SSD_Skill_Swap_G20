import { Router } from "express";
import { getGoogleLoginUrl, handleGoogleCallbackPublic, disconnectGoogleCalendar } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public endpoints for Google sign-in/up
router.route("/google/login-url").get(getGoogleLoginUrl);
router.route("/google/callback").get(handleGoogleCallbackPublic);

// Protected endpoint to disconnect Google (requires authentication)
router.route("/google/disconnect").post(verifyJWT, disconnectGoogleCalendar);

export default router;
