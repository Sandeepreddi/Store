const User = require('../model/userModel');

// Create Store User
const createStoreUser = (req, res) => {
  const { fullName, email, storeName, address, password } = req.body;

  User.findStoreUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results && results.length > 0) {
      return res.status(400).json({ message: 'Store user already exists' });
    }

    User.createStoreUser(fullName, email, storeName, address, password, (err, result) => {
      if (err) return res.status(500).json({ message: 'Store user creation failed' });
      res.status(201).json({ message: 'Store user registered successfully' });
    });
  });
};

// Get store user by email
const getStoreUserByEmail = (req, res) => {
  const { email } = req.params;

  User.findStoreUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching store user' });

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Store user not found' });
    }

    res.status(200).json(results[0]);
  });
};

// Get all store users
const getAllStoreUsers = (req, res) => {
  User.findAllStoreUsers((err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching store users' });

    res.status(200).json(results);
  });
};

module.exports = {
  createStoreUser,
  getStoreUserByEmail,
  getAllStoreUsers
};
