import express from "express";
import { createChat } from "../controllers/chatController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create/:bookingId", auth, createChat);


export default router;
