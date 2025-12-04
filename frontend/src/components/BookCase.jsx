import React, { useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "./BookCard";

const BookCase = ({
  title,
  isWishlisted,
  toggleWishlist,
  books,
  addToCart,
  subtitle,
  hideViewAll = false,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {title ? title : "Featured Books"}
        </h2>
        <p className="text-lg text-gray-600">
          {subtitle ? subtitle : "Discover our handpicked selection of amazing books"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {books.map((book) => (
          <BookCard
            key={book._id}
            book={book}
            addToCart={addToCart}
            isWishlisted={isWishlisted}
            onToggleWishlist={toggleWishlist}
          />
        ))}
      </div>

      {/* View All Button */}
      {!hideViewAll && (
        <div className="text-center mt-12">
          <Link
            to="/books"
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors duration-300">
            View All Books
          </Link>
        </div>
      )}
    </div>
  );
};

export default BookCase;
