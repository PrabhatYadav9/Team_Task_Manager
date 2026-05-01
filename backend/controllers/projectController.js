const Project = require('../models/Project');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res, next) => {
  try {
    // Validation
    await body('name').trim().notEmpty().withMessage('Project name is required').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description, members } = req.body;

    let projectMembers = members;
    if (!projectMembers) {
      const allUsers = await User.find().select('_id');
      projectMembers = allUsers.map(u => u._id);
    }

    const project = new Project({
      name,
      description,
      owner: req.user.id,
      members: projectMembers,
    });

    await project.save();
    await project.populate('owner members', 'name email');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all projects for logged-in user
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role !== 'Admin') {
      const Task = require('../models/Task');
      const userTasks = await Task.find({ assignedTo: req.user.id }).select('projectId');
      const projectIds = userTasks.map(t => t.projectId);

      query.$or = [
        { owner: req.user.id },
        { members: req.user.id },
        { _id: { $in: projectIds } }
      ];
    }

    const projects = await Project.find(query)
      .populate('owner members', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner members', 'name email');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is member or owner or has tasks assigned
    if (req.user.role !== 'Admin' && !project.members.some((m) => m._id.toString() === req.user.id) && project.owner._id.toString() !== req.user.id) {
      const Task = require('../models/Task');
      const hasTask = await Task.findOne({ projectId: project._id, assignedTo: req.user.id });
      if (!hasTask) {
        return res.status(403).json({ success: false, message: 'Not authorized to access this project' });
      }
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this project' });
    }

    const { name, description } = req.body;

    if (name) project.name = name;
    if (description) project.description = description;

    await project.save();
    await project.populate('owner members', 'name email');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private/Admin
exports.addMember = async (req, res, next) => {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({ success: false, message: 'Member ID is required' });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to add members to this project' });
    }

    // Check if member already exists
    if (project.members.includes(memberId)) {
      return res.status(400).json({ success: false, message: 'Member already in project' });
    }

    // Check if user exists
    const user = await User.findById(memberId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    project.members.push(memberId);
    await project.save();
    await project.populate('owner members', 'name email');

    res.status(200).json({
      success: true,
      message: 'Member added successfully',
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:memberId
// @access  Private/Admin
exports.removeMember = async (req, res, next) => {
  try {
    const { memberId } = req.params;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to remove members from this project' });
    }

    project.members = project.members.filter((m) => m.toString() !== memberId);
    await project.save();
    await project.populate('owner members', 'name email');

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
