import React, { useState, useRef, useEffect } from "react";
import { Category } from "../lib/data.js";
import { Link, Navigate } from "react-router";
import { FaShoppingCart, FaChevronDown, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { MdMenuBook } from "react-icons/md";
import { useCart } from "../hooks/useCart.js";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { cartCount } = useCart();
  const [isLogoutSuccess, setIsLogoutSuccess] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    setTimeout(() => {
      setIsLogoutSuccess(true);
    }, 1000);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLogoutSuccess) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          {/* Left side - Logo and navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-gray-800 flex items-center ">
              <MdMenuBook className="w-10 h-10 mr-2" />
              BookStore
            </Link>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link to="/books" className="text-gray-600 hover:text-gray-900">
                Books
              </Link>

              {/* Category Dropdown */}
              <div className="relative z-50" ref={dropdownRef}>
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                  <span>Category</span>
                  <FaChevronDown
                    className={`w-5 h-5 mt-[4px] transition-transform ${
                      isCategoryDropdownOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {isCategoryDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-[600px] -left-1/2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="p-4" role="menu">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Fiction & Literature
                          </h3>
                          <div className="space-y-2">
                            {[
                              "Fiction",
                              "Romance",
                              "Fantasy",
                              "Science Fiction",
                              "Mystery",
                              "Thriller",
                              "Horror",
                            ].map(
                              (key) =>
                                Category[key] && (
                                  <Link
                                    key={key}
                                    to={`/category/${key}`}
                                    className="block text-sm text-gray-700 hover:text-blue-600"
                                    role="menuitem">
                                    {Category[key]}
                                  </Link>
                                )
                            )}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Academic & Professional
                          </h3>
                          <div className="space-y-2">
                            {[
                              "Business",
                              "Economics",
                              "Technology",
                              "Psychology",
                              "Education",
                              "Philosophy",
                            ].map(
                              (key) =>
                                Category[key] && (
                                  <Link
                                    key={key}
                                    to={`/category/${key}`}
                                    className="block text-sm text-gray-700 hover:text-blue-600"
                                    role="menuitem">
                                    {Category[key]}
                                  </Link>
                                )
                            )}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Other Categories
                          </h3>
                          <div className="space-y-2">
                            {[
                              "History",
                              "Biography",
                              "Self-help",
                              "Art",
                              "Health & Fitness",
                              "Children",
                              "Comics",
                            ].map(
                              (key) =>
                                Category[key] && (
                                  <Link
                                    key={key}
                                    to={`/category/${key}`}
                                    className="block text-sm text-gray-700 hover:text-blue-600"
                                    role="menuitem">
                                    {Category[key]}
                                  </Link>
                                )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center - Search (desktop) */}
          <div className="hidden md:flex items-center flex-1 justify-center">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim() === "") return;
                // Redirect to books page with search query
                window.location.href = `/books?search=${encodeURIComponent(
                  searchQuery.trim()
                )}`;
              }}
              className="w-full max-w-xl px-4">
              <label htmlFor="header-search" className="sr-only">
                Search books
              </label>
              <div className="relative">
                <input
                  id="header-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books, authors, ISBN..."
                  className="w-full border border-gray-200 rounded-xl bg-gray-200 pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                  <FaSearch className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Right side - Cart and Auth */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart */}
            <Link to="/cart" className="text-gray-600 hover:text-gray-900 relative">
              <FaShoppingCart className="w-7 h-7 mr-3" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Links */}
            {user && user.name ? (
              <div className="relative z-50" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <span>Hi, {user.name}</span>
                  <FaChevronDown
                    className={`w-5 h-5 mt-[4px] transition-transform ${
                      isProfileDropdownOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem">
                        Your Profile
                      </Link>
                      <Link
                        to="/my-orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem">
                        Your Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem">
                        Wishlist
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <FaBars className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`} />
              <FaTimes className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            Home
          </Link>
          <Link
            to="/books"
            className="block px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50">
            Books
          </Link>

          {/* Mobile Category Menu */}
          <div className="relative">
            <button
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50">
              Category
            </button>
            {isCategoryDropdownOpen && (
              <div className="pl-4">
                {Object.entries(Category).map(([key, value]) => (
                  <Link
                    key={key}
                    to={`/category/${key}`}
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                    {value}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Auth Links */}
          {user && user.name ? (
            <>
              <div className="px-3 py-2 text-gray-700 font-medium ">Hi, {user.name}</div>
              <div className="z-auto relative">
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Your Profile
                </Link>
                <Link
                  to="/orders"
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Your Orders
                </Link>
                <Link
                  to="/wishlist"
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Wishlist
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
