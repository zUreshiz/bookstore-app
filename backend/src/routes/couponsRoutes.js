import express from "express";

import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
} from "../controllers/couponControllers.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, adminMiddleware, getCoupons);

router.post("/create", verifyToken, adminMiddleware, createCoupon);

router.delete("/delete/:couponId", verifyToken, adminMiddleware, deleteCoupon);

router.put("/update/:couponId", verifyToken, adminMiddleware, updateCoupon);

export default router;
