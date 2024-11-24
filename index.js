const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
mongoose.connect('mongodb://localhost:27017/to_do_app');

const TaskSchema = new mongoose.Schema({
    name: String,
    description: String,
    created_at: String
});

const TaskModel = mongoose.model('tasks', TaskSchema);

// Middleware to serve static files
app.use(express.static(path.join(__dirname)));
app.use(express.urlencoded({ extended: true }));

// Route for "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to fetch tasks
app.get('/tasks', (req, res) => {
    TaskModel.find({})
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            console.error('Error fetching tasks:', err);
            res.status(500).send('Internal Server Error');
        });
});

app.post('/submit', (req, res) => {
    const { name, description } = req.body;
    const dbPath = path.join(__dirname, 'db.json');

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading db.json:', err);
            return res.status(500).send('Internal Server Error');
        }

        let tasks = [];
        if (data) {
            try {
                tasks = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing db.json:', parseErr);
                return res.status(500).send('Internal Server Error');
            }
        }

        // Generate a unique ID for the new task
        const newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

        const newTask = {
            id: newId, // Add the ID field
            created_at: new Date().toISOString(),
            name,
            description,
        };
        tasks.push(newTask);

        fs.writeFile(dbPath, JSON.stringify(tasks, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing to db.json:', writeErr);
                return res.status(500).send('Internal Server Error');
            }

            res.redirect('/');
        });
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
