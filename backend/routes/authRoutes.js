const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const storeController = require('../controller/storeController');

// Authentication and creation
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/store/create', storeController.createStoreUser);

// Viewing users based on role
router.get('/view/user', authController.getAllUsers);
router.get('/view/admin', authController.getAllAdmins);
router.get('/view/storeuser', storeController.getAllStoreUsers);

// 🔹 Update user profile (fullName and address)
router.put('/update/:email', authController.updateUserProfile);

module.exports = router;
