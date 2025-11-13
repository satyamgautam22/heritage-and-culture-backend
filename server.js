import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http"; // for socket.io
import { Server } from "socket.io";
import connectDB from "./config/db.js";

// Routes
import uploadRoute from "./routes/imageRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import shareRoutes from "./routes/shareRoute.js";
import chatRoute from "./routes/chatRoutes.js"; 
import messageRouter from "./routes/messageRoute.js";
import guideRouter from "./routes/guideRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import postrouter from "./routes/postRoutes.js";


dotenv.config();

// Initialize express
const app = express();


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(express.json());


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/data", uploadRoute);
app.use("/api", projectRoutes);
app.use("/api/live-location", shareRoutes);
app.use("/api/ai", chatRoute);
app.use("/api/messages", messageRouter);
app.use("/api/guide", guideRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/posts", postrouter);


// Connect MongoDB
await connectDB();

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Create HTTP server & Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// Socket.IO handlers
io.on("connection", (socket) => {
  console.log("🔌 New client connected");

  socket.on("start-sharing", ({ shareId }) => {
    socket.join(shareId);
    console.log(`📡 Started sharing: ${shareId}`);
  });

  socket.on("send-location", (data) => {
    io.to(data.shareId).emit("receive-location", {
      latitude: data.latitude,
      longitude: data.longitude,
    });
  });

  socket.on("stop-sharing", ({ shareId }) => {
    io.to(shareId).emit("sharing-stopped");
    console.log(`⛔ Stopped sharing: ${shareId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`)
);
