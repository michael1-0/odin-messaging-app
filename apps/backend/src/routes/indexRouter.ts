import { Router } from "express";
import type { Router as RouterType } from "express";

import {
  getHealth,
  getMe,
  getUsers,
  postLogin,
  postSignup,
  putMe,
} from "../controllers/indexController.ts";
import validate from "express-zod-safe";
import {
  LoginSchema,
  ProfileUpdateSchema,
  SignupSchema,
} from "@repo/zod-validations";
import requireAuth from "../middlewares/auth.ts";
import roomRouter from "./roomRouter.ts";

const indexRouter: RouterType = Router();

indexRouter.use("/rooms", roomRouter);

indexRouter.get("/health", getHealth);
indexRouter.post("/sign-up", validate({ body: SignupSchema }), postSignup);
indexRouter.post("/log-in", validate({ body: LoginSchema }), postLogin);

indexRouter.get("/me", requireAuth, getMe);
indexRouter.get("/users", requireAuth, getUsers);
indexRouter.put(
  "/me",
  requireAuth,
  validate({ body: ProfileUpdateSchema }),
  putMe,
);

export default indexRouter;
