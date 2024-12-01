const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const taskController = require('./controllers/taskController');
const userController = require('./controllers/userController');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/to_do_app');

app.use(express.static(path.join(__dirname)));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/tasks', taskController.getTasks);
app.post('/submit', taskController.createTask);
app.put('/update/:id', taskController.updateTask);
app.delete('/delete/:id', taskController.deleteTask);

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});
app.post('/register', userController.register);

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
app.post('/login', userController.login);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
