import express from "express";

import { createChat,getChat,deleteChat } from "../controllers/chatControllers.js";

const router = express.Router();

router.get("/create", createChat);
router.get("/get", getChat);
router.post("/delete/:chatId", deleteChat);


export default router;
