import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    coverImage: { type: String },
    rating: { type: Number, default: 0 },
    publishedDate: { type: Date },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
