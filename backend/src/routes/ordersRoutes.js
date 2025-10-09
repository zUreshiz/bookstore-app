import express from "express";

import {
  getAllOrders,
  getOrderById,
  deleteOrder,
  createOrder,
  updateOrder,
  getOrdersByUser,
} from "../controllers/ordersControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

import { adminMiddleware } from "../middlewares/adminMiddleware.js";
const router = express.Router();

router.get("/", verifyToken, adminMiddleware, getAllOrders);

router.get("/:id", verifyToken, getOrderById);

router.get("/user/:userId", verifyToken, adminMiddleware, getOrdersByUser);

router.delete("/:id", verifyToken, adminMiddleware, deleteOrder);

router.post("/", verifyToken, createOrder);

router.put("/:id", verifyToken, updateOrder);

export default router;
