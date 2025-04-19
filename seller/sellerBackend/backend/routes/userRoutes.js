import express from "express";
import { getUser, updateBankDetails, getBankDetails } from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", auth, getUser);
router.post("/bank-details", auth, updateBankDetails);
router.get("/bank-details/:userId", auth, getBankDetails);

export default router;
