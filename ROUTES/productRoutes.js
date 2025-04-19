import express from 'express';
import { authenticateToken } from '../FUNCTION/authMiddleware.js';
import { isSeller } from '../FUNCTION/roleMiddleware.js';
import upload from '../FUNCTION/uploadMiddleware.js';
import {
  createProduct,
  getAllProducts,
  getProductById,
  getUserProducts,
  updateProduct,
  deleteProduct,
} from '../FUNCTION/productController.js';

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Seller routes (protected)
router.post("/", authenticateToken, isSeller, upload.single("image"), createProduct);
router.get("/user/products", authenticateToken, isSeller, getUserProducts);
router.put("/:id", authenticateToken, isSeller, upload.single("image"), updateProduct);
router.delete("/:id", authenticateToken, isSeller, deleteProduct);

export default router; 