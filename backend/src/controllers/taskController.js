import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  project: z.string().min(1, 'Project ID is required'),
  assignedTo: z.string().optional(),
  status: z.enum(['Todo', 'In Progress', 'Done']).optional(),
  dueDate: z.string().min(1, 'Due date is required'),
});

// @desc    Get all tasks (with filtering)
// @route   GET /api/tasks
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
  const { status, assignedTo } = req.query;
  let query = {};

  if (status) query.status = status;

  if (req.user.role === 'Admin') {
    if (assignedTo) query.assignedTo = assignedTo;
  } else {
    // Members can only see tasks assigned to them
    query.assignedTo = req.user._id;
  }

  const tasks = await Task.find(query)
    .populate('project', 'title')
    .populate('assignedTo', 'name email');

  res.json(tasks);
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
export const createTask = asyncHandler(async (req, res) => {
  const result = taskSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400);
    throw new Error(result.error.errors.map(err => err.message).join(', '));
  }

  const { title, description, project, assignedTo, status, dueDate } = result.data;

  // Validate project exists
  const projectExists = await Project.findById(project);
  if (!projectExists) {
    res.status(404);
    throw new Error('Project not found');
  }

  const task = new Task({
    title,
    description,
    project,
    assignedTo: assignedTo || null,
    status: status || 'Todo',
    dueDate,
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
});

// @desc    Update a task (Admin can update all, Member only status of assigned tasks)
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (req.user.role === 'Member') {
    // Member can only update status of their assigned tasks
    if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }

    const { status } = req.body;
    if (status) {
      task.status = status;
      const updatedTask = await task.save();
      return res.json(updatedTask);
    } else {
      res.status(400);
      throw new Error('Members can only update task status');
    }
  }

  // Admin update
  const { title, description, project, assignedTo, status, dueDate } = req.body;

  task.title = title || task.title;
  task.description = description || task.description;
  task.project = project || task.project;
  task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
  task.status = status || task.status;
  task.dueDate = dueDate || task.dueDate;

  const updatedTask = await task.save();
  res.json(updatedTask);
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    await Task.deleteOne({ _id: task._id });
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Get dashboard stats
// @route   GET /api/tasks/dashboard
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res) => {
  let query = {};
  
  if (req.user.role !== 'Admin') {
    query.assignedTo = req.user._id;
  }

  const tasks = await Task.find(query);
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  const pendingTasks = tasks.filter(task => task.status === 'Todo' || task.status === 'In Progress').length;
  const overdueTasks = tasks.filter(task => task.status !== 'Done' && new Date(task.dueDate) < new Date()).length;

  res.json({
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks
  });
});
