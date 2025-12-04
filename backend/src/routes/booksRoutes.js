import express from "express";

import {
  getAllBooks,
  getBookById,
  deleteBook,
  updateBook,
  addBook,
  getBooksSale,
  getTopBooks,
  getBookByName,
} from "../controllers/booksControllers.js";

import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { validateBookInput } from "../utils/validateBookInput.js";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/sale", getBooksSale);
router.get("/top", getTopBooks);
router.get("/:id", getBookById);
router.get("/name/:name", getBookByName);

router.post(
  "/",
  // verifyToken,
  // adminMiddleware,
  validateRequest(validateBookInput),
  addBook
);

router.put(
  "/:id",
  // verifyToken,
  // adminMiddleware,
  validateRequest((data) => validateBookInput(data, true)),
  updateBook
);

router.delete("/:id", verifyToken, adminMiddleware, deleteBook);

export default router;
