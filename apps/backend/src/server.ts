import app from "./app.ts";
import { createServer } from "http";
import { Server } from "socket.io";
import socketAuth from "./middlewares/socketAuth.ts";
import type { Request } from "express";

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: [process.env.CLIENT_URL!] },
});
io.use(socketAuth);
io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected`);

  // logic
  socket.on("global chat", (message) => {
    const req = socket.request as Request;
    const userId = req.user?.id;

    io.emit("global chat", {
      content: message,
      userId: String(userId),
    });
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} disconnected`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
httpServer.on("error", (error) => {
  throw error;
});
