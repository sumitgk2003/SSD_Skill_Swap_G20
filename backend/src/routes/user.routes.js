import { Router } from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
	updateProfile,
	findMatches,
	sendRequest,
	getPendingRequests,
	getConnectedUsers,
	respondRequest,
	getAllSkills,
	getAllConnections,
	getCurrentUser,
	getUserProfileById,
	getCategory,
	addSkill,
	getAllSk,
	getAllCategory,
	getCategoryMatches,
	updateMatchProgress,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(verifyJWT, getCurrentUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/updateProfile").post(verifyJWT, updateProfile);
router.route("/getMatches").post(verifyJWT, findMatches);

router.route("/sendRequest").post(verifyJWT, sendRequest);
router.route("/viewRequests").get(verifyJWT, getPendingRequests);
router.route("/respondRequest").post(verifyJWT, respondRequest);
router.route("/getConnected").get(verifyJWT, getConnectedUsers);
router.route("/getAllSkills").get(verifyJWT, getAllSkills);
router.route("/getAllSk").get(verifyJWT, getAllSk);
router.route("/getConnections").get(verifyJWT, getAllConnections);
router.route("/profile/:userId").get(verifyJWT, getUserProfileById);

router.route("/getCategory").post(verifyJWT, getCategory);
router.route("/addSkill").post(verifyJWT, addSkill);

router.route("/getAllCategory").get(verifyJWT, getAllCategory);
router.route("/getCategoryMatches").post(verifyJWT, getCategoryMatches);
router.route("/matches/:matchId/progress").patch(verifyJWT, updateMatchProgress);

export default router;
