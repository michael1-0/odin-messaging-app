import { Router } from "express";
import type { Router as RouterType } from "express";

import {
  getHealth,
  postLogin,
  postSignup,
} from "../controllers/indexController.ts";
import validate from "express-zod-safe";
import { LoginSchema, SignupSchema } from "@repo/zod-validations";
import requireAuth from "../middlewares/auth.ts";

const indexRouter: RouterType = Router();

indexRouter.get("/health", requireAuth, getHealth);
indexRouter.post("/sign-up", validate({ body: SignupSchema }), postSignup);
indexRouter.post("/log-in", validate({ body: LoginSchema }), postLogin);

export default indexRouter;
