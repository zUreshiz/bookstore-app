import Book from "../../model/Book.js";
import Cart from "../../model/Cart.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.book");

    if (!cart) {
      return res.status(404).json({ message: "Cart is empty", items: [] });
    }
    res.status(200).json(cart);
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

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ book: bookId, quantity }],
      });
    } else {
      const existingItem = cart.items.find((item) => item.book.toString() === bookId);
      if (existingItem) {
        existingItem.quantity = existingItem.quantity + 1;
      } else {
        cart.items.push({ book: bookId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
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

    const item = cart.items.find((item) => item.book.toString === bookId);

    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    if (item.quantity > 1) {
      item.quantity = item.quantity - 1;
    } else {
      cart.items = cart.items.filter((item) => item.book.toString() !== bookId);
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.log("decreaseQuantity Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};
