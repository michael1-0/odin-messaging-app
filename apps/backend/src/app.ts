import express from "express";
import type { Express } from "express";
import cors from "cors";

import indexRouter from "./routes/indexRouter.ts";
import { errorHandler, notFound } from "./middlewares/errorHandler.ts";

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use("/api", indexRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
