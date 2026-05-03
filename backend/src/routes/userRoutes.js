import express from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

router.get('/', protect, authorize('Admin'), asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
}));

export default router;
