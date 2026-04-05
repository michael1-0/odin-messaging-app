import { Router } from "express";
import { getRoomsById, postRoom } from "../controllers/roomController.ts";
import requireAuth from "../middlewares/auth.ts";

const roomRouter: Router = Router();

roomRouter.post("/", requireAuth, postRoom);
roomRouter.get("/:creatorId", requireAuth, getRoomsById);

export default roomRouter;
