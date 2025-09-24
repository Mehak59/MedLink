const express = require('express');
const router = express.Router();
const { findDoctorPage } = require('../controllers/doctorController');

router.get('/', (req, res) => res.render('home1', { req }));
router.get('/login', (req, res) => res.render('login', { req }));
router.get('/services', (req, res) => res.render('Services', { req }));
router.get('/register', (req, res) => res.render('register', { req }));
router.get('/about', (req, res) => res.render('Aboutus', { req }));
router.get('/contact', (req, res) => res.render('contact', { req }));
router.get('/reset', (req, res) => res.render('reset', { req }));
router.get('/Appointment', (req, res) => {
  res.render('Appointment', { req })
})
router.get('/findhospital', (req, res) => res.render('findHospital', { req }));
router.get('/profile', (req, res) => res.render('profile', { req }));
router.get('/emergency', (req, res) => res.render('Emergency', { req }));
router.get('/finddoctor', findDoctorPage);


module.exports = router;
