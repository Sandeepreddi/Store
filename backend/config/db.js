// db.js
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database.');

    // Create users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullName VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        address VARCHAR(400) NOT NULL,
        role VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL
      )
    `;
    db.query(createUsersTable, (err) => {
      if (err) {
        console.error('Failed to create users table:', err);
      } else {
        console.log('Users table is ready.');

        // Insert dummy admin user if not exists
        const insertAdmin = `
          INSERT INTO users (fullName, email, address, role, password)
          SELECT * FROM (
            SELECT 'admin' AS fullName, 'admin@gmail.com' AS email, 'Admin Address' AS address, 'admin' AS role, 'admin' AS password
          ) AS tmp
          WHERE NOT EXISTS (
            SELECT email FROM users WHERE email = 'admin@gmail.com'
          ) LIMIT 1
        `;
        db.query(insertAdmin, (err, result) => {
          if (err) {
            console.error('Failed to insert admin user:', err);
          } else if (result.affectedRows > 0) {
            console.log('Default admin user inserted.');
          } else {
            console.log('Admin user already exists.');
          }
        });
      }
    });

    // Create storeusers table
    const createStoreUsersTable = `
      CREATE TABLE IF NOT EXISTS storeusers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullName VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        storeName VARCHAR(100) NOT NULL,
        address VARCHAR(400) NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(100) DEFAULT 'store-user',
        rating JSON DEFAULT '[]',
        averageRating FLOAT DEFAULT 0
      )
    `;
    db.query(createStoreUsersTable, (err) => {
      if (err) console.error('Failed to create storeusers table:', err);
      else console.log('StoreUsers table is ready.');
    });
  }
});



module.exports = db;
