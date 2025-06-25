const db = require('../config/db');

// Create a user (admin or regular user)
const createUser = (fullName, email, address, role, password, callback) => {
  const sql = `
    INSERT INTO users (fullName, email, address, role, password)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [fullName, email, address, role, password], callback);
};

// Find user by email from users table
const findUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], callback);
};

// 🔹 New: Get all users (admin + user)
const findAllUsers = (callback) => {
  const sql = 'SELECT fullName, email, address, role FROM users';
  db.query(sql, callback);
};

// Create a store user
const createStoreUser = (fullName, email, storeName, address, password, callback) => {
  const initialRating = JSON.stringify([]); // Stored as a JSON string
  const averageRating = 0;

  const sql = `
    INSERT INTO storeusers (fullName, email, storeName, address, password, role, rating, averageRating)
    VALUES (?, ?, ?, ?, ?, 'store-user', ?, ?)
  `;
  db.query(sql, [fullName, email, storeName, address, password, initialRating, averageRating], callback);
};

// Find store user by email
const findStoreUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM storeusers WHERE email = ?';
  db.query(sql, [email], callback);
};

// 🔹 New: Get all store users
const findAllStoreUsers = (callback) => {
  const sql = 'SELECT fullName, email, storeName, address, rating, averageRating FROM storeusers';
  db.query(sql, callback);
};

// Find users by role (user or admin)
const findUsersByRole = (role, callback) => {
  const sql = 'SELECT fullName, email, address, role FROM users WHERE role = ?';
  db.query(sql, [role], callback);
};

// 🔹 New: Update user fullName and address by email
const updateUserByEmail = (email, fullName, address, callback) => {
  const sql = 'UPDATE users SET fullName = ?, address = ? WHERE email = ?';
  db.query(sql, [fullName, address, email], callback);
};

// Update or add a rating for a store user
const updateStoreUserRating = (storeUserEmail, userEmail, rating, callback) => {
  // Fetch current ratings
  const selectSql = 'SELECT rating FROM storeusers WHERE email = ?';
  db.query(selectSql, [storeUserEmail], (err, results) => {
    if (err) return callback(err);
    let ratings = [];
    if (results && results[0] && results[0].rating) {
      try {
        ratings = JSON.parse(results[0].rating);
      } catch (e) { ratings = []; }
    }
    // Update or add rating
    const idx = ratings.findIndex(r => r.email === userEmail);
    if (idx !== -1) ratings[idx].rating = rating;
    else ratings.push({ email: userEmail, rating });
    // Calculate average
    const avg = ratings.length ? (ratings.reduce((a, b) => a + b.rating, 0) / ratings.length) : 0;
    // Update in DB
    const updateSql = 'UPDATE storeusers SET rating = ?, averageRating = ? WHERE email = ?';
    db.query(updateSql, [JSON.stringify(ratings), avg, storeUserEmail], callback);
  });
};

// Get ratings for a store user
const getStoreUserRatings = (storeUserEmail, callback) => {
  const sql = 'SELECT rating, averageRating FROM storeusers WHERE email = ?';
  db.query(sql, [storeUserEmail], callback);
};

module.exports = {
  createUser,
  findUserByEmail,
  findAllUsers,         // ✅ Added
  createStoreUser,
  findStoreUserByEmail,
  findAllStoreUsers,    // ✅ Added
  findUsersByRole,       // ✅ Added
  updateUserByEmail,
  updateStoreUserRating,
  getStoreUserRatings
};
