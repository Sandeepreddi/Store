const User = require('../model/userModel');

// Signup
const signup = (req, res) => {
  const { fullName, email, address, role, password } = req.body;

  User.findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results && results.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    User.createUser(fullName, email, address, role, password, (err, result) => {
      if (err) return res.status(500).json({ message: 'Signup error' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

// Login
const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: 'Login error' });

    if (!results || results.length === 0 || results[0].password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user: results[0] });
  });
};

// Get all users or admins by role
const getUsersByRole = (req, res) => {
  const role = req.params.role;

  if (role !== 'user' && role !== 'admin') {
    return res.status(400).json({ message: 'Invalid role. Only user or admin allowed.' });
  }

  User.findUsersByRole(role, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users' });
    res.status(200).json(results);
  });
};

// Get all users (role = user)
const getAllUsers = (req, res) => {
  User.findUsersByRole('user', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users' });
    res.status(200).json(results);
  });
};

// Get all admins (role = admin)
const getAllAdmins = (req, res) => {
  User.findUsersByRole('admin', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching admins' });
    res.status(200).json(results);
  });
};

// Update user profile (name and address)
const updateUser = (req, res) => {
  const { email } = req.params;
  const { fullName, address } = req.body;

  if (!fullName || !address) {
    return res.status(400).json({ message: 'Full name and address are required.' });
  }

  User.updateUserByEmail(email, fullName, address, (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to update user profile' });
    res.status(200).json({ message: 'User updated successfully' });
  });
};

module.exports = {
  signup,
  login,
  getUsersByRole,
  getAllUsers,
  getAllAdmins,
  updateUser
};
