import mongoose from "mongoose";
import User from "./User.js";
import Book from "./Book.js";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    //   Sau này nên thêm ảnh
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
