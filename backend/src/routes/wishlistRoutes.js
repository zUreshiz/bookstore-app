import express from "express";
import {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlistControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getMyWishlist);
router.post("/:bookId", verifyToken, addToWishlist);
router.delete("/:bookId", verifyToken, removeFromWishlist);

export default router;
