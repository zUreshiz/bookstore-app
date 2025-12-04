import Book from "../../model/Book.js";
import Cart from "../../model/Cart.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.book");

    if (!cart) {
      return res.status(404).json({ message: "Cart is empty", items: [] });
    }
    return res.status(200).json({
      items: cart.items,
      cartId: cart._id,
    });
  } catch (error) {
    console.log("getCart Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId, quantity } = req.body;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    const maxStock = book.stock || 0;
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // --- TRƯỜNG HỢP 1: USER CHƯA CÓ GIỎ HÀNG ---

      // Kiểm tra ngay xem số lượng mua có lớn hơn tồn kho không
      if (quantity > maxStock) {
        return res
          .status(400)
          .json({ message: `Only ${maxStock} items available in stock` });
      }
      cart = new Cart({
        user: userId,
        items: [{ book: bookId, quantity }],
      });
    } else {
      // --- TRƯỜNG HỢP 2: USER ĐÃ CÓ GIỎ HÀNG ---
      const existingItemIndex = cart.items.findIndex(
        (item) => item.book.toString() === bookId
      );
      if (existingItemIndex > -1) {
        // A. Sản phẩm ĐÃ CÓ trong giỏ -> Cộng dồn số lượng
        const currentQuantity = cart.items[existingItemIndex].quantity;
        const newQuantity = currentQuantity + quantity;

        // === CHỐT CHẶN QUAN TRỌNG ===
        // Kiểm tra: Số lượng đang có + Số lượng muốn thêm > Tồn kho không?
        if (newQuantity > maxStock) {
          return res.status(400).json({
            message: `Cannot add. You have ${currentQuantity} in cart, stock is ${maxStock}.`,
          });
        }

        cart.items[existingItemIndex].quantity = newQuantity;
      } else {
        // B. Sản phẩm CHƯA CÓ trong giỏ -> Thêm mới vào mảng items

        // Cũng phải kiểm tra stock
        if (quantity > maxStock) {
          return res
            .status(400)
            .json({ message: `Only ${maxStock} items available in stock` });
        }

        cart.items.push({ book: bookId, quantity });
      }
    }

    await cart.save();
    await cart.populate("items.book");

    return res.status(200).json({ items: cart.items });
  } catch (error) {
    console.log("addToCart Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.book.toString() !== bookId);

    await cart.save();
    await cart.populate("items.book");

    return res.status(200).json({ items: cart.items });
  } catch (error) {
    console.log("removeFromCart Failed: ", error);
    res.status(500).json({ message: "System" });
  }
};

export const decreaseQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.book.toString() === bookId);

    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    if (item.quantity > 1) {
      item.quantity = item.quantity - 1;
    } else {
      cart.items = cart.items.filter((item) => item.book.toString() !== bookId);
    }

    await cart.save();
    await cart.populate("items.book");

    return res.status(200).json({ items: cart.items });
  } catch (error) {
    console.log("decreaseQuantity Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};
