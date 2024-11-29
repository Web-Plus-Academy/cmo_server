import Project from '../models/projectModel.js';

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, takenDate, deadline, pdf } = req.body;

    // Validate request data
    if (!name || !takenDate || !deadline || !pdf) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (new Date(takenDate) >= new Date(deadline)) {
      return res.status(400).json({ message: 'Deadline must be after the taken date' });
    }

    if (!pdf.endsWith('.pdf')) {
      return res.status(400).json({ message: 'Only PDF files are allowed' });
    }

    const project = new Project({ name, takenDate, deadline, pdf });
    await project.save();

    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    console.error('Error creating project:', error.message);
    res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
};

// Fetch all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ message: 'Projects fetched successfully', projects });
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
};

// Mark a project as complete by adding a link
export const markProjectComplete = async (req, res) => {
  const { id } = req.params; // Project ID from URL
 const { completionLink } = req.body;  // Link from request body

  if (!completionLink) {
    return res.status(400).json({ message: 'Completion link is required' });
  }

  try {
    const project = await Project.findByIdAndUpdate(
      id,
      { completed: true, completionLink: completionLink }, // Use completionLink instead of link
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project marked as complete', project });
  } catch (error) {
    console.error('Error marking project as complete:', error.message);
    res.status(500).json({ message: 'Failed to mark project as complete', error: error.message });
  }
};


// Fetch completed projects
export const getCompletedProjects = async (req, res) => {
  try {
    const completedProjects = await Project.find({ completed: true });

    if (!completedProjects.length) {
      return res.status(204).json({
        message: 'No completed projects found',
        projects: [],
      });
    }

    res.status(200).json({
      message: 'Completed projects fetched successfully',
      projects: completedProjects,
    });
  } catch (error) {
    console.error('Error fetching completed projects:', error.message);
    res.status(500).json({
      message: 'Server error while fetching completed projects',
      error: error.message,
    });
  }
};
