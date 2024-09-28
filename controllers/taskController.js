const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// Create Task
exports.createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, dueDate } = req.body; // Get dueDate from request body

    try {
        const task = new Task({
            title,
            description,
            dueDate, // Add dueDate to the new task
            userId: req.user.id,
            column: 'To Do'
        });

        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    const { title, description, column, dueDate } = req.body; // Get dueDate from request body

    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        // Check if the task belongs to the user
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Update task fields
        task = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, column, dueDate }, // Include dueDate in the update
            { new: true }
        );

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        let result = await Task.deleteOne({ _id: req.params.id }); // Deleting a task by its ID

        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
