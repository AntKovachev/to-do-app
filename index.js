const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const taskRoutes = require('./routes/task');
const authRoutes = require('./routes/auth');
const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/to_do_app');

app.use(express.static(path.join(__dirname)));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(taskRoutes);
app.use(authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
