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
import guideRouter from "./routes/guideRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import postrouter from "./routes/postRoutes.js";
import Message from "./models/Message.js";
import { initSocket } from "./config/socket.js";


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
app.use(express.urlencoded({ extended: true }));


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/data", uploadRoute);
app.use("/api", projectRoutes);
app.use("/api/guide", guideRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/posts", postrouter);
app.use("/api/chat", chatRoute);

// Connect MongoDB
await connectDB();

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const server=http.createServer(app);
// Initialize Socket.io
initSocket(server)



// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`)
);
