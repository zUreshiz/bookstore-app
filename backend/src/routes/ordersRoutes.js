import express from "express";

import {
  getAllOrders,
  getOrderById,
  deleteOrder,
  createOrder,
  updateOrder,
  getOrdersByUser,
  getMyOrders,
  getOrderPaymentStatus,
} from "../controllers/ordersControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

import { adminMiddleware } from "../middlewares/adminMiddleware.js";
const router = express.Router();

router.get("/", verifyToken, adminMiddleware, getAllOrders);

router.get("/my-orders", verifyToken, getMyOrders);

router.get("/user/:userId", verifyToken, getOrdersByUser);

router.get("/:id/payment-status", getOrderPaymentStatus);

router.get("/:id", verifyToken, getOrderById);

router.delete("/:id", verifyToken, adminMiddleware, deleteOrder);

router.post("/", verifyToken, createOrder);

router.put("/:id", verifyToken, updateOrder);

export default router;
