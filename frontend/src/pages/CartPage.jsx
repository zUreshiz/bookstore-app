import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../hooks/useCart";
import Loading from "../components/Loading";

// Icons
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaLongArrowAltRight,
  FaShoppingCart,
  FaExclamationCircle,
} from "react-icons/fa";

const CartPage = () => {
  const { cart, loadingCart, addToCart, decreaseQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (cart.length > 0) {
      const allBookIds = cart.map((item) => item.book._id);
      setSelectedItems(allBookIds);
    }
  }, [loadingCart]);

  const handleToggleItem = (bookId) => {
    if (selectedItems.includes(bookId)) {
      setSelectedItems((prev) => prev.filter((id) => id !== bookId));
    } else {
      setSelectedItems((prev) => [...prev, bookId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.book._id));
    }
  };

  // --- LOGIC TÍNH TOÁN ---
  const subtotal = cart.reduce((acc, item) => {
    const isSelected = selectedItems.includes(item.book._id);
    if (!isSelected) return acc;
    const price = item.book?.isOnSale ? item.book.salePrice : item.book?.price;
    return acc + price * item.quantity;
  }, 0);

  const totalSelectedQuantity = cart.reduce((acc, item) => {
    const isSelected = selectedItems.includes(item.book._id);
    if (!isSelected) return acc;
    return acc + item.quantity;
  }, 0);

  // const shippingFee = subtotal > 50 || subtotal === 0 ? 0 : 5;
  // const total = subtotal + shippingFee;
  const total = subtotal;

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;

    const invalidItems = cart.filter(
      (item) =>
        item.quantity > (item.book.stock || 0) && selectedItems.includes(item.book._id)
    );

    if (invalidItems.length > 0) {
      alert(
        "Some items in your cart exceed the available stock. Please adjust the quantity."
      );
      return;
    }

    const checkoutItems = cart.filter((item) => selectedItems.includes(item.book._id));
    navigate("/checkout", { state: { items: checkoutItems, total: total } });
  };

  if (loadingCart) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShoppingCart size={40} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <Link
            to="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition mt-4">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* --- BREADCRUMB (Thêm mới) --- */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- LEFT LIST --- */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <input
                type="checkbox"
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                checked={selectedItems.length === cart.length && cart.length > 0}
                onChange={handleSelectAll}
              />
              <span className="font-semibold text-gray-700">
                Select All ({cart.length} items)
              </span>
            </div>

            {cart.map((item) => {
              const book = item.book;
              if (!book) return null;
              const currentPrice = book.isOnSale ? book.salePrice : book.price;
              const isSelected = selectedItems.includes(book._id);
              const maxStock = book.stock || 0;
              const isMaxReached = item.quantity >= maxStock;
              const isOutOfSync = item.quantity > maxStock;

              return (
                <div
                  key={item._id}
                  className={`bg-white p-4 rounded-xl shadow-sm border transition flex gap-4 sm:gap-6 items-center relative group ${
                    isSelected
                      ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/10"
                      : "border-gray-100"
                  }`}>
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer shrink-0"
                    checked={isSelected}
                    onChange={() => handleToggleItem(book._id)}
                  />
                  <Link
                    to={`/books/${encodeURIComponent(book.title)}`}
                    className="shrink-0">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-20 h-28 sm:w-24 sm:h-36 object-cover rounded-md shadow-sm"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex-1">
                      <Link to={`/books/${encodeURIComponent(book.title)}`}>
                        <div className="flex flex-wrap gap-2 mb-1">
                          {book.category?.map((cat, i) => (
                            <span
                              key={i}
                              className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                              {cat}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight hover:text-blue-600 transition mb-1 line-clamp-2">
                          {book.title}
                        </h3>
                      </Link>
                      <p className="text-gray-500 text-sm mb-2">{book.author}</p>
                      <div className="font-bold text-gray-900 mb-1">
                        ${currentPrice}
                        {book.isOnSale && (
                          <span className="text-gray-400 text-sm font-normal line-through ml-2">
                            ${book.price}
                          </span>
                        )}
                      </div>
                      {isOutOfSync && (
                        <div className="text-red-500 text-xs font-bold flex items-center gap-1">
                          <FaExclamationCircle /> Max available: {maxStock}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 mt-2 sm:mt-0">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                          <button
                            onClick={() => decreaseQuantity(book._id)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 hover:bg-gray-100 text-gray-600 disabled:opacity-30">
                            <FaMinus size={10} />
                          </button>
                          <span className="px-2 text-sm font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addToCart(book._id, 1)}
                            disabled={isMaxReached}
                            className={`px-3 py-1 transition ${
                              isMaxReached
                                ? "opacity-30 cursor-not-allowed"
                                : "hover:bg-gray-100 text-gray-600"
                            }`}>
                            <FaPlus size={10} />
                          </button>
                        </div>
                        {isMaxReached && !isOutOfSync && (
                          <span className="text-[10px] text-orange-500 font-medium w-full text-center block mt-1">
                            Max limit reached
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(book._id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 font-medium hover:underline mt-4 w-fit">
              <FaArrowLeft className="mr-2" /> Continue Shopping
            </Link>
          </div>

          {/* --- RIGHT: SUMMARY --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 text-gray-600">
                <div className="flex justify-between text-sm">
                  <span>Selected Items</span>
                  <span className="font-medium text-gray-900">
                    {selectedItems.length} products
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Quantity</span>
                  <span className="font-medium text-gray-900">
                    {totalSelectedQuantity} books
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                {/* <div className="flex justify-between">
                  <span>Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span className="font-medium text-gray-900">
                      ${shippingFee.toFixed(2)}
                    </span>
                  )}
                </div> */}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className={`w-full font-bold py-4 rounded-lg shadow-lg transition flex items-center justify-center gap-2 ${
                  selectedItems.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                }`}>
                Checkout ({totalSelectedQuantity}) <FaLongArrowAltRight />
              </button>

              <div className="mt-6 flex justify-center gap-4 opacity-60">
                {/* Bạn có thể thêm icon Payment Visa/Mastercard ở đây nếu muốn trang trí */}
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                <div className="h-6 w-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
