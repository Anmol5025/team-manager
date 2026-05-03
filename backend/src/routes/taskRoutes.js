import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats,
} from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/dashboard')
  .get(protect, getDashboardStats);

router.route('/')
  .get(protect, getTasks)
  .post(protect, authorize('Admin'), createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, authorize('Admin'), deleteTask);

export default router;
