// routes/shareRoutes.js
import express from "express";
import { createShare, stopShare, getShare } from "../controllers/shareController.js";

const router = express.Router();

router.post("/share", createShare);             // start sharing
router.put("/share/:shareId/stop", stopShare);  // stop sharing
router.get("/share/:shareId", getShare);        // validate link

export default router;
