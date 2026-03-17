import { Router } from "express";
import type { Router as RouterType } from "express";

import {
  getHealth,
  postLogin,
  postSignup,
} from "../controllers/indexController.ts";
import validate from "express-zod-safe";
import { UserSchema } from "@repo/zod-validations";
import requireAuth from "../middlewares/auth.ts";

const indexRouter: RouterType = Router();

indexRouter.get("/health", requireAuth, getHealth);
indexRouter.post("/sign-up", validate({ body: UserSchema }), postSignup);
indexRouter.post("/log-in", validate({ body: UserSchema }), postLogin);

export default indexRouter;
