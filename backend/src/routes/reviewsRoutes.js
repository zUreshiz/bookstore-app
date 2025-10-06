import express from "express";

import {
  getAllReviews,
  deleteReview,
  createReview,
} from "../controllers/reviewsControllers.js";

const router = express.Router();

router.get("/", getAllReviews);

router.delete("/:id", deleteReview);

router.post("/", createReview);

export default router;
