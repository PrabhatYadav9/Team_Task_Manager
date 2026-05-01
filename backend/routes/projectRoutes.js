const express = require('express');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all routes

router.post('/', authorize('Admin'), createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.put('/:id', authorize('Admin'), updateProject);
router.delete('/:id', authorize('Admin'), deleteProject);
router.post('/:id/members', authorize('Admin'), addMember);
router.delete('/:id/members/:memberId', authorize('Admin'), removeMember);

module.exports = router;
