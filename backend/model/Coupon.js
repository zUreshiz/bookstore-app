import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    nameCoupon: { type: String, required: true, unique: true },
    discountPercent: { type: Number, required: true, min: 0, max: 100 },
    quantity: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
