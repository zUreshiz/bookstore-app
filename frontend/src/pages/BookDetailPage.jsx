import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import api from "../api/axios";
import Loading from "../components/Loading";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";

// Icons
import {
  FaStar,
  FaHeart,
  FaRegHeart,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaTruck,
  FaShieldAlt,
} from "react-icons/fa";
import StarRating from "../components/StarRating";

const BookDetailPage = () => {
  const { bookName } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description"); // Tab state

  // Hooks
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/books/name/${encodeURIComponent(bookName)}`);
        setBook(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookName]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  if (!book)
    return <div className="text-center py-20 text-xl text-gray-500">Book not found.</div>;

  // Handle Quantity
  const maxStock = book.stock;

  const handleQuantityChange = (type) => {
    if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
    if (type === "increase") {
      if (quantity < maxStock) {
        setQuantity(quantity + 1);
      }
    }
  };

  const finalPrice = book.isOnSale ? book.salePrice : book.price;
  const isLiked = isWishlisted(book._id);

  return (
    <div className="bg-gray-50 min-h-screen py-8"> 
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumbs */}
        {/* <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">
            {book.title}
          </span>
        </nav> */}

        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* --- LEFT COLUMN: IMAGE --- */}
          <div className="relative group">
            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 relative">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              {/* Badge Sale */}
              {book.isOnSale && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  -{book.discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* --- RIGHT COLUMN: INFO --- */}
          <div className="flex flex-col">
            {/* Category */}
            <div className="flex gap-2 mb-3">
              {book.category?.map((cat, index) => (
                <Link
                  to={`/category/${cat}`}
                  key={index}
                  className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded uppercase">
                  {cat}
                </Link>
              ))}
            </div>

            {/* Title & Author */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
              {book.title}
            </h1>
            <p className="text-gray-500 text-lg mb-4">
              Author: <span className="text-blue-600 font-medium">{book.author}</span>
            </p>

            {/* Rating */}
            <div className="flex items-center mb-6">
              <StarRating rating={book.rating} />
              <span className="ml-3 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                {book.rating}/5 ({book.reviewCount} reviews)
              </span>
            </div>

            {/* Price Section */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-red-600">${finalPrice}</span>
                {book.isOnSale && (
                  <span className="text-xl text-gray-400 line-through mb-1">
                    ${book.price}
                  </span>
                )}
              </div>
              {book.isOnSale && (
                <p className="text-green-600 text-sm mt-1 font-medium">
                  Save: ${(book.price - book.salePrice).toFixed(2)}
                </p>
              )}
            </div>

            {/* Actions: Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Nếu hết hàng thì không hiện nút chọn số lượng */}
              {maxStock > 0 ? (
                <div className="flex flex-col gap-2">
                  {/* Selector */}
                  <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      disabled={quantity <= 1}
                      className="px-4 py-3 hover:bg-gray-100 text-gray-600 transition disabled:opacity-30">
                      <FaMinus size={12} />
                    </button>
                    <span className="px-4 font-semibold text-gray-900 w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange("increase")}
                      disabled={quantity >= maxStock}
                      className="px-4 py-3 hover:bg-gray-100 text-gray-600 transition disabled:opacity-30">
                      <FaPlus size={12} />
                    </button>
                  </div>

                  {/* --- THÊM DÒNG NÀY: Hiển thị tồn kho --- */}
                  <div className="text-sm text-gray-500 ml-1">
                    {maxStock} pieces available
                  </div>
                </div>
              ) : (
                <div className="text-red-500 font-bold py-3 flex items-center">
                  Out of Stock
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(book._id, quantity)}
                disabled={maxStock === 0}
                className={`flex-1 font-bold py-3 px-6 rounded-lg shadow-lg transition flex items-center justify-center gap-2 ${
                  maxStock === 0
                    ? "bg-gray-400 cursor-not-allowed text-gray-200 shadow-none" // Style khi hết hàng
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                }`}>
                <FaShoppingCart />
                {maxStock === 0 ? "Sold Out" : "Add to Cart"}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(book._id)}
                className={`p-3 rounded-lg border transition ${
                  isLiked
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "bg-white border-gray-300 text-gray-400 hover:text-red-500 hover:border-red-300"
                }`}
                title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}>
                {isLiked ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
              </button>
            </div>

            {/* Policies */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <FaTruck className="text-blue-500" /> Fast Delivery
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-blue-500" /> Quality Guarantee
              </div>
            </div>

            {/* Description Preview */}
            <div className="prose text-gray-600 line-clamp-3">{book.description}</div>
          </div>
        </div>

        {/* --- BOTTOM: TABS --- */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-8">
              <button
                className={`pb-3 font-medium text-lg border-b-2 transition ${
                  activeTab === "description"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("description")}>
                Description
              </button>
              <button
                className={`pb-3 font-medium text-lg border-b-2 transition ${
                  activeTab === "reviews"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("reviews")}>
                Reviews
              </button>
            </div>
          </div>

          <div className="text-gray-700 leading-relaxed">
            {activeTab === "description" ? (
              <p>{book.description}</p>
            ) : (
              <p className="text-gray-500 italic">No reviews yet for this product.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
