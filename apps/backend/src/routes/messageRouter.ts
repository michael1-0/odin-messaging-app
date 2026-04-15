import { Router } from "express";
import {
  getMessagesByRoomId,
  postMessageToRoomId,
} from "../controllers/messageController.ts";
import requireAuth from "../middlewares/auth.ts";
import checkRoomAuth from "../middlewares/roomAuth.ts";
import validate from "express-zod-safe";
import { MessageSchema } from "@repo/zod-validations";

const messageRouter: Router = Router({ mergeParams: true });

messageRouter.get("/", requireAuth, checkRoomAuth, getMessagesByRoomId);
messageRouter.post(
  "/",
  requireAuth,
  checkRoomAuth,
  validate({ body: MessageSchema }),
  postMessageToRoomId,
);

export default messageRouter;
