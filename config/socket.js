import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/Message.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error("Auth error"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("sendMessage", async ({ chatId, text }) => {
      const msg = await Message.create({
        chatId,
        sender: socket.user.id,
        text,
      });

      io.to(chatId).emit("receiveMessage", msg);
    });
  });

  return io;
};
