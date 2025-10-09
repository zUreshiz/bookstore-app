import express from "express";

import {
  getAllBooks,
  getBookById,
  deleteBook,
  updateBook,
  addBook,
} from "../controllers/booksControllers.js";

import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllBooks);

router.get("/:id", verifyToken, getBookById);

router.post("/", verifyToken, adminMiddleware, addBook);

router.put("/:id", verifyToken, adminMiddleware, updateBook);

router.delete("/:id", verifyToken, adminMiddleware, deleteBook);

export default router;
