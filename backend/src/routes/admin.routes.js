import { Router } from "express";
import { createAdmin, populateAdminSkills, getAdmin, loginAdmin } from "../controllers/admin.controller.js";
import { createAdmin, populateAdminSkills, getAdmin } from "../controllers/admin.controller.js";
import { verifyJWT, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Create initial admin: { email, password }
router.post("/create", createAdmin);

// Populate admin.skills from all users in the system. Body: { adminEmail? }
// Protected: require admin
router.post("/populate-skills", verifyJWT, requireAdmin, populateAdminSkills);

// Get admin info (optional query ?email=)
router.get("/", getAdmin);
router.post("/login", loginAdmin);
router.get("/", verifyJWT, requireAdmin, getAdmin);

export default router;
