import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  decreaseQuantity,
} from "../controllers/cartControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getCart);

router.post("/add", verifyToken, addToCart);

router.patch("/decrease/:bookId", verifyToken, decreaseQuantity);

router.delete("/remove/:bookId", verifyToken, removeFromCart);

export default router;
