// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "everything_seller",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection without blocking
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL database ✅");
    connection.release();
  } catch (err) {
    console.error("MySQL connection error:", err);
  }
};

testConnection();

export default pool;