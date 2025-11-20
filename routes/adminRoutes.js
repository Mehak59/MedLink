const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin, authenticateFromCookie} = require('../middlewares/auth');

// Get all pending doctors
router.get('/pending-doctors', authenticateFromCookie, requireAdmin, adminController.getPendingDoctors);

// Approve a doctor
router.post('/approve-doctor/:id', authenticateFromCookie, requireAdmin, adminController.approveDoctor);

// Reject a doctor
router.delete('/reject-doctor/:id', authenticateFromCookie, requireAdmin, adminController.rejectDoctor);

// Get all users
router.get('/users', authenticateFromCookie, requireAdmin, adminController.getUsers);

// Get all doctors
router.get('/doctors', authenticateFromCookie, requireAdmin, adminController.getDoctors);

// Get all appointments
router.get('/appointments', authenticateFromCookie, requireAdmin, adminController.getAppointments);

// Delete a user
router.delete('/users/:id', authenticateFromCookie, requireAdmin, adminController.deleteUser);

// Delete a doctor
router.delete('/doctors/:id', authenticateFromCookie, requireAdmin, adminController.deleteDoctor);

module.exports = router;
