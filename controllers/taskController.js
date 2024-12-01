// controllers/taskController.js
const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (deletedTask) {
            res.status(200).send('Task deleted successfully');
        } else {
            res.status(404).send('Task not found');
        }
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(id, { name, description }, { new: true });
        if (updatedTask) {
            res.status(200).json(updatedTask);
        } else {
            res.status(404).send('Task not found');
        }
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.createTask = async (req, res) => {
    const { name, description } = req.body;
    const newTask = { created_at: new Date().toISOString(), name, description };
    try {
        await Task.create(newTask);
        console.log('New task created successfully');
        res.redirect('/');
    } catch (err) {
        console.error('Failed creating new task:', err);
        res.status(500).send('Internal Server Error');
    }
};
