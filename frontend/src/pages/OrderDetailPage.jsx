import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import api from "../api/axios";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

// Icons
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
  FaCreditCard,
  FaBoxOpen,
  FaCheckCircle,
  FaTruck,
  FaClipboardList,
  FaExclamationTriangle,
  FaSpinner,
  FaMoneyBillWave,
  FaWallet, // Thêm icon ví cho nút Momo
} from "react-icons/fa";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // State cho các hành động
  const [cancelling, setCancelling] = useState(false);
  const [paying, setPaying] = useState(false); // State loading cho nút thanh toán
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --- 1. FETCH DATA ---
  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      console.error("Error fetching order detail:", error);
      toast.error("Could not load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // --- 2. XỬ LÝ HỦY ĐƠN ---
  const onConfirmCancel = async () => {
    setCancelling(true);
    try {
      const res = await api.put(`/orders/${id}`, { status: "cancelled" });
      if (res.status === 200) {
        toast.success("Order cancelled successfully");
        await fetchOrder();
        setShowConfirmModal(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  // --- 3. XỬ LÝ THANH TOÁN MOMO (MỚI) ---
  const handleRepayMomo = async () => {
    setPaying(true);
    try {
      // Gọi API Payment (Đảm bảo backend có route này)
      const res = await api.post("/payment/momo/create", { orderId: order._id });

      // Nếu backend trả về link, chuyển hướng người dùng
      if (res.data && res.data.payUrl) {
        window.location.href = res.data.payUrl;
      } else {
        toast.error("Failed to generate payment link");
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment connection failed");
    } finally {
      setPaying(false);
    }
  };

  // --- RENDERING ---
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order not found</h2>
        <Link to="/my-orders" className="text-blue-600 hover:underline">
          Back to My Orders
        </Link>
      </div>
    );
  }

  // Helpers
  const getStepStatus = (status) => {
    switch (status) {
      case "pending":
        return 1;
      case "processing":
        return 2;
      case "shipping":
        return 3;
      case "completed":
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = getStepStatus(order.status);
  const isCancelled = order.status === "cancelled";
  const shippingInfo = order.shippingAddress || {};
  const orderItems = order.items || [];

  return (
    <div className="bg-gray-50 min-h-screen py-10 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>{" "}
            /
            <Link to="/my-orders" className="hover:text-blue-600">
              My Orders
            </Link>{" "}
            /<span className="text-gray-900 font-medium">Order Detail</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              Order <span className="text-blue-600">#{order._id}</span>
            </h1>
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded border border-gray-200">
              Placed on {new Date(order.createdAt).toLocaleString("en-US")}
            </span>
          </div>
        </div>

        {/* Status Bar */}
        {!isCancelled ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
            {/* ... (Code Status Bar giữ nguyên như cũ) ... */}
            <div className="relative flex items-center justify-between w-full px-2 md:px-10">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-100 -z-0"></div>
              <div
                className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 -z-0 transition-all duration-700 ease-in-out"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}></div>
              {["Pending", "Processing", "Shipping", "Completed"].map((step, index) => {
                const isActive = currentStep >= index + 1;
                return (
                  <div
                    key={step}
                    className="relative z-10 flex flex-col items-center bg-white px-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 ${
                        isActive
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-gray-300 text-gray-300"
                      }`}>
                      {isActive ? <FaCheckCircle /> : index + 1}
                    </div>
                    <span
                      className={`mt-3 text-xs font-bold uppercase ${
                        isActive ? "text-blue-600" : "text-gray-400"
                      }`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 p-6 rounded-xl mb-8 flex items-center gap-4 text-red-700 shadow-sm">
            <div className="bg-red-100 p-3 rounded-full shrink-0">
              <FaClipboardList size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Order Cancelled</h3>
              <p className="text-sm opacity-80">This order has been cancelled.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2 border-b pb-3">
                <FaMapMarkerAlt className="text-blue-500" /> Shipping Address
              </h2>
              <div className="space-y-3 text-gray-600 text-sm">
                <p className="flex items-center gap-2">
                  <FaUser className="text-gray-400" />{" "}
                  <span className="font-semibold text-gray-900">
                    {shippingInfo.fullName}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <FaPhoneAlt className="text-gray-400" /> {shippingInfo.phone}
                </p>
                <p className="flex items-start gap-2">
                  <FaMapMarkerAlt className="text-gray-400 mt-1" /> {shippingInfo.address}
                  , {shippingInfo.city}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              {/* ... (Code hiển thị items giữ nguyên như cũ) ... */}
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2 border-b pb-3">
                <FaBoxOpen className="text-blue-500" /> Ordered Items
              </h2>
              <div className="space-y-6">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-20 h-28 bg-gray-100 rounded-md border border-gray-200 overflow-hidden shrink-0 relative">
                      {item.book?.coverImage ? (
                        <img
                          src={item.book.coverImage}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs">
                          No Img
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-gray-900 line-clamp-2">
                        {item.book?.title || "Unknown Book"}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Unit Price:{" "}
                        <span className="font-medium text-gray-700">
                          ${item.price.toFixed(2)}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Summary & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

              <div className="space-y-3 border-b border-gray-100 pb-5 mb-5 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Items Total</span>
                  <span className="font-medium text-gray-900">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>

                {/* Payment Method */}
                <div className="flex justify-between items-center pt-2">
                  <span>Payment Method</span>
                  <span className="font-medium text-gray-900 capitalize flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                    {order.paymentMethod === "cod" ? (
                      <FaMoneyBillWave className="text-green-500" />
                    ) : (
                      <FaWallet className="text-pink-500" />
                    )}
                    {order.paymentMethod === "cod" ? " COD" : " Momo"}
                  </span>
                </div>

                {/* Payment Status */}
                <div className="flex justify-between items-center">
                  <span>Payment Status</span>
                  <span
                    className={`font-bold text-[10px] px-2 py-1 rounded uppercase ${
                      order.isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                    {order.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${order.totalAmount?.toFixed(2)}
                </span>
              </div>

              {/* === ACTION BUTTONS === */}
              <div className="space-y-3">
                {/* 1. NÚT PAY WITH MOMO (Hiển thị nếu chưa trả, method là momo, và chưa hủy) */}
                {!order.isPaid && order.paymentMethod === "momo" && !isCancelled && (
                  <button
                    onClick={handleRepayMomo}
                    disabled={paying}
                    className="w-full bg-pink-600 text-white font-bold py-3.5 rounded-lg shadow-lg hover:bg-pink-700 transition flex items-center justify-center gap-2 disabled:opacity-70">
                    {paying ? (
                      <>
                        <FaSpinner className="animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <FaWallet /> Pay with Momo
                      </>
                    )}
                  </button>
                )}

                {/* 2. NÚT CANCEL (Hiển thị nếu đang pending) */}
                {order.status === "pending" && (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="w-full bg-white text-red-600 font-bold py-3 rounded-lg border border-red-200 hover:bg-red-50 transition">
                    Cancel Order
                  </button>
                )}

                <Link
                  to="/my-orders"
                  className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <FaArrowLeft size={12} /> Back to List
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Confirm Cancel */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !cancelling && setShowConfirmModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <FaExclamationTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Cancel Order?</h3>
              <p className="text-sm text-gray-500 mt-2">
                Are you sure? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={cancelling}
                className="flex-1 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                Keep it
              </button>
              <button
                onClick={onConfirmCancel}
                disabled={cancelling}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex justify-center items-center gap-2">
                {cancelling ? <FaSpinner className="animate-spin" /> : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
