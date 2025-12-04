import Coupon from "../../model/Coupon.js";

export const createCoupon = async (req, res) => {
  try {
    const { nameCoupon, discountPercent, quantity, startDate, endDate } = req.body;

    if (!nameCoupon || !discountPercent || !quantity || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (nameCoupon.trim() === "") {
      return res.status(400).json({ message: "Coupon name cannot be empty" });
    }

    if (nameCoupon.length > 50) {
      return res.status(400).json({ message: "Coupon name cannot exceed 50 characters" });
    }

    if (discountPercent < 0 || discountPercent > 100) {
      return res
        .status(400)
        .json({ message: "Discount percent must be between 0 and 100" });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity must be a non-negative number" });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "Start date must be before end date" });
    }

    const newCoupon = new Coupon({
      nameCoupon,
      discountPercent,
      quantity,
      startDate,
      endDate,
    });

    const savedCoupon = await newCoupon.save();
    res.status(201).json(savedCoupon);
  } catch (error) {
    console.log("createCoupon failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    console.log("getCoupons failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const coupon = await Coupon.findByIdAndDelete(couponId);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.log("deleteCoupon failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const { nameCoupon, discountPercent, quantity, startDate, endDate } = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      { nameCoupon, discountPercent, quantity, startDate, endDate },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json(updatedCoupon);
  } catch (error) {
    console.log("updateCoupon failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};
