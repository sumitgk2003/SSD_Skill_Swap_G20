import {Router} from "express";
import {
  getContacts,
  getMessagesById,
  getPartners,
  sendMessage,
} from "../controllers/message.controller.js";

import {verifyJWT} from "../middlewares/auth.middleware.js";

const messageRouter = Router();


messageRouter.route("/contacts").get(verifyJWT, getContacts);
messageRouter.route("/partners").get(verifyJWT, getPartners);
messageRouter.route("/msg/:id").get(verifyJWT, getMessagesById);
messageRouter.route("/send/:id").get(verifyJWT, sendMessage);

export default messageRouter;

