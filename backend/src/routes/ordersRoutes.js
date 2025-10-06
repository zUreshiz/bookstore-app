import express from "express";

import {
  getAllOrders,
  getOrderById,
  deleteOrder,
  createOrder,
  updateOrder,
  getOrdersByUser,
} from "../controllers/ordersControllers.js";

const router = express.Router();

router.get("/", getAllOrders);

router.get("/:id", getOrderById);

router.get("/user/:userId", getOrdersByUser);

router.delete("/:id", deleteOrder);

router.post("/", createOrder);

router.put("/:id", updateOrder);

export default router;
