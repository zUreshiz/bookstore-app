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

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    } else {
      res.status(200).json(review);
    }
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
    res.status(201).json(populatedReview);
  } catch (error) {
    console.log("createReview Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};
