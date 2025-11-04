import mongoose from "mongoose";

// Danh sách thể loại
export const validCategories = [
  "Fiction", // Tiểu thuyết
  "Romance", // Tình cảm
  "Fantasy", // Giả tưởng
  "Science Fiction", // Khoa học viễn tưởng
  "Mystery", // Trinh thám
  "Thriller", // Hồi hộp, kịch tính
  "Horror", // Kinh dị
  "History", // Lịch sử
  "Biography", // Tiểu sử, hồi ký
  "Self-help", // Phát triển bản thân
  "Business", // Kinh doanh
  "Economics", // Kinh tế
  "Technology", // Công nghệ
  "Psychology", // Tâm lý học
  "Philosophy", // Triết học
  "Education", // Giáo dục
  "Art", // Nghệ thuật
  "Health & Fitness", // Sức khỏe & thể hình
  "Children", // Thiếu nhi
  "Comics", // Truyện tranh / Manga
];

export const allowedFields = [
  "title",
  "author",
  "description",
  "category",
  "price",
  "stock",
  "coverImage",
  "rating",
  "publishedDate",
  "isOnSale",
  "salePrice",
  "discountPercent",
  "saleEndsAt",
];

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      required: true,
      enum: validCategories,
    },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    coverImage: { type: String },
    rating: { type: Number, default: 0 },
    publishedDate: { type: Date },
    reviewCount: { type: Number, default: 0, min: 0 },
    isOnSale: { type: Boolean, default: false, index: true },
    salePrice: { type: Number },
    discountPercent: { type: Number, min: 0, max: 100 },
    saleEndsAt: { type: Date },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
