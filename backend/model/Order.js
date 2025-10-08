import mongoose from "mongoose";
import User from "./User.js";
import Book from "./Book.js";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },

    items: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Book,
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cod", "credit_card"],
      default: "code",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipping", "completed", "cancelled"],
      default: "pending",
    },
    shippingAddress: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
