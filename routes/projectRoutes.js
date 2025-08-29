import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectConrtoller.js"; // keeping filename as-is per your note

const router = express.Router();

// List + read
router.get("/projects", getAllProjects);
router.get("/projects/:id", getProjectById);

// Create + update + delete
router.post("/projects", createProject);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

export default router;
