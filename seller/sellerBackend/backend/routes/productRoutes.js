import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getUserProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { isSeller } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

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
