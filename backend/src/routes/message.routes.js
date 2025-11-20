import {Router} from "express";
import {
  getMessagesById,
  sendMessage,
} from "../controllers/message.controller.js";

import {verifyJWT} from "../middlewares/auth.middleware.js";

const messageRouter = Router();


messageRouter.route("/get").post(verifyJWT, getMessagesById);
messageRouter.route("/send").post(verifyJWT, sendMessage);

export default messageRouter;

