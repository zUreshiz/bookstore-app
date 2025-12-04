import React, { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaCheckCircle, FaArrowRight, FaShoppingBag } from "react-icons/fa";
import api from "../api/axios";

const PaymentSuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const updateOrderStatus = async () => {
      const query = new URLSearchParams(location.search);
      const resultCode = query.get("resultCode");

      if (orderId && resultCode == "0") {
        try {
          await api.post("/payment/pay/success", {
            orderId: orderId,
            resultCode: resultCode,
          });
          console.log("Order updated successfully");
        } catch (error) {
          console.error("Failed to update order status", error);
        }
      }
    };
    updateOrderStatus();
  }, [location.search, orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        {/* Icon Success Animation */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <FaCheckCircle className="text-green-500 text-6xl animate-bounce" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-500 mb-8">
          Your payment has been processed. Thank you for your purchase!
        </p>

        {/* Payment Info Box */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Thank You!</h1>
        <p className="text-gray-500 mb-8">
          Payment successful! Your order #{orderId} is now being processed.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-blue-200 transition flex items-center justify-center gap-2">
            <FaShoppingBag /> Continue Shopping
          </Link>

          <Link
            to={`/my-orders/${orderId}`}
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

export default PaymentSuccessPage;
