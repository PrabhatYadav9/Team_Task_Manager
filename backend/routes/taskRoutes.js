const express = require('express');
const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardStats,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all routes

router.post('/', authorize('Admin'), createTask);
router.get('/project/:projectId', getTasksByProject);
router.get('/task/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', authorize('Admin'), deleteTask);
router.get('/dashboard/stats', getDashboardStats);

module.exports = router;
