const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public login endpoint
router.post('/login', authController.login);

// Public registration options (departments, designations, sections)
router.get('/registration-options', authController.getRegistrationOptions);

// Public student and verified faculty registration endpoints
router.post('/register', authController.register);
router.post('/register/student', authController.registerStudent);
router.post('/register/faculty', authController.registerFaculty);

// Protected session check
router.get('/me', authenticateToken, authController.getCurrentUser);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
