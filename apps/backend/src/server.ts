import app from "./app.ts";
import { createServer } from "http";
import { Server } from "socket.io";
import socketAuth from "./middlewares/socketAuth.ts";
import type { Request } from "express";
import { prisma } from "./db/prisma.ts";
import { AppError } from "./errors/AppError.ts";

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: [process.env.CLIENT_URL!], credentials: true },
});

const onlineUsersByConnections = new Map<number, number>();

function emitOnlineUsersCount() {
  io.emit("users:online-count", onlineUsersByConnections.size);
}

io.use(socketAuth);
io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected`);

  const req = socket.request as Request;
  const connectedUserId = req.user?.id;

  if (connectedUserId) {
    const currentConnections =
      onlineUsersByConnections.get(connectedUserId) ?? 0;
    onlineUsersByConnections.set(connectedUserId, currentConnections + 1);
    emitOnlineUsersCount();
  }

  // logic
  socket.on("global chat", (message) => {
    const req = socket.request as Request;
    const userId = req.user?.id;
    const username = req.user?.username;

    io.emit("global chat", {
      content: message,
      userId,
      username,
    });
  });
  socket.on("join chat", async (roomId: number) => {
    try {
      const req = socket.request as Request;
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const room = await prisma.room.findUnique({
        where: {
          id: roomId,
        },
      });
      if (!room) {
        throw new AppError("Room does not exist", 404);
      }
      if (![room.user2Id, room.user1Id].includes(userId)) {
        throw new AppError("Unauthorized", 403);
      }

      socket.join(`chat:${roomId}`);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("message chat", async ({ roomId, message }) => {
    try {
      const req = socket.request as Request;
      const userId = req.user?.id;
      const username = req.user?.username;

      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const room = await prisma.room.findUnique({
        where: {
          id: roomId,
        },
      });
      if (!room) {
        throw new AppError("Room does not exist", 404);
      }
      if (![room.user2Id, room.user1Id].includes(userId)) {
        throw new AppError("Unauthorized", 403);
      }

      await prisma.message.create({
        data: {
          content: message,
          senderId: userId,
          roomId: room.id,
        },
      });
      await prisma.room.update({
        where: { id: roomId },
        data: {
          updatedAt: new Date(),
        },
      });

      io.to(`chat:${roomId}`).emit("message chat", {
        content: message,
        userId,
        username,
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    if (connectedUserId) {
      const currentConnections =
        onlineUsersByConnections.get(connectedUserId) ?? 0;

      if (currentConnections <= 1) {
        onlineUsersByConnections.delete(connectedUserId);
      } else {
        onlineUsersByConnections.set(connectedUserId, currentConnections - 1);
      }

      emitOnlineUsersCount();
    }

    console.log(`user ${socket.id} disconnected`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
httpServer.on("error", (error) => {
  throw error;
});
