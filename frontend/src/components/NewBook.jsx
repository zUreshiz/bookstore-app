import React, { useState } from "react";
import BookCard from "./BookCard";
import { Link } from "react-router";

const NewBook = ({ books, isWishlisted, addToCart, toggleWishlist }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          New Arrivals
        </h2>
        <p className="text-lg text-gray-600">
          Explore the latest releases from every genre
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
      <div className="text-center mt-12">
        <Link
          to="/books"
          className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors duration-300">
          View All
        </Link>
      </div>
    </div>
  );
};

export default NewBook;
