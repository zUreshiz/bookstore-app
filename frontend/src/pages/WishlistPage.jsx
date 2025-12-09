import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import api from "../api/axios";
import Loading from "../components/Loading";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import FilterMenu from "../components/FilterMenu";
import BookCase from "../components/BookCase";
import { FaHeartBroken } from "react-icons/fa";
import AppPagination from "@/components/AppPagination";

const WishlistPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { wishlistIds, wishlistLoading, toggleWishlist, isWishlisted } = useWishlist();

  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchWishlist = async (page = 1) => {
    try {
      setLoading(true);

      const res = await api.get(`/wishlist?page=${page}&limit=12`);

      setBooks(res.data.data || []);
      setCurrentPage(res.data.pagination.currentPage);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sync page + fetch
  useEffect(() => {
    setSearchParams({ page: currentPage }, { replace: true });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    fetchWishlist(currentPage);
  }, [currentPage]);

  /** LOADING */
  if (loading || wishlistLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  /** EMPTY STATE */
  if (books.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-6">
          <FaHeartBroken className="text-pink-500 text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8">
          Explore our collection and save your favorite books here.
        </p>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
          Explore Books
        </Link>
      </div>
    );
  }

  /** PAGE */
  return (
    <div className="flex">
      {/* BookCase giống hệt BooksPage */}
      <BookCase
        title={"Your Wishlist"}
        subtitle={"Your wishlist"}
        books={books}
        wishlistIds={wishlistIds}
        addToCart={addToCart}
        toggleWishlist={toggleWishlist}
        isWishlisted={isWishlisted}
        hideViewAll={true}
      />

      <AppPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default WishlistPage;
