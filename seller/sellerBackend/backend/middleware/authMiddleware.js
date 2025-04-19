import jwt from "jsonwebtoken";
import pool from "../db.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user exists in database
    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [decoded.id]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = users[0];
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}; 