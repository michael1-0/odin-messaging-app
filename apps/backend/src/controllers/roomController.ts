import type { NextFunction, Request, Response } from "express";
import { prisma } from "../db/prisma.ts";
import { AppError } from "../errors/AppError.ts";

async function postRoom(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    // Sort to make sure there exists only one order
    const [user1Id, user2Id] = [req.user!.id, body.user2Id].sort();
    const creatorId = req.user!.id;

    if (user1Id === user2Id) {
      throw new AppError("Can't add yourself bro", 400);
    }

    const found = await prisma.user.findUnique({
      where: { id: creatorId !== user1Id ? user1Id : user2Id },
    });
    if (!found) {
      throw new AppError("No user found with that id", 404);
    }

    const newRoom = await prisma.room.create({
      data: {
        user1Id,
        user2Id,
        createdById: creatorId,
      },
      select: {
        id: true,
        createdBy: { select: { id: true, username: true } },
        user1: { select: { id: true, username: true } },
        user2: { select: { id: true, username: true } },
      },
    });

    return res.status(201).json(newRoom);
  } catch (error) {
    next(error);
  }
}

async function getRoomsById(req: Request, res: Response, next: NextFunction) {
  try {
    const rooms = await prisma.room.findMany({
      select: {
        id: true,
        createdBy: { select: { id: true, username: true } },
        user1: { select: { id: true, username: true } },
        user2: { select: { id: true, username: true } },
      },
      orderBy: { updatedAt: "desc" },
      where: { OR: [{ user1Id: req.user!.id }, { user2Id: req.user!.id }] },
    });

    return res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
}

export { postRoom, getRoomsById };
