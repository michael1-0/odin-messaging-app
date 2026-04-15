import type { Request, Response, NextFunction } from "express";
import { prisma } from "../db/prisma.ts";
import { AppError } from "../errors/AppError.ts";

async function checkRoomAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const roomId = Number(req.params.roomId);
    const userId = req.user!.id;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!room) {
      throw new AppError("Room does not exists", 404);
    }
    if (![room.user1Id, room.user2Id].includes(userId)) {
      throw new AppError("Unauthorized", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
}

export default checkRoomAuth;
