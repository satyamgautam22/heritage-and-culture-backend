import express from "express";
import auth from "../middleware/auth.js";
import { getMessages } from "../controllers/messageController.js";

const router = express.Router();

router.get("/:chatId", auth, getMessages);

export default router;
