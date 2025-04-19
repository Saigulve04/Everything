import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../db.js";
import mysql from "mysql2/promise"; 

dotenv.config();

const router = express.Router();

// Create MySQL pool for better connection management
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined in the .env file!");
  process.exit(1);
}

// Input validation middleware
const validateRegisterInput = (req, res, next) => {
  const { name, email, password } = req.body;
  
  // Check required fields
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format!" });
  }

  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long!" });
  }

  next();
};

// Register User
router.post("/register", async (req, res) => {
  const { name, email, password, contact, company } = req.body;
  
  try {
    // Input validation
    if (!name || !email || !password || !contact) {
      return res.status(400).json({ 
        error: "Required fields missing",
        required: ["name", "email", "password", "contact"],
        received: { name, email, contact, company }
      });
    }

    // Get connection from pool
    const connection = await pool.getConnection();

    try {
      // Check if user exists
      const [users] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (users.length > 0) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const [result] = await connection.query(
        `INSERT INTO users (name, email, password, contact, company) 
         VALUES (?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, contact, company || null]
      );

      // Generate JWT token
      const token = jwt.sign(
        { id: result.insertId },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(201).json({
        message: "Registration successful",
        token,
        user: {
          id: result.insertId,
          name,
          email,
          contact
        }
      });
    } finally {
      // Always release the connection back to the pool
      connection.release();
    }
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle specific MySQL errors
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Email already registered" });
    }
    
    res.status(500).json({ 
      error: "Registration failed",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const connection = await pool.getConnection();

    try {
      const [users] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (users.length === 0) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          contact: user.contact
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Test users table structure
router.get("/test-table", (req, res) => {
  const query = "DESCRIBE users";
  pool.getConnection().then(connection => {
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Error checking table structure" });
      }
      res.json({ tableStructure: results });
      connection.release();
    });
  }).catch(err => {
    console.error("Error getting connection:", err);
    res.status(500).json({ error: "Error checking table structure" });
  });
});

export default router;
