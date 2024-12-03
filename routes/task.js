const express = require('express');
const taskController = require('../controllers/taskController');
const router = express.Router();

router.get('/tasks', taskController.getTasks);
router.post('/submit', taskController.createTask);
router.put('/update/:id', taskController.updateTask);
router.delete('/delete/:id', taskController.deleteTask);

module.exports = router;