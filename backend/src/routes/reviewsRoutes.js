import express from "express";

import {
  getAllReviews,
  deleteReview,
  createReview,
  getReviewsByBook,
} from "../controllers/reviewsControllers.js";

const router = express.Router();

router.get("/", getAllReviews);

router.get("/:id", getReviewsByBook);

router.delete("/:id", deleteReview);

router.post("/", createReview);

export default router;
