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

const updateStoreUserRating = (req, res) => {
  const { storeUserEmail } = req.params;
  const { email, rating } = req.body;
  if (!email || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Invalid email or rating' });
  }
  User.updateStoreUserRating(storeUserEmail, email, rating, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating rating' });
    res.status(200).json({ message: 'Rating updated' });
  });
};

const getStoreUserRatings = (req, res) => {
  const { storeUserEmail } = req.params;
  User.getStoreUserRatings(storeUserEmail, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching ratings' });
    if (!results || results.length === 0) return res.status(404).json({ message: 'Store user not found' });
    const { rating, averageRating } = results[0];
    res.status(200).json({ rating: JSON.parse(rating), averageRating });
  });
};

module.exports = {
  createStoreUser,
  getStoreUserByEmail,
  getAllStoreUsers,
  updateStoreUserRating,
  getStoreUserRatings
};
