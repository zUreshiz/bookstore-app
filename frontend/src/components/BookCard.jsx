import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import StarRating from "./StarRating";
import { Category } from "../lib/data.js";
import CountdownTimer from "./CountdownTime";

const BookCard = ({ book, isWishlisted, addToCart, onToggleWishlist }) => {
  const categories = Array.isArray(book.category) ? book.category : [book.category];
  return (
    <div className="group relative bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-10">
        {categories.map((cat, index) => (
          <div
            key={`${cat}-${index}`} // Thêm key để React không báo lỗi
            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-1.5">
            {Category[cat] || cat}
          </div>
        ))}
      </div>

      {/* === LOGIC MỚI === 
        Chỉ hiển thị mác giảm giá nếu book.isOnSale = true
      */}
      {book.isOnSale && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
            -{book.discountPercent}%
          </div>
        </div>
      )}

      {/* Book Cover */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={book.coverImage}
          alt={book.title}
          className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ">
          <Link
            to={`/books/${encodeURIComponent(book.title)}`}
            className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-300">
            View Details
          </Link>
        </div>
        {book.isOnSale && book.saleEndsAt && new Date(book.saleEndsAt) > new Date() && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-400 bg-opacity-75 text-white text-sm py-2 text-center font-bold z-20">
            Ends in: <CountdownTimer endTime={book.saleEndsAt} />
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {book.title}
        </h3>
        <p className="text-gray-600 mb-3 line-clamp-1">{book.author}</p>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex mr-2">
            <StarRating rating={book.rating} />
          </div>
          <span className="text-sm text-gray-500">({book.reviewCount})</span>
        </div>

        {/* Price and Actions */}
        {/* Price + Wishlist */}
        <div className="flex items-center justify-between mb-4">
          {book.isOnSale ? (
            <div>
              <span className="text-lg font-bold text-blue-600">${book.salePrice}</span>
              <span className="text-sm text-gray-500 line-through ml-2">
                ${book.price}
              </span>
            </div>
          ) : (
            <div>
              <span className="text-lg font-bold text-gray-900">${book.price}</span>
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={() => onToggleWishlist(book._id)}
            aria-label={
              isWishlisted(book._id) ? "Remove from wishlist" : "Add to wishlist"
            }
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            {isWishlisted(book._id) ? (
              <FaHeart className="w-5 h-5 text-red-500" />
            ) : (
              <FaRegHeart className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Add to Cart (full width, nằm dưới) */}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-300"
          onClick={() => addToCart(book._id)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BookCard;
