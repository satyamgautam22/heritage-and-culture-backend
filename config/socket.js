import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
import Chat from "../models/chat.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    }
  });

  // 🔐 STEP 1: Socket Authentication (JWT)
  io.use((socket, next) => {
    try {
      // token sent from client: socket.handshake.auth.token
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication token missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // attach user/guide info to socket
      socket.user = {
        id: decoded.id,
        role: decoded.role
      };

      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      "Socket connected:",
      socket.id,
      "Role:",
      socket.user.role
    );

    // join chat room
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
    });

    // send message
    socket.on("sendMessage", async ({ chatId, text }) => {
      if (!chatId || !text) return;

      // 🔐 senderId comes from verified JWT, not client
      const senderId = socket.user.id;

      const message = await Message.create({
        chatId,
        senderId,
        text
      });

      await Chat.findByIdAndUpdate(chatId, {
        lastMessage: text
      });

      io.to(chatId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
