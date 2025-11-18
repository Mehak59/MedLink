const express = require('express');
const router = express.Router();
const { getAllDoctors, findDoctorPage, registerDoctor, loginDoctor, getDoctorProfile, logoutDoctor, updateDoctorProfile } = require('../controllers/doctorController');

router.get('/', getAllDoctors);
router.get('/finddoctor', findDoctorPage);
router.post('/register', registerDoctor);
router.post('/login', loginDoctor);
router.get('/profile', getDoctorProfile);
router.get('/logout', logoutDoctor);
router.put('/profile', updateDoctorProfile);
module.exports = router;
