import { Router } from "express";
import { createAdmin, populateAdminSkills, getAdmin, loginAdmin, getAllUsers, deleteUserById, getAdminSkills, logoutAdmin } from "../controllers/admin.controller.js";
import { verifyJWT, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Create initial admin: { email, password }
router.post("/create", createAdmin);

// Populate admin.skills from all users in the system. Body: { adminEmail? }
// Protected: require admin
router.post("/populate-skills", verifyJWT, requireAdmin, populateAdminSkills);

// Get admin info (optional query ?email=)
// Public: get admin info (optional query ?email=) - protected
router.post("/login", loginAdmin);
router.get("/", verifyJWT, requireAdmin, getAdmin);
// Admin-only: list all users
router.get("/users", verifyJWT, requireAdmin, getAllUsers);
// Admin update/delete user
router.delete('/users/:id', verifyJWT, requireAdmin, deleteUserById);
// Admin delete skill globally (query param ?skill=Name)
router.get('/skills', verifyJWT, requireAdmin, getAdminSkills);
// Admin logout
router.post('/logout', verifyJWT, requireAdmin, logoutAdmin);

export default router;
