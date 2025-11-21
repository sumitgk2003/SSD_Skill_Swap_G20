import { Router } from "express";
import { createAdmin, populateAdminSkills, getAdmin, loginAdmin } from "../controllers/admin.controller.js";

const router = Router();

// Create initial admin: { email, password }
router.post("/create", createAdmin);

// Populate admin.skills from all users in the system. Body: { adminEmail? }
router.post("/populate-skills", populateAdminSkills);

// Get admin info (optional query ?email=)
router.get("/", getAdmin);
router.post("/login", loginAdmin);

export default router;
