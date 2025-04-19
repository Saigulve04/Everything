import express from "express";
import {
  createSellerProfile,
  getSellerProfile,
  updateSellerProfile,
  getSellerProducts,
  getSellerStats,
} from "../controllers/sellerController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { isSeller } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create seller profile
router.post("/profile", authenticateToken, createSellerProfile);

// Get seller profile
router.get("/profile", authenticateToken, isSeller, getSellerProfile);

// Update seller profile
router.put("/profile", authenticateToken, isSeller, updateSellerProfile);

// Get seller's products
router.get("/products", authenticateToken, isSeller, getSellerProducts);

// Get seller statistics
router.get("/stats", authenticateToken, isSeller, getSellerStats);

export default router; 