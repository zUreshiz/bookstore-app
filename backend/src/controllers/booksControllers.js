import Book, { validCategories, allowedFields } from "../../model/Book.js";

const handleSaleFields = (data) => {
  if (data.isOnSale) {
    // Nếu bật sale nhưng không có salePrice, tự tính từ discountPercent
    if (!data.salePrice && data.discountPercent && data.price) {
      data.salePrice = Number((data.price * (1 - data.discountPercent / 100)).toFixed(2));
    }

    // Nếu có salePrice nhưng không có discountPercent thì tự tính ngược lại
    if (data.salePrice && data.price && !data.discountPercent) {
      data.discountPercent = Number(
        (((data.price - data.salePrice) / data.price) * 100).toFixed(2)
      );
    }

    // Nếu chưa có ngày kết thúc sale → mặc định 7 ngày kể từ hôm nay
    if (!data.saleEndsAt) {
      const sevenDaysLater = new Date();
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
      data.saleEndsAt = sevenDaysLater;
    }
  } else {
    // Nếu không bật sale → xóa thông tin sale
    data.salePrice = undefined;
    data.discountPercent = undefined;
    data.saleEndsAt = undefined;
  }

  return data;
};

export const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const { category, minPrice, maxPrice, rating, sort } = req.query;

    let filter = {};

    if (category) {
      const catArray = category.split(",");
      filter.category = { $in: catArray };
    }

    // Lọc theo Giá
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Lọc theo Rating
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    // 3. Xây dựng Sắp xếp (Sort)
    let sortOption = {};
    switch (sort) {
      case "price_asc": // Giá thấp -> cao
        sortOption.price = 1;
        break;
      case "price_desc": // Giá cao -> thấp
        sortOption.price = -1;
        break;
      case "newest": // Mới nhất
        sortOption.createdAt = -1;
        break;
      case "rating": // Đánh giá cao
        sortOption.rating = -1;
        break;
      default: // Mặc định phổ biến nhất (hoặc theo reviewCount)
        sortOption.reviewCount = -1;
    }

    // 4. Tính toán Phân trang
    const skip = (page - 1) * limit;

    // 5. Query Database
    // Chạy song song: Lấy danh sách sách + Đếm tổng số lượng (để biết có bao nhiêu trang)
    const [books, totalBooks] = await Promise.all([
      Book.find(filter).sort(sortOption).skip(skip).limit(limit),
      Book.countDocuments(filter),
    ]);

    // 6. Trả về kết quả kèm Metadata phân trang
    res.status(200).json({
      data: books,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBooks / limit),
        totalItems: totalBooks,
        limit,
      },
    });
  } catch (error) {
    console.log("getAllBooks Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const getBooksSale = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const now = new Date();

    const filter = {
      isOnSale: true,
      saleEndsAt: { $gte: now },
    };

    const [booksOnSale, totalBooks] = await Promise.all([
      Book.find(filter).skip(skip).limit(limit),
      Book.countDocuments(filter),
    ]);

    res.status(200).json({
      data: booksOnSale,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBooks / limit),
        totalItems: totalBooks,
        limit,
      },
    });
  } catch (error) {
    console.log("getBooksSale Failed: ", error);
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
      return res.status(200).json({ message: "Book deleted successfully", book });
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

    if (filteredData.category) {
      // Chỉ kiểm tra nếu category được cung cấp
      if (!Array.isArray(filteredData.category)) {
        return res.status(400).json({ message: "Category must be an array" });
      }

      // Nếu gửi mảng rỗng thì cũng là không hợp lệ (nếu bạn muốn cho phép, hãy bỏ check .length)
      if (filteredData.category.length === 0) {
        return res.status(400).json({ message: "Category array cannot be empty" });
      }

      const invalidCats = filteredData.category.filter(
        (cat) => !validCategories.includes(cat)
      );

      if (invalidCats.length > 0) {
        return res
          .status(400)
          .json({ message: `Invalid categories: ${invalidCats.join(", ")}` });
      }
    }

    if (filteredData.title) {
      const existBook = await Book.findOne({ title: filteredData.title });
      if (existBook && existBook._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "Book title already exists" });
      }
    }

    handleSaleFields(filteredData);

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

    if (
      !filteredData.category ||
      !Array.isArray(filteredData.category) ||
      filteredData.category.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Category is required and must be a non-empty array" });
    }

    const invalidCats = filteredData.category.filter(
      (cat) => !validCategories.includes(cat)
    );

    if (invalidCats.length > 0) {
      return res
        .status(400)
        .json({ message: `Invalid categories: ${invalidCats.join(", ")}` });
    }

    //  lưu lại admin tạo sách:
    // filteredData.createdBy = req.user?._id;

    handleSaleFields(filteredData);

    const book = new Book(filteredData);
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.log("addBook Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const getTopBooks = async (req, res) => {
  try {
    const [topSaleBooks, topSoldBooks, newBooks] = await Promise.all([
      Book.find({ isOnSale: true }).sort({ reviewCount: -1 }).limit(4).exec(),
      Book.find({ isOnSale: false }).sort({ reviewCount: -1 }).limit(8).exec(),
      Book.find().sort({ createdAt: -1 }).limit(8).exec(),
    ]);
    res.json({ topSaleBooks, topSoldBooks, newBooks });
  } catch (error) {
    console.log("getTopBooks Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const getBookByName = async (req, res) => {
  try {
    const bookName = req.params.name;

    const decodedName = decodeURIComponent(bookName);

    const book = await Book.findOne({
      title: { $regex: new RegExp(`^${decodedName}$`, "i") },
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.log("getBookByName failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};
