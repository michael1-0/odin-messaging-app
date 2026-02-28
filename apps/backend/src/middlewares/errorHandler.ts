import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../errors/AppError.ts";

function notFound(req: Request, res: Response, next: NextFunction) {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
}

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  void next;

  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message =
    error instanceof AppError ? error.message : "Internal server error";

  if (statusCode >= 500) {
    console.error("[errorHandler]", {
      method: req.method,
      path: req.originalUrl,
      error,
    });
  }

  res.status(statusCode).json({
    error: message,
  });
};

export { notFound, errorHandler };
