const express = require('express');
const { register, login, verifyEmail, resetPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// router.get('/verify/:token', verifyEmail);
// router.post('/reset-password', resetPassword);

module.exports = router;
