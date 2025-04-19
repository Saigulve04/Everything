const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Main application database pool
const mainPool = mysql.createPool({
  host: process.env.MAIN_DB_HOST,
  user: process.env.MAIN_DB_USER,
  password: process.env.MAIN_DB_PASSWORD,
  database: process.env.MAIN_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Seller application database pool
const sellerPool = mysql.createPool({
  host: process.env.SELLER_DB_HOST,
  user: process.env.SELLER_DB_USER,
  password: process.env.SELLER_DB_PASSWORD,
  database: process.env.SELLER_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test both connections
const testConnections = async () => {
  try {
    // Test main database connection
    const mainConnection = await mainPool.getConnection();
    console.log("Connected to main database ✅");
    mainConnection.release();

    // Test seller database connection
    const sellerConnection = await sellerPool.getConnection();
    console.log("Connected to seller database ✅");
    sellerConnection.release();
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

// Initialize databases
const initializeDatabases = async () => {
  try {
    // Create seller database tables
    await sellerPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'seller', 'admin') DEFAULT 'user',
        store_name VARCHAR(255),
        store_description TEXT,
        address TEXT,
        phone VARCHAR(20),
        rating DECIMAL(3,2) DEFAULT 0,
        total_sales INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await sellerPool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(255),
        user_id INT NOT NULL,
        category VARCHAR(100),
        status ENUM('active', 'inactive', 'sold') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log("Databases initialized successfully ✅");
  } catch (error) {
    console.error("Error initializing databases:", error);
    process.exit(1);
  }
};

// Test connections on startup
testConnections();

module.exports = {
  mainPool,
  sellerPool,
  initializeDatabases
}; 