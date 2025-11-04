import User from "../../model/User.js";
import Book from "../../model/Book.js";
import mongoose from "mongoose";

export const getMyWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "wishlist.book",
      select: "title author coverImage price salePrice isOnSale",
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "System error" });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    if (!mongoose.Types.ObjectId.isValid(bookId))
      return res.status(400).json({ message: "Invalid book id" });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const user = await User.findById(req.user._id);

    const exists = user.wishlist.some((item) => item.book.toString() === bookId);
    if (exists) {
      return res.status(200).json({ message: "Already in wishlist" });
    }

    const MAX = 500;
    if (user.wishlist.length >= MAX) {
      return res.status(400).json({ message: `Wishlist limit reached (${MAX})` });
    }

    user.wishlist.push({ book: book._id });
    await user.save();

    res.status(201).json({ message: "Added to wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "System error" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const user = await User.findById(req.user._id);
    const before = user.wishlist.length;
    user.wishlist = user.wishlist.filter((item) => item.book.toString() !== bookId);
    if (user.wishlist.length === before) {
      return res.status(404).json({ message: "Book not in wishlist" });
    }
    await user.save();
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "System error" });
  }
};
