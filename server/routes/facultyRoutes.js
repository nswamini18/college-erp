const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Restrict all faculty routes to authenticated users with FACULTY or ADMIN role
router.use(authenticateToken);
router.use(requireRole('FACULTY', 'ADMIN'));

// Faculty Profile
router.get('/profile', facultyController.getProfile);

// Faculty Dashboard Summary & Schedule
router.get('/dashboard', facultyController.getDashboard);

// Class Attendance Marking
router.get('/attendance', facultyController.getAttendanceRoster);
router.post('/attendance', facultyController.saveAttendance);

// Academic Grading & Marks Entry
router.get('/grading', facultyController.getGradingRoster);
router.post('/grading', facultyController.saveGrading);

// Leave Applications & History
router.get('/leave', facultyController.getLeave);
router.post('/leave', facultyController.applyLeave);

// Faculty Payroll & Monthly Payslips
router.get('/payroll', facultyController.getPayroll);

module.exports = router;
