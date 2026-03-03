import { Router } from "express";
import type { Router as RouterType } from "express";

import { getHealth, postLogin, postSignup } from "../controllers/indexController.ts";

const indexRouter: RouterType = Router();

indexRouter.get("/health", getHealth);
indexRouter.post("/sign-up", postSignup);
indexRouter.post("/log-in", postLogin);

export default indexRouter;
