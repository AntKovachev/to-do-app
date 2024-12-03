const express = require('express');
const path = require('path');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../register.html'));
});
router.post('/register', userController.register);

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html'));
});
router.post('/login', userController.login);

module.exports = router;
