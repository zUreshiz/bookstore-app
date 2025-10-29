import React, { useState } from "react";
import { Link } from "react-router-dom";

const BookCaseSale = () => {
  const [books] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      originalPrice: 29.99,
      salePrice: 14.99,
      cover: "https://placehold.co/280x400",
      rating: 4.5,
      reviewCount: 128,
      discount: 50,
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      originalPrice: 24.99,
      salePrice: 12.49,
      cover: "https://placehold.co/280x400",
      rating: 4.8,
      reviewCount: 245,
      discount: 50,
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
    },
  ]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
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
                <div className="flex mr-2">{renderStars(book.rating)}</div>
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
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors duration-300">
                  Add to Cart
                </button>
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
