import React from "react";
import { Link } from "react-router";

const BannerSale = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute transform -rotate-45 left-0 w-96 h-96 bg-white rounded-full -top-48 -left-48"></div>
        <div className="absolute transform -rotate-45 right-0 w-96 h-96 bg-white rounded-full -bottom-48 -right-48"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="text-center md:text-left mb-8 md:mb-0 md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Summer Book Sale
            </h2>
            <p className="text-xl text-blue-100 mb-6">
              Up to <span className="font-bold text-yellow-400">50% OFF</span> on selected
              books
            </p>
            <div className="space-x-4">
              <Link
                to="/sale"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 hover:text-white transition-colors duration-300">
                Shop Now
              </Link>
              <Link
                to="/categories"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Content - Book Display */}
          <div className="md:w-1/2 relative">
            <div className="relative">
              {/* Sale Badge */}
              <div className="absolute -top-4 -right-4 bg-red-500 text-white text-lg font-bold rounded-full w-20 h-20 flex items-center justify-center transform rotate-12 animate-pulse">
                50% OFF
              </div>

              {/* Books Stack Effect */}
              <div className="relative transform hover:scale-105 transition-transform duration-300">
                <div className="absolute top-2 left-2 w-full h-full bg-gray-200 rounded-lg transform rotate-6"></div>
                <div className="absolute top-1 left-1 w-full h-full bg-gray-300 rounded-lg transform rotate-3"></div>
                <img
                  src="https://placehold.co/400x300"
                  alt="Featured Books"
                  className="relative z-10 rounded-lg shadow-xl"
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 right-8 w-8 h-8 bg-pink-500 rounded-full animate-bounce delay-100"></div>
              <div className="absolute top-1/2 -right-4 w-6 h-6 bg-green-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>

        {/* Timer Section */}
        <div className="mt-12 text-center">
          <p className="text-blue-100 text-lg mb-4">Limited Time Offer</p>
          <div className="flex justify-center space-x-4">
            {["02", "23", "59", "59"].map((num, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-4 w-24">
                <div className="text-2xl font-bold text-white">{num}</div>
                <div className="text-sm text-blue-100">
                  {["Days", "Hours", "Minutes", "Seconds"][index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSale;
