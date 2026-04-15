import type { Request, Response, NextFunction } from "express";
import { prisma } from "../db/prisma.ts";
import type { MessageUser } from "@repo/zod-validations";

async function getMessagesByRoomId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const roomId = Number(req.params.roomId);

    const messages = await prisma.message.findMany({
      select: {
        id: true,
        content: true,
        sender: true,
        createdAt: true,
      },
      where: {
        roomId,
      },
    });

    return res.json({ messages });
  } catch (error) {
    next(error);
  }
}

async function postMessageToRoomId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = req.body as MessageUser;
    const roomId = Number(req.params.roomId);
    const senderId = req.user!.id;
    const content = body.content;

    const newMessage = await prisma.message.create({
      select: {
        id: true,
        content: true,
        sender: true,
        createdAt: true,
      },
      data: {
        roomId,
        senderId,
        content,
      },
    });

    return res.json({ newMessage });
  } catch (error) {
    next(error);
  }
}

export { getMessagesByRoomId, postMessageToRoomId };
