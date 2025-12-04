import express from "express";
import {
  handleMomoIPN,
  paymentMomo,
  // paymentMomoResult,
  // updatePaymentMomoStatus,
} from "./paymentControllers.js";

const router = express.Router();
router.post("/momo/create", paymentMomo);
router.post("/momo/ipn", handleMomoIPN);
// router.get("/momo/redirect", paymentMomoResult);
// router.post("/pay/success", updatePaymentMomoStatus);

export default router;
