import express from "express";
import { createMeet, deleteMeet, getMyMeets, getMeetsByMatchId } from "../controllers/meet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, getMyMeets);
router.post("/getById", verifyJWT, getMeetsByMatchId);
router.post("/", verifyJWT, createMeet);
router.delete("/:id", verifyJWT, deleteMeet);

export default router;
