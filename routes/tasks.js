const express = require('express');
const { check } = require('express-validator');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route    POST /api/tasks
// @desc     Create a new task
// @access   Private
router.post(
    '/',
    [
        authMiddleware,
        check('title', 'Title is required').not().isEmpty(),
    ],
    taskController.createTask
);

// @route    GET /api/tasks
// @desc     Get all tasks of the logged-in user
// @access   Private
router.get('/', authMiddleware, taskController.getTasks);

// @route    PUT /api/tasks/:id
// @desc     Update a task
// @access   Private
router.put(
    '/:id',
    [
        authMiddleware,
        check('title', 'Title is required').not().isEmpty(),
    ],
    taskController.updateTask
);

// @route    DELETE /api/tasks/:id
// @desc     Delete a task
// @access   Private
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;
