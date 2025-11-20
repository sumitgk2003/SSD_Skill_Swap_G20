import { Router } from "express";
import { createAdmin, populateAdminSkills, getAdmin } from "../controllers/admin.controller.js";

const router = Router();

// Create initial admin: { email, password }
router.post("/create", createAdmin);

// Populate admin.skills from all users in the system. Body: { adminEmail? }
router.post("/populate-skills", populateAdminSkills);

// Get admin info (optional query ?email=)
router.get("/", getAdmin);

export default router;
