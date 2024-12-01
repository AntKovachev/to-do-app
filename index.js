const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3000;
const taskController = require('./controllers/taskController');
const userController = require('./controllers/userController');

mongoose.connect('mongodb://localhost:27017/to_do_app');

app.use(express.static(path.join(__dirname)));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/tasks', taskController.getTasks);
app.delete('/delete/:id', taskController.deleteTask);
app.put('/update/:id', taskController.updateTask);
app.post('/submit', taskController.createTask);

app.get('/register', userController.showRegisterPage);
app.post('/register', userController.registerUser);

app.get('/login', userController.showLoginPage);
app.post('/login', userController.loginUser);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
