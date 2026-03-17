import type { Request, NextFunction, Response } from "express";
import type { Socket, ExtendedError } from "socket.io";
import requireAuth from "./auth.ts";

function socketAuth(
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void,
) {
  const token = socket.handshake.auth?.token;
  socket.request.headers.authorization = token ? `Bearer ${token}` : "";

  requireAuth(
    socket.request as unknown as Request,
    {} as Response,
    next as NextFunction,
  );
}

export default socketAuth ;
