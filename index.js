const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3000;
const User = require('./models/User');

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
app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await TaskModel.findByIdAndDelete(id);

        if (deletedTask) {
            res.status(200).send('Task deleted successfully');
        } else {
            res.status(404).send('Task not found');
        }
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).send('Internal Server Error');
    }
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

app.get('/register', async (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
})

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Create a new user
        const user = new User({ username, email, password });

        // Save the user
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/login', async (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User not found');
        }

        // Compare the password with the stored hash
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        res.status(200).send('Login successful');
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
