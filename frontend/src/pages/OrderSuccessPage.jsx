import React from "react";
import { Link, useParams } from "react-router"; // Hoặc 'react-router-dom'
import { FaCheckCircle, FaArrowRight, FaShoppingBag } from "react-icons/fa";

const OrderSuccessPage = () => {
  // Lấy Order ID từ URL (nếu bạn truyền qua URL)
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        {/* Icon Success Animation */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <FaCheckCircle className="text-green-500 text-6xl animate-bounce" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Thank You!</h1>
        <p className="text-gray-500 mb-8">
          Your order has been placed successfully. We are processing it and will ship it
          to you soon.
        </p>

        {/* Order Info Box */}
        {orderId && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8">
            <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider mb-1">
              Order Number
            </p>
            <p className="text-xl font-bold text-blue-600 break-all">#{orderId}</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/" // Hoặc dẫn đến trang lịch sử đơn hàng: "/profile/orders"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-blue-200 transition flex items-center justify-center gap-2">
            <FaShoppingBag /> Continue Shopping
          </Link>

          <Link
            to={`/my-orders/${orderId} `} // Nếu bạn chưa làm trang My Orders thì trỏ về Home
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-lg border border-gray-200 transition flex items-center justify-center gap-2">
            View My Orders <FaArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 text-xs text-gray-400">
          Need help?{" "}
          <a href="#" className="underline hover:text-blue-500">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
