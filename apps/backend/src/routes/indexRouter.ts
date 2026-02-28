import { Router } from "express";
import type { Router as RouterType } from "express";

import { getHealth } from "../controllers/indexController.ts";

const indexRouter: RouterType = Router();

indexRouter.get("/health", getHealth);

export default indexRouter;
