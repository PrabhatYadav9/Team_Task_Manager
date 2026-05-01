const Task = require('../models/Task');
const Project = require('../models/Project');
const { body, validationResult } = require('express-validator');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    console.log('[DEBUG] Incoming task creation request:', req.body);

    // Strict Validation
    await body('title').trim().notEmpty().withMessage('Task title is required').run(req);
    await body('projectId').notEmpty().withMessage('Project ID is required').run(req);
    await body('assignedTo').notEmpty().withMessage('Assignee is required').run(req);
    await body('dueDate').notEmpty().withMessage('Due date is required').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('[DEBUG] Validation errors:', errors.array());
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { title, description, projectId, assignedTo, status, dueDate } = req.body;

    // Project dependency check
    const project = await Project.findById(projectId);
    if (!project) {
      console.log('[DEBUG] Project not found for ID:', projectId);
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Role-based authorization - allow Owner OR Admin members
    if (project.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      console.log('[DEBUG] User is not authorized to create tasks in this project');
      return res.status(403).json({ success: false, message: 'Not authorized to create tasks in this project' });
    }

    const task = new Task({
      title,
      description,
      projectId,
      assignedTo,
      status: status || 'todo',
      dueDate,
      createdBy: req.user.id,
    });

    await task.save();
    await task.populate('assignedTo createdBy', 'name email');

    console.log('[DEBUG] Task created successfully:', task._id);
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    console.error('[DEBUG] Server error during task creation:', error.message);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Get all tasks for a project
// @route   GET /api/tasks/:projectId
// @access  Private
exports.getTasksByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { status } = req.query;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    let queryObj = { projectId };
    
    // Authorization logic:
    // 1. If Admin or Project Owner or Project Member, they can see all tasks (filtered by status/query).
    // 2. If not a member, they can still access this endpoint, but queryObj will restrict them to only tasks assigned to or created by them.
    const isAuthorized = project.members.some((m) => m.toString() === req.user.id) || project.owner.toString() === req.user.id || req.user.role === 'Admin';

    if (!isAuthorized) {
      queryObj.$or = [{ assignedTo: req.user.id }, { createdBy: req.user.id }];
    }

    let query = Task.find(queryObj);

    if (status) {
      query = query.where('status').equals(status);
    }

    const tasks = await query
      .populate('assignedTo createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/task/:id
// @access  Private
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo createdBy projectId', 'name email title');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check if user is authorized
    const project = await Project.findById(task.projectId);
    if (!project.members.some((m) => m.toString() === req.user.id) && project.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check if user is authorized (owner or assigned or Admin)
    const project = await Project.findById(task.projectId);
    const isOwner = project.owner.toString() === req.user.id;
    const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user.id;
    const isAdmin = req.user.role === 'Admin';

    if (!isOwner && !isAssigned && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    const { title, description, assignedTo, status, dueDate } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (assignedTo) task.assignedTo = assignedTo;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;

    await task.save();
    await task.populate('assignedTo createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check if user is authorized
    const project = await Project.findById(task.projectId);
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/tasks/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const { projectId } = req.query;

    let query = {};
    if (req.user.role !== 'Admin') {
      query.$or = [{ assignedTo: req.user.id }, { createdBy: req.user.id }];
    }
    
    if (projectId) {
      query.projectId = projectId;
    }

    const totalTasks = await Task.countDocuments(query);
    const todoTasks = await Task.countDocuments({ ...query, status: 'todo' });
    const inProgressTasks = await Task.countDocuments({ ...query, status: 'in-progress' });
    const doneTasks = await Task.countDocuments({ ...query, status: 'done' });

    // Get overdue tasks
    const overdueTasks = await Task.find({
      ...query,
      dueDate: { $lt: new Date() },
      status: { $ne: 'done' },
    }).populate('assignedTo projectId', 'name title');

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        todoTasks,
        inProgressTasks,
        doneTasks,
        overdueTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all tasks in the system
// @route   GET /api/tasks/all
// @access  Private/Admin
exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo createdBy projectId', 'name email title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
