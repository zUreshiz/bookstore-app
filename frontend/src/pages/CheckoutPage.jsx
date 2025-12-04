import React, { useState } from "react";
import { useLocation, useNavigate, Navigate, Link } from "react-router";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useCart } from "../hooks/useCart";

// Icons
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
  FaMoneyBillWave,
  FaCreditCard,
  FaWallet,
} from "react-icons/fa";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  // Lấy dữ liệu items từ trang Cart
  const { items } = location.state || {};

  // State form
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    note: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  // Redirect nếu không có items
  if (!items || items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  // --- TÍNH TOÁN LẠI TỔNG TIỀN (Bỏ qua phí ship) ---
  const cartTotal = items.reduce((acc, item) => {
    const price = item.book.isOnSale ? item.book.salePrice : item.book.price;
    return acc + price * item.quantity;
  }, 0);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Submit Order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        orderItems: items.map((item) => ({
          book: item.book._id,
          quantity: item.quantity,
          price: item.book.isOnSale ? item.book.salePrice : item.book.price,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        },
        paymentMethod: paymentMethod, // 'cod' or 'momo'
        itemsPrice: cartTotal,
        shippingPrice: 0,
        totalPrice: cartTotal,
        note: formData.note,
      };

      // 1. Tạo đơn hàng trước
      const res = await api.post("/orders", orderData);

      if (res.status === 201 || res.status === 200) {
        const newOrderId = res.data.orderId; // Lấy ID đơn vừa tạo
        await fetchCart(); // Cart lúc này sẽ về 0

        if (paymentMethod === "momo") {
          // Gọi API lấy link thanh toán
          const momoRes = await api.post("/payment/momo/create", { orderId: newOrderId });

          if (momoRes.data && momoRes.data.payUrl) {
            // Chuyển hướng sang Momo
            window.location.href = momoRes.data.payUrl;
          }
          // QUAN TRỌNG: Dù redirect hay chưa, hãy nhớ rằng đơn hàng ĐÃ TẠO.
          // Nếu user cancel ở màn hình Momo, họ sẽ quay lại đâu?
          // Bạn cần cấu hình redirectUrl của Momo trỏ về trang Order Detail hoặc Result
        } else {
          navigate(`/order-success/${newOrderId}`);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to place order");
      setLoading(false); // Chỉ tắt loading khi lỗi, nếu thành công để loading chạy đến khi redirect
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* --- BREADCRUMB --- */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-blue-600 transition">
            Shopping Cart
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- LEFT COLUMN: FORM --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Shipping Address */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600" /> Shipping Details
              </h2>

              <form
                id="checkout-form"
                onSubmit={handlePlaceOrder}
                className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <FaPhoneAlt className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Your phone"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City / Province
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Your city living"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Your address"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note (Optional)
                  </label>
                  <textarea
                    name="note"
                    rows="2"
                    value={formData.note}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Notes about your order..."></textarea>
                </div>
              </form>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                <FaCreditCard className="text-blue-600" /> Payment Method
              </h2>
              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-200"
                  }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 flex items-center gap-2">
                        <FaMoneyBillWave className="text-green-500" /> Cash on Delivery
                        (COD)
                      </span>
                      <span className="text-sm text-gray-500">
                        Pay when you receive the package
                      </span>
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${
                    paymentMethod === "momo"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-pink-200"
                  }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="momo" // Đổi value thành momo
                      checked={paymentMethod === "momo"}
                      onChange={() => setPaymentMethod("momo")}
                      className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 flex items-center gap-2">
                        <FaWallet className="text-pink-500" /> Momo e-Wallet
                      </span>
                      <span className="text-sm text-gray-500">
                        Scan QR Code via Momo App
                      </span>
                    </div>
                  </div>
                  {/* Logo Momo nhỏ (Optional) */}
                  <img
                    src="https://upload.wikimedia.org/wikipedia/vi/f/fe/Momo_Logo.png"
                    alt="Momo"
                    className="h-8 object-contain"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: SUMMARY --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

              <div className="max-h-[300px] overflow-y-auto mb-6 pr-2 space-y-4 custom-scrollbar">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="shrink-0">
                      <img
                        src={item.book.coverImage}
                        alt=""
                        className="w-14 h-20 object-cover rounded border border-gray-200"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-2">
                        {item.book.title}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1">{item.book.author}</p>
                      <div className="text-xs font-medium text-gray-500 bg-gray-100 inline-block px-2 py-1 rounded">
                        Quantity: {item.quantity}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      $
                      {(
                        (item.book.isOnSale ? item.book.salePrice : item.book.price) *
                        item.quantity
                      ).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* --- PHẦN TỔNG TIỀN ĐÃ SỬA --- */}
              <div className="border-t border-gray-200 pt-4 space-y-2 text-gray-600">
                {/* Đã xóa dòng Shipping */}

                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                  <span>Total</span>
                  <span className="text-blue-600">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className={`w-full mt-6 text-white font-bold py-3.5 rounded-lg shadow-lg transition flex justify-center items-center ${
                  paymentMethod === "momo"
                    ? "bg-pink-600 hover:bg-pink-700 shadow-pink-200" // Màu hồng cho Momo
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}>
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : paymentMethod === "momo" ? (
                  "Pay with Momo"
                ) : (
                  "Place Order"
                )}
              </button>

              <div className="mt-4 text-xs text-gray-400 text-center">
                By placing an order, you agree to our{" "}
                <a href="#" className="underline hover:text-blue-500">
                  Terms of Service
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
