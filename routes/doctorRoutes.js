const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateDoctorToken } = require('../middlewares/auth');

// Doctor authentication
router.post('/register', doctorController.registerDoctor);
router.post('/login', doctorController.loginDoctor);
router.get('/logout', doctorController.logoutDoctor);
router.post('/logout', doctorController.logoutDoctor);

// Doctor dashboard
router.get('/dashboard', authenticateDoctorToken, doctorController.getDoctorDashboard);
router.get('/profile', authenticateDoctorToken, doctorController.getDoctorProfile);
router.get('/profile-data', authenticateDoctorToken, doctorController.getDoctorProfileData);

// Doctor appointments
router.get('/appointments', authenticateDoctorToken, doctorController.getDoctorAppointments);

// FIX 1: Add new public route for users to get booking slots
router.get('/available-slots', doctorController.getAvailableSlots);

// Doctor slots (for doctor dashboard - requires authentication)
router.get('/slots', authenticateDoctorToken, doctorController.getDoctorSlots);
router.put('/slots/:id/availability', authenticateDoctorToken, doctorController.manageSlotAvailability);
router.put('/slots/:id/time', authenticateDoctorToken, doctorController.updateSlotTime);

// Doctor profile
router.post('/profile', authenticateDoctorToken, doctorController.updateDoctorProfile);

// Get doctors by speciality
router.get('/speciality', doctorController.getDoctorsBySpeciality);

module.exports = router;