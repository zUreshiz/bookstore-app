import Order from "../../model/Order.js";
import Book from "../../model/Book.js";
import User from "../../model/User.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.log("getAllOrders Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    console.log("getOrderById Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deleteOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deleteOrder) {
      return res.status(404).json({ message: "Order not found" });
    } else {
      res.status(200).json(deleteOrder);
    }
  } catch (error) {
    console.log("deleteOrder Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let totalAmount = 0;
    let orderedItems = [];

    // Check book trong ỏder
    for (const item of items) {
      const book = await Book.findById(item.book);
      if (!book) {
        return res.status(404).json({ message: `Book ${item.book} not found` });
      }
      // Kiểm tra stock của sách
      if (book.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for book: ${book.title}` });
      }

      // Trừ stock và tính tiền
      book.stock = book.stock - item.quantity;
      await book.save();

      totalAmount = totalAmount + book.price * item.quantity;

      orderedItems.push({
        book: book._id,
        quantity: item.quantity,
        price: book.price,
      });
    }

    const order = new Order({
      user: userId,
      items: orderedItems,
      totalAmount,
      shippingAddress,
    });

    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.log("createOrder Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id).populate("items.book");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Xử lý đơn hàng hoàn thành hoặc bị hủy
    if (["completed", "cancelled"].includes(order.status)) {
      return res
        .status(400)
        .json({ message: `Can not update order that is already ${order.status}` });
    }

    // Hoàn trả số lượng sách từ đơn hàng về lại stock
    if (status === "canceled") {
      for (const item of order.items) {
        const book = await Book.findById(item.book._id);
        if (book) {
          book.stock = book.stock + item.quantity;
          await book.save();
        }
      }
    }

    order.status = order.status || status;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.log("updateOrder Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Get all order của user và populate thông tin sách
    const order = await Order.find({ user: userId }).populate("items.book").sort({
      createdAt: -1,
    });

    res.status(200).json(order);
  } catch (error) {
    console.log("getOrdersByUser Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};
