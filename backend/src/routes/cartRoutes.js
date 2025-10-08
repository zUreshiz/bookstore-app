import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  decreaseQuantity,
} from "../controllers/cartControllers.js";

const router = express.Router();

router.get("/", getCart);

router.post("/add", addToCart);

router.patch("/decrease/:bookId", decreaseQuantity);

router.delete("/remove/:bookId", removeFromCart);

export default router;
