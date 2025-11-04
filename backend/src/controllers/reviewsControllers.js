import Book from "../../model/Book.js";
import Review from "../../model/Review.js";

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user")
      .populate("book", "title")
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.log("getAllReviews Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const getReviewsByBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book review not found" });
    }
    const reviews = await Review.find({ book: id })
      .populate("user", "name")
      .populate("book", "title")
      .sort({ createdAt: -1 });

    if (reviews.length === 0) {
      return res.status(200).json({ message: `Book ${book.title} has no reviews yet` });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.log("getReviewsByBook Failed:", error);
    res.status(500).json({ message: "System error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    const bookId = review.book;
    const remainingReviews = await Review.find({ book: bookId });

    const newReviewCount = remainingReviews.length;
    const newRating =
      newReviewCount > 0
        ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) / newReviewCount
        : 0;

    await Book.findByIdAndUpdate(bookId, {
      reviewCount: newReviewCount,
      rating: newRating.toFixed(2),
    });

    res.status(200).json({ message: "Review deleted successfully", review });
  } catch (error) {
    console.log("deleteReview Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const createReview = async (req, res) => {
  try {
    const { user, book, rating, comment } = req.body;
    if (!user || !book || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const existingReview = await Review.findOne({ user, book });
    if (existingReview) {
      return res.status(400).json({ message: "User already reviewed this book" });
    }

    const review = new Review({ user, book, rating, comment });
    const newReview = await review.save();
    const populatedReview = await newReview.populate("user").populate("book", "title");
    const allReviews = await Review.find({ book });
    const newReviewCount = allReviews.length;
    const newRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / newReviewCount;

    await Book.findByIdAndUpdate(book, {
      reviewCount: newReviewCount,
      rating: newRating.toFixed(2),
    });
    res.status(201).json(populatedReview);
  } catch (error) {
    console.log("createReview Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};
