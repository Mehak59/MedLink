const express = require('express');
const router = express.Router();
const { getAllDoctors, findDoctorPage } = require('../controllers/doctorController');

router.get('/', getAllDoctors);
router.get('/finddoctor', findDoctorPage);
module.exports = router;