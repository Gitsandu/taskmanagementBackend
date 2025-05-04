const Task = require('../models/Task');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    // Create task
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    // Build query
    const query = { user: req.user._id };
    
    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Search by title or description if provided
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Build sort options
    let sortOptions = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sortOptions[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      // Default sort by createdAt desc
      sortOptions = { createdAt: -1 };
    }
    
    // Execute query
    const tasks = await Task.find(query).sort(sortOptions);
    
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    // Check if task exists
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    
    // Check if user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this task');
    }
    
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;
    
    // Find task
    const task = await Task.findById(req.params.id);
    
    // Check if task exists
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    
    // Check if user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }
    
    // Update task
    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    
    const updatedTask = await task.save();
    
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    // Find task
    const task = await Task.findById(req.params.id);
    
    // Check if task exists
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }
    
    // Check if user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this task');
    }
    
    // Delete task
    await Task.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Task removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
