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
router.get('/doctorProfile', (req, res) => res.render('doctorProfile', { req }));
router.get('/emergency', (req, res) => res.render('Emergency', { req }));
router.get('/finddoctor', findDoctorPage);
router.get('/doctorRegister', (req, res) => res.render('doctorRegister', { req }));
router.get('/doctorLogin', (req, res) => res.render('doctorLogin', { req }));
router.get('/pharmacy', async (req, res) => {
    const { loadMedicines, loadSliderImages, loadFitnessDeals, loadPersonalCareProducts, loadSurgicalDeals, loadSurgicalDevices } = require('../api/dataLoader');
    const medicines = await loadMedicines();
    const sliderImages = await loadSliderImages();
    const fitnessDeals = await loadFitnessDeals();
    const personalCareProducts = await loadPersonalCareProducts();
    const surgicalDeals = await loadSurgicalDeals();
    const surgicalDevices = await loadSurgicalDevices();
    res.render('medicine', { req, medicines, sliderImages, fitnessDeals, personalCareProducts, surgicalDeals, surgicalDevices });
});
router.get('/cart', (req, res) => res.render('medcart', { req }));
router.get('/payment', (req, res) => res.render('payment', { req }));
router.get('/order-by-prescription', (req, res) => res.render('orderByPrescription', { req }));

module.exports = router;
