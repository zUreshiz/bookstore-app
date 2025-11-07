import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import StarRating from "./StarRating";
import { Category } from "../lib/data";

const BookCaseSale = () => {
  const [books] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      originalPrice: 29.99,
      salePrice: 14.99,
      cover: "https://placehold.co/280x400",
      rating: 4,
      reviewCount: 128,
      discount: 50,
      category: "Fiction",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      originalPrice: 24.99,
      salePrice: 12.49,
      cover: "https://placehold.co/280x400",
      rating: 1,
      reviewCount: 245,
      discount: 50,
      category: "Fiction",
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      originalPrice: 19.99,
      salePrice: 9.99,
      cover: "https://placehold.co/280x400",
      rating: 4.6,
      reviewCount: 189,
      discount: 50,
      category: "Fiction",
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      originalPrice: 22.99,
      salePrice: 11.49,
      cover: "https://placehold.co/280x400",
      rating: 4.7,
      reviewCount: 167,
      discount: 50,
      category: "Fiction",
    },
  ]);

  // local wishlist state (toggle UI). Replace with API calls later.
  const [favorites, setFavorites] = useState([]);

  const isWishlisted = (id) => favorites.includes(id);

  const toggleWishlist = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Flash Sale - Today Only!
        </h2>
        <p className="text-lg text-gray-600">
          Discover amazing deals on bestselling books
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {books.map((book) => (
          <div
            key={book.id}
            className="group relative bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {Category[book.category] || book.category}
              </div>
            </div>
            {/* Discount Badge */}
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                -{book.discount}%
              </div>
            </div>

            {/* Book Cover */}
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={book.cover}
                alt={book.title}
                className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Link
                  to={`/book/${book.id}`}
                  className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-300">
                  View Details
                </Link>
              </div>
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

              {/* Price */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-blue-600">
                    ${book.salePrice}
                  </span>
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ${book.originalPrice}
                  </span>
                </div>

                <div className="flex items-center">
                  {/* Wishlist (heart) button */}
                  <button
                    onClick={() => toggleWishlist(book.id)}
                    aria-label={
                      isWishlisted(book.id) ? "Remove from wishlist" : "Add to wishlist"
                    }
                    className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    title={
                      isWishlisted(book.id) ? "Remove from wishlist" : "Add to wishlist"
                    }>
                    {isWishlisted(book.id) ? (
                      <FaHeart className="w-5 h-5 text-red-500" />
                    ) : (
                      <FaRegHeart className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Time Left */}
              <div className="mt-4 text-center">
                <p className="text-sm text-red-500 font-semibold">Ends in: 05:23:45</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <Link
          to="/sale"
          className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors duration-300">
          View All Sale Items
        </Link>
      </div>
    </div>
  );
};

export default BookCaseSale;
