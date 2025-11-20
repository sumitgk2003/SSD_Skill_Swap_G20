import {Router} from "express";
import {registerUser,loginUser,logoutUser,updateProfile,
findMatches,sendRequest,getPendingRequests,getConnectedUsers,
respondRequest,getAllSkills
} from "../controllers/user.controller.js";

import {verifyJWT} from "../middlewares/auth.middleware.js";

const router=Router();  

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//secured routes

router.route("/logout").post(verifyJWT,logoutUser);
router.route("/updateProfile").post(verifyJWT,updateProfile);
router.route("/getMatches").post(verifyJWT, findMatches);

router.route("/sendRequest").post(verifyJWT, sendRequest);
router.route("/viewRequests").get(verifyJWT, getPendingRequests);
router.route("/respondRequest").post(verifyJWT, respondRequest);
router.route("/getConnected").get(verifyJWT, getConnectedUsers);
router.route("/getAllSkills").get(verifyJWT, getAllSkills);

export default router;
