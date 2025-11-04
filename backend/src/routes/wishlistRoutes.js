import express from "express";
import {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me/wishlist", authMiddleware, getMyWishlist);
router.post("/me/wishlist/:bookId", authMiddleware, addToWishlist);
router.delete("/me/wishlist/:bookId", authMiddleware, removeFromWishlist);

export default router;
