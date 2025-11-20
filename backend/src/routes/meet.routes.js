import express from "express";
import { createMeet, deleteMeet } from "../controllers/meet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, createMeet);
router.delete("/:id", verifyJWT, deleteMeet);

export default router;
