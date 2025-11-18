const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    purchaseMedicines,
    clearPurchasedMedicines,
    resetPassword
} = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/profile', getUserProfile);
router.get('/user', getUserProfile);
router.post('/purchase', purchaseMedicines);
router.delete('/clear-medicines', clearPurchasedMedicines);
router.post('/reset', resetPassword);

module.exports = router;