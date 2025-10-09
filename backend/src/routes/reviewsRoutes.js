import express from "express";

import {
  getAllReviews,
  deleteReview,
  createReview,
  getReviewsByBook,
} from "../controllers/reviewsControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllReviews);

router.get("/:id", verifyToken, getReviewsByBook);

router.delete("/:id", verifyToken, adminMiddleware, deleteReview);

router.post("/", verifyToken, createReview);

export default router;
