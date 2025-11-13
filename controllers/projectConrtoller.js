import mongoose from 'mongoose';
import Project from '../models/project.js';

// Create project
export const createProject = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    const project = new Project({ title, description, imageUrl });
    await project.save();

    return res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    return res.status(400).json({ errors: err.errors });
  }
};

// Get all projects
export const getAllProjects = async (_req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json({ projects, count: projects.length });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching projects', error: err.message });
  }
};

// Get one project
export const getProjectById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Project ID' });
  }

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    return res.status(200).json({ project });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching project', error: err.message });
  }
};

// Update project
export const updateProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Project ID' });
  }

  try {
    const updated = await Project.findByIdAndUpdate(
      id,
      { ...req.body }, // ✅ update with whatever fields are in body (title, desc, imageUrl)
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Project not found' });

    return res.status(200).json({ message: 'Project updated', project: updated });
  } catch (err) {
    return res.status(400).json({ errors: err.errors, message: err.message });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Project ID' });
  }

  try {
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    return res.status(200).json({ message: 'Project deleted', id });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting project', error: err.message });
  }
};
