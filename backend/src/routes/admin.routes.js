import { Router } from "express";
import { createAdmin, populateAdminSkills, getAdmin, loginAdmin, getAllUsers, deleteUserById, getAdminSkills, logoutAdmin } from "../controllers/admin.controller.js";
import { endMatchById } from "../controllers/admin.controller.js";
import { getSitePolicy, updateSitePolicy } from "../controllers/admin.controller.js";
import { verifyJWT, verifyAdminJWT, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Create initial admin: { email, password }
router.post("/create", createAdmin);

// Populate admin.skills from all users in the system. Body: { adminEmail? }
// Protected: require admin
router.post("/populate-skills", verifyAdminJWT, requireAdmin, populateAdminSkills);

// Get admin info (optional query ?email=)
// Public: get admin info (optional query ?email=) - protected
router.post("/login", loginAdmin);
router.get("/", verifyAdminJWT, requireAdmin, getAdmin);
// Admin-only: list all users
router.get("/users", verifyAdminJWT, requireAdmin, getAllUsers);
// Admin update/delete user
router.delete('/users/:id', verifyAdminJWT, requireAdmin, deleteUserById);
// Admin delete skill globally (query param ?skill=Name)
router.get('/skills', verifyAdminJWT, requireAdmin, getAdminSkills);
// Admin logout
router.post('/logout', verifyAdminJWT, requireAdmin, logoutAdmin);
// Admin: end (delete) a match by id
router.delete('/matches/:id', verifyAdminJWT, requireAdmin, endMatchById);

// Site policy: public GET, admin PUT
router.get('/policy', getSitePolicy);
router.put('/policy', verifyAdminJWT, requireAdmin, updateSitePolicy);

export default router;
