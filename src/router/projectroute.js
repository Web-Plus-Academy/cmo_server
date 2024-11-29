import express from 'express';
import {
  createProject,
  getAllProjects,
  markProjectComplete,
  getCompletedProjects,
} from '../controller/project.js';

const router = express.Router();

// Route to create a new project
router.post('/addproject', createProject);

// Route to fetch all projects
router.get('/projects', getAllProjects);

// Route to mark a project as complete
router.put('/projects/:id/complete', markProjectComplete);

// Route to fetch completed projects
router.get('/projects/completed', getCompletedProjects);

export default router;
