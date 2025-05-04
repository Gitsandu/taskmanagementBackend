const express = require('express');
const { check } = require('express-validator');
const { 
  createTask, 
  getTasks, 
  getTaskById, 
  updateTask, 
  deleteTask 
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Protect all routes in this router
router.use(protect);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Task title
 *               description:
 *                 type: string
 *                 description: Task description
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: Due date for the task
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 default: Medium
 *                 description: Task priority
 *               status:
 *                 type: string
 *                 enum: [Pending, Completed]
 *                 default: Pending
 *                 description: Task status
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 */
router.post(
  '/',
  [
    check('title')
      .notEmpty()
      .withMessage('Title is required')
      .trim(),
    check('priority')
      .optional()
      .isIn(['Low', 'Medium', 'High'])
      .withMessage('Priority must be Low, Medium, or High'),
    check('status')
      .optional()
      .isIn(['Pending', 'Completed'])
      .withMessage('Status must be Pending or Completed'),
    check('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid date'),
    validate
  ],
  createTask
);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Completed]
 *         description: Filter tasks by status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: dueDate:asc
 *         description: Sort tasks by field (field:asc|desc)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Not authorized
 */
router.get('/', getTasks);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized to access this task
 */
router.get(
  '/:id',
  [
    check('id')
      .isMongoId()
      .withMessage('Invalid task ID'),
    validate
  ],
  getTaskById
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               status:
 *                 type: string
 *                 enum: [Pending, Completed]
 *     responses:
 *       200:
 *         description: Updated task
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Task not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized to update this task
 */
router.put(
  '/:id',
  [
    check('id')
      .isMongoId()
      .withMessage('Invalid task ID'),
    check('priority')
      .optional()
      .isIn(['Low', 'Medium', 'High'])
      .withMessage('Priority must be Low, Medium, or High'),
    check('status')
      .optional()
      .isIn(['Pending', 'Completed'])
      .withMessage('Status must be Pending or Completed'),
    check('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Due date must be a valid date'),
    validate
  ],
  updateTask
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task removed
 *       404:
 *         description: Task not found
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized to delete this task
 */
router.delete(
  '/:id',
  [
    check('id')
      .isMongoId()
      .withMessage('Invalid task ID'),
    validate
  ],
  deleteTask
);

module.exports = router;
