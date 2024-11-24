const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name: String,
    description: String,
    created_at: String,
});

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;
