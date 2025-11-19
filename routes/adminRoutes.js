const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middlewares/auth');

// Get all pending doctors
router.get('/pending-doctors', requireAdmin, adminController.getPendingDoctors);

// Approve a doctor
router.post('/approve-doctor/:id', requireAdmin, adminController.approveDoctor);

// Reject a doctor
router.delete('/reject-doctor/:id', requireAdmin, adminController.rejectDoctor);

// Get all users
router.get('/users', requireAdmin, adminController.getUsers);

// Get all doctors
router.get('/doctors', requireAdmin, adminController.getDoctors);

// Get all appointments
router.get('/appointments', requireAdmin, adminController.getAppointments);

// Delete a user
router.delete('/users/:id', requireAdmin, adminController.deleteUser);

// Delete a doctor
router.delete('/doctors/:id', requireAdmin, adminController.deleteDoctor);

module.exports = router;
