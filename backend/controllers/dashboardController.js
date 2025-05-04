const Task = require('../models/Task');

// @desc    Get task count grouped by priority
// @route   GET /api/dashboard/priority-distribution
// @access  Private
const getPriorityDistribution = async (req, res, next) => {
  try {
    const priorityDistribution = await Task.aggregate([
      // Match tasks for the logged-in user
      { $match: { user: req.user._id } },
      // Group by priority and count
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      // Format output
      { $project: { priority: '$_id', count: 1, _id: 0 } }
    ]);

    res.json(priorityDistribution);
  } catch (error) {
    next(error);
  }
};

// @desc    Get completion rate over time
// @route   GET /api/dashboard/completion-rate
// @access  Private
const getCompletionRate = async (req, res, next) => {
  try {
    // Get time range from query params (default to last 7 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (req.query.days || 7));

    // Get all tasks in the time range
    const tasks = await Task.find({
      user: req.user._id,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Calculate completion rate by day
    const completionRateData = [];
    const dateMap = new Map();

    // Initialize date map with dates in the range
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dateMap.set(dateStr, { date: dateStr, completed: 0, total: 0 });
    }

    // Count tasks by date
    tasks.forEach(task => {
      const dateStr = task.createdAt.toISOString().split('T')[0];
      if (dateMap.has(dateStr)) {
        const dayData = dateMap.get(dateStr);
        dayData.total += 1;
        if (task.status === 'Completed') {
          dayData.completed += 1;
        }
      }
    });

    // Convert map to array and calculate rates
    dateMap.forEach((value) => {
      const rate = value.total > 0 ? (value.completed / value.total) * 100 : 0;
      completionRateData.push({
        date: value.date,
        completionRate: parseFloat(rate.toFixed(2)),
        completed: value.completed,
        total: value.total
      });
    });

    res.json(completionRateData);
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks with upcoming deadlines
// @route   GET /api/dashboard/upcoming-deadlines
// @access  Private
const getUpcomingDeadlines = async (req, res, next) => {
  try {
    // Get days parameter (default to 7 days)
    const days = parseInt(req.query.days) || 7;
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const upcomingTasks = await Task.find({
      user: req.user._id,
      status: 'Pending',
      dueDate: { $gte: today, $lte: futureDate }
    }).sort({ dueDate: 1 });

    res.json(upcomingTasks);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPriorityDistribution,
  getCompletionRate,
  getUpcomingDeadlines
};
