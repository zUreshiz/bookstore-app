import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaShoppingBag,
  FaRedo,
  FaHome,
  FaSpinner,
} from "react-icons/fa";
import api from "../api/axios";

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();

  // Momo query params
  const momoResultCode = searchParams.get("resultCode");
  const momoOrderId = searchParams.get("orderId"); // orderId_timestamp
  const rawMessage = searchParams.get("message");

  const realOrderId = momoOrderId ? momoOrderId.split("_")[0] : "";
  const initialMomoSuccess = momoResultCode === "0";

  const [isPaid, setIsPaid] = useState(null); // null = unknown
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const message = rawMessage
    ? decodeURIComponent(rawMessage)
    : "No transaction details available.";

  /** ------------------------------------------------------------------
   * 🔄 AUTO POLLING – GỌI BACKEND /payment-status 5 GIÂY/LẦN
   * ------------------------------------------------------------------ */
  const checkPaymentStatus = async () => {
    if (!realOrderId) return;

    try {
      const res = await api.get(`/orders/${realOrderId}/payment-status`);
      const data = res.data;

      if (data?.isPaid) {
        setIsPaid(true);
        setLoading(false);
        return;
      }

      // Chưa trả IPN
      setIsPaid(false);
    } catch (err) {
      console.error("Error checking status:", err);
    }
  };

  useEffect(() => {
    checkPaymentStatus(); // gọi ngay lần đầu

    const interval = setInterval(() => {
      setRetryCount((prev) => prev + 1);
      checkPaymentStatus();
    }, 5000);

    // Dừng polling sau 30 giây (6 lần)
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [realOrderId]);

  /** ------------------------------------------------------------------
   *  🧠 LOGIC XÁC ĐỊNH KẾT QUẢ
   * ------------------------------------------------------------------ */
  const finalSuccess =
    // MoMo báo success + IPN đã cập nhật database
    (initialMomoSuccess && isPaid === true) ||
    // Hoặc IPN tới trước cả redirect
    isPaid === true;

  const finalFailed =
    // MoMo báo failed
    momoResultCode !== "0" ||
    // Hết 30 giây mà IPN vẫn chưa tới
    (!loading && isPaid === false);

  /** ------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        {/* --- Loading UI --- */}
        {loading && (
          <div className="mb-6 flex flex-col items-center gap-3">
            <FaSpinner className="text-blue-500 text-5xl animate-spin" />
            <p className="text-gray-500 text-sm">
              Waiting for payment confirmation... ({retryCount * 5}s)
            </p>
          </div>
        )}

        {/* --- Success --- */}
        {!loading && finalSuccess && (
          <>
            <div className="mb-6 flex justify-center">
              <div className="rounded-full p-4 bg-green-100">
                <FaCheckCircle className="text-green-500 text-6xl animate-bounce" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-500 mb-8">
              Your payment has been confirmed. Thank you for your purchase!
            </p>

            <Link
              to={`/my-orders/${realOrderId}`}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-blue-200 transition flex items-center justify-center gap-2">
              <FaArrowRight size={14} /> View My Order
            </Link>
          </>
        )}

        {/* --- Failed --- */}
        {!loading && finalFailed && (
          <>
            <div className="mb-6 flex justify-center">
              <div className="rounded-full p-4 bg-red-100">
                <FaTimesCircle className="text-red-500 text-6xl animate-pulse" />
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Failed</h1>

            <p className="text-gray-500 mb-8">{message}</p>

            {realOrderId && (
              <Link
                to={`/my-orders/${realOrderId}`}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-red-200 transition flex items-center justify-center gap-2">
                <FaRedo size={14} /> Try Again
              </Link>
            )}
          </>
        )}

        {/* Back home */}
        {!loading && (
          <div className="mt-4">
            <Link
              to="/"
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-lg border border-gray-200 transition flex items-center justify-center gap-2">
              <FaHome size={14} /> Back to Home
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-400">
          Transaction processed via{" "}
          <span className="font-bold text-pink-600">Momo Wallet</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;
