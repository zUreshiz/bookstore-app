import Order from "../../model/Order.js";
import Book from "../../model/Book.js";
import User from "../../model/User.js";
import Cart from "../../model/Cart.js";

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
    const order = await Order.findById(req.params.id).populate("items.book");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "admin" && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
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
    const userId = req.user._id;
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("items.book");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    let orderedItems = [];

    // Check book trong order
    for (const item of cart.items) {
      const book = await Book.findById(item.book._id);
      if (!book) {
        return res.status(404).json({ message: `Book ${item.book} not found` });
      }

      // Kiểm tra stock của sách
      if (book.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for book: ${book.title}` });
      }

      // --- BẮT ĐẦU SỬA LOGIC GIÁ ---
      const now = new Date();
      // Kiểm tra: Đang bật sale VÀ Ngày kết thúc sale lớn hơn hiện tại
      const isSaleValid =
        book.isOnSale && book.saleEndsAt && new Date(book.saleEndsAt) > now;

      // Nếu hợp lệ thì lấy giá sale, còn không thì lấy giá gốc
      const actualPrice = isSaleValid ? book.salePrice : book.price;
      // --- KẾT THÚC SỬA LOGIC GIÁ ---

      // Trừ stock
      book.stock = book.stock - item.quantity;
      await book.save();

      // Tính tổng tiền dựa trên GIÁ THỰC TẾ (actualPrice)
      totalAmount = totalAmount + actualPrice * item.quantity;

      orderedItems.push({
        book: book._id,
        quantity: item.quantity,
        price: actualPrice, // Lưu giá thực tế vào database
      });
    }

    const order = new Order({
      user: userId,
      items: orderedItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    const newOrder = await order.save();

    // Xóa giỏ hàng sau khi tạo đơn thành công
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Create order successfully",
      order: newOrder,
      orderId: order._id,
    });
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

    if (req.user.role !== "admin" && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Xử lý đơn hàng hoàn thành hoặc bị hủy
    if (["completed", "cancelled"].includes(order.status)) {
      return res
        .status(400)
        .json({ message: `Can not update order that is already ${order.status}` });
    }

    if (req.user.role !== "admin" && status !== "cancelled") {
      return res.status(403).json({ message: "Only admin can change status order" });
    }

    // Hoàn trả số lượng sách từ đơn hàng về lại stock
    if (status === "cancelled") {
      for (const item of order.items) {
        const book = await Book.findById(item.book._id);
        if (book) {
          book.stock = book.stock + item.quantity;
          await book.save();
        }
      }
    }

    order.status = status;
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
    if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

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

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("items.book")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.log("getMyOrders Failed: ", error);
    res.status(500).json({ message: "System error" });
  }
};

export const getOrderPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      orderId: order._id,
      isPaid: order.isPaid,
      paidAt: order.paidAt || null,
      paymentMethod: order.paymentMethod,
      paymentResult: order.paymentResult || null,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
