import {Router} from "express";
import {registerUser,loginUser,logoutUser,updateProfile} from "../controllers/user.controller.js";

import {verifyJWT} from "../middlewares/auth.middleware.js";

const router=Router();  

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//secured routes

router.route("/logout").post(verifyJWT,logoutUser);
router.route("/updateProfile").post(verifyJWT,updateProfile);
export default router;