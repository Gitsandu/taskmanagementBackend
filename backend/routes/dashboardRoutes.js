const express = require('express');
const { 
  getPriorityDistribution, 
  getCompletionRate, 
  getUpcomingDeadlines 
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { check, query } = require('express-validator');

const router = express.Router();

// Protect all routes in this router
router.use(protect);

/**
 * @swagger
 * /api/dashboard/priority-distribution:
 *   get:
 *     summary: Get task count grouped by priority
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Priority distribution data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   priority:
 *                     type: string
 *                     enum: [Low, Medium, High]
 *                   count:
 *                     type: integer
 *       401:
 *         description: Not authorized
 */
router.get('/priority-distribution', getPriorityDistribution);

/**
 * @swagger
 * /api/dashboard/completion-rate:
 *   get:
 *     summary: Get data for completion rate over time
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Number of days to include in the report
 *     responses:
 *       200:
 *         description: Completion rate data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                   completionRate:
 *                     type: number
 *                   completed:
 *                     type: integer
 *                   total:
 *                     type: integer
 *       401:
 *         description: Not authorized
 */
router.get(
  '/completion-rate',
  [
    query('days')
      .optional()
      .isInt({ min: 1, max: 365 })
      .withMessage('Days must be a number between 1 and 365'),
    validate
  ],
  getCompletionRate
);

/**
 * @swagger
 * /api/dashboard/upcoming-deadlines:
 *   get:
 *     summary: Get tasks with upcoming deadlines
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Number of days to look ahead
 *     responses:
 *       200:
 *         description: List of upcoming tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Not authorized
 */
router.get(
  '/upcoming-deadlines',
  [
    query('days')
      .optional()
      .isInt({ min: 1, max: 365 })
      .withMessage('Days must be a number between 1 and 365'),
    validate
  ],
  getUpcomingDeadlines
);

module.exports = router;
