import React, { useEffect, useState } from "react";
import { Link } from "react-router"; // or 'react-router-dom'
import api from "../api/axios";
import Loading from "../components/Loading";

// Icons
import {
  FaBoxOpen,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaShoppingBag,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaClipboardList,
  FaSpinner,
} from "react-icons/fa";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab state (Default 'all')
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // --- 1. TABS CONFIGURATION (ENGLISH) ---
  const tabs = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "processing", label: "Processing" },
    { id: "shipping", label: "Shipping" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  // --- FILTER LOGIC ---
  const getFilteredOrders = () => {
    if (activeTab === "all") return orders;
    return orders.filter((order) => order.status === activeTab);
  };

  const filteredOrders = getFilteredOrders();

  // --- 2. STATUS BADGE RENDERER (ENGLISH) ---
  const renderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 flex items-center gap-1">
            <FaClock /> Pending
          </span>
        );
      case "processing":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 flex items-center gap-1">
            <FaSpinner className="animate-spin" /> Processing
          </span>
        );
      case "shipping":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 flex items-center gap-1">
            <FaTruck /> Shipping
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 flex items-center gap-1">
            <FaCheckCircle /> Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 flex items-center gap-1">
            <FaTimesCircle /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">My Orders</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <FaShoppingBag className="text-blue-600" /> My Order History
        </h1>

        {/* --- TABS NAVIGATION --- */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 ">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 text-sm font-medium transition-all relative ${
                  activeTab === tab.id
                    ? "text-blue-600 bg-blue-50/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}>
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* --- ORDER LIST --- */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClipboardList className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
              <p className="text-gray-500 text-sm">
                There are no orders in the "{tabs.find((t) => t.id === activeTab)?.label}"
                tab.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                {/* Order Header */}
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wide">
                      Order ID
                    </span>
                    <Link
                      to={`/my-orders/${order._id}`} // Đảm bảo route này khớp với App.js
                      className="font-mono text-blue-600 font-medium hover:underline hover:text-blue-800 transition-colors"
                      title="View Order Detail">
                      #{order._id}
                    </Link>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wide flex items-center gap-1">
                      <FaCalendarAlt size={10} /> Date Placed
                    </span>
                    {/* Date format EN-US */}
                    <span className="text-gray-700 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wide flex items-center gap-1">
                      <FaMoneyBillWave size={10} /> Total Amount
                    </span>
                    {/* Using order.totalAmount from Model */}
                    <span className="text-gray-900 font-bold">
                      ${order.totalAmount?.toFixed(2)}
                    </span>
                  </div>

                  <div>{renderStatusBadge(order.status)}</div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Using order.items from Model */}
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 h-20 bg-gray-100 rounded border border-gray-200 overflow-hidden shrink-0">
                          {item.book && typeof item.book === "object" ? (
                            <img
                              src={item.book.coverImage}
                              alt={item.book.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                              No Img
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                            {item.book && typeof item.book === "object"
                              ? item.book.title
                              : "Product Unavailable"}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <div className="text-sm font-medium text-gray-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
