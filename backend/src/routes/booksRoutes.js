import express from "express";

import {
  getAllBooks,
  getBookById,
  deleteBook,
  updateBook,
  addBook,
  getBooksSale,
} from "../controllers/booksControllers.js";

import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { validateBookInput } from "../utils/validateBookInput.js";

const router = express.Router();

router.get("/", verifyToken, getAllBooks);
router.get("/sale", verifyToken, getBooksSale);

router.get("/:id", verifyToken, getBookById);

router.post(
  "/",
  verifyToken,
  adminMiddleware,
  validateRequest(validateBookInput),
  addBook
);

router.put(
  "/:id",
  verifyToken,
  adminMiddleware,
  validateRequest((data) => validateBookInput(data, true)),
  updateBook
);

router.delete("/:id", verifyToken, adminMiddleware, deleteBook);

export default router;
