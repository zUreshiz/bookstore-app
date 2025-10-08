import Book from "../../model/Book.js";

const allowedFields = [
  "title",
  "author",
  "description",
  "category",
  "price",
  "stock",
  "coverImage",
  "rating",
  "publishedDate",
];

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.log("getAllBooks Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    console.log("getBookById failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      return res.status(200).json(book);
    }
  } catch (error) {
    console.log("deleteBook Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const updateBook = async (req, res) => {
  try {
    const filteredData = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    if (Object.keys(filteredData).length === 0) {
      return res.status(400).json({ message: "No valid fields provided to update" });
    }

    if (filteredData.title) {
      const existBook = await Book.findOne({ title: filteredData.title });
      if (existBook && existBook._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "Book title already exists" });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, filteredData, {
      new: true,
    });

    if (!updatedBook) {
      res.status(404).json({ message: "Book not found" });
    } else {
      res.status(200).json(updatedBook);
    }
  } catch (error) {
    console.log("updateBook Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const addBook = async (req, res) => {
  try {
    const filteredData = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    if (filteredData.title) {
      const existBook = await Book.findOne({ title: filteredData.title });
      if (existBook) {
        return res.status(400).json({ message: "Book title already exists" });
      }
    }

    const book = new Book(filteredData);
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.log("addBook Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};
