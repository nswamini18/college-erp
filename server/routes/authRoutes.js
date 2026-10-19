const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public login endpoint
router.post('/login', authController.login);

// Protected session check
router.get('/me', authenticateToken, authController.getCurrentUser);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
