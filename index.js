const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/to_do_app');

const TaskSchema = new mongoose.Schema({
    name: String,
    description: String,
    created_at: String,
});

const TaskModel = mongoose.model('tasks', TaskSchema);

app.use(express.static(path.join(__dirname)));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Middleware for parsing JSON

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/tasks', (req, res) => {
    TaskModel.find({})
        .then((tasks) => {
            res.json(tasks);
        })
        .catch((err) => {
            console.error('Error fetching tasks:', err);
            res.status(500).send('Internal Server Error');
        });
});

// Endpoint to update a task
app.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(
            id,
            { name, description },
            { new: true } // Return the updated document
        );

        if (updatedTask) {
            res.status(200).json(updatedTask);
        } else {
            res.status(404).send('Task not found');
        }
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/submit', async (req, res) => {
    const { name, description } = req.body;

    const newTask = {
        created_at: new Date().toISOString(),
        name,
        description,
    };

    try {
        await TaskModel.create(newTask);
        console.log('New task created successfully');
        res.redirect('/');
    } catch (err) {
        console.error('Failed creating new task:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
