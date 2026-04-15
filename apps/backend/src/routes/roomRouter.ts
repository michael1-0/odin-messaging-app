import { Router } from "express";
import { getRoomsById, postRoom } from "../controllers/roomController.ts";
import requireAuth from "../middlewares/auth.ts";
import messageRouter from "./messageRouter.ts";

const roomRouter: Router = Router();

roomRouter.use("/:roomId/messages", messageRouter);

roomRouter.post("/", requireAuth, postRoom);
roomRouter.get("/", requireAuth, getRoomsById);

export default roomRouter;
