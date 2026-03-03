import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../errors/AppError.ts";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

function notFound(req: Request, res: Response, next: NextFunction) {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
}

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  void next;

  switch (error.constructor) {
    case AppError:
      return res.status(error.statusCode).json({ error: error.message });
    case PrismaClientKnownRequestError:
      if (error.code == "P2002") {
        return res.status(409).json({ error: "Record already exists" });
      }
      break;
    default:
      console.error("[errorHandler]", {
        method: req.method,
        path: req.originalUrl,
        error,
      });
      return res.status(500).json({ error: "Internal server error" });
  }
};

export { notFound, errorHandler };
