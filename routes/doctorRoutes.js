const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { requireDoctorAuth } = require('../middlewares/auth');

// Doctor authentication
router.post('/login', doctorController.loginDoctor);
router.get('/logout', doctorController.logoutDoctor);
router.post('/logout', doctorController.logoutDoctor);

// Doctor dashboard
router.get('/dashboard', requireDoctorAuth, doctorController.getDoctorDashboard);
router.get('/profile', requireDoctorAuth, doctorController.getDoctorProfile);
router.get('/profile-data', requireDoctorAuth, doctorController.getDoctorProfileData);

// Doctor appointments
router.get('/appointments', requireDoctorAuth, doctorController.getDoctorAppointments);

// FIX 1: Add new public route for users to get booking slots
router.get('/available-slots', doctorController.getAvailableSlots);

// Doctor slots (for doctor dashboard - requires authentication)
router.get('/slots', requireDoctorAuth, doctorController.getDoctorSlots);
router.put('/slots/:id/availability', requireDoctorAuth, doctorController.manageSlotAvailability);
router.put('/slots/:id/time', requireDoctorAuth, doctorController.updateSlotTime);

// Doctor profile
router.post('/profile', requireDoctorAuth, doctorController.updateDoctorProfile);

// Get doctors by speciality
router.get('/speciality', doctorController.getDoctorsBySpeciality);

module.exports = router;