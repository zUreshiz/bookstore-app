import express from "express";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  refreshToken,
  logoutUser,
  requestPasswordReset,
  resetPassword,
} from "../controllers/usersControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { validateUserInput } from "../utils/validateUser.js";

const router = express.Router();

router.get("/", verifyToken, adminMiddleware, getAllUsers);

router.get("/:id", verifyToken, getUserById);

router.post(
  "/",
  verifyToken,
  adminMiddleware,
  validateRequest(validateUserInput),
  createUser
);

router.put("/:id", verifyToken, updateUser);

router.delete("/:id", verifyToken, adminMiddleware, deleteUser);

router.post("/login", loginUser);
router.post("/register", validateRequest(validateUserInput), createUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
