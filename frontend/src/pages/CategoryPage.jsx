import React, { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import BookCase from "../components/BookCase";
import FilterMenu from "../components/FilterMenu";
import { toast } from "react-toastify";
import api from "../api/axios";
import Loading from "../components/Loading";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import AppPagination from "@/components/AppPagination";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const title = `Category: ${categoryName}`;
  const subtitle = `Showing books for ${categoryName}`;

  const [bookBuffer, setBookBuffer] = useState([]);
  const [loading, setLoading] = useState(false);

  const { addToCart } = useCart();
  const { wishlistIds, wishlistLoading, toggleWishlist, isWishlisted } = useWishlist();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch books
  const fetchBooks = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);

        const res = await api.get(
          `/books?category=${categoryName}&page=${page}&limit=12`
        );

        setBookBuffer(res.data.data || []);
        setCurrentPage(res.data.pagination.currentPage);
        setTotalPages(res.data.pagination.totalPages);
      } catch (error) {
        console.log("Error data: ", error);
        toast.error("Error tasks data");
      } finally {
        setLoading(false);
      }
    },
    [categoryName]
  );

  // Disable browser scroll restore
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Scroll on first load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sync page + fetch when page changes
  useEffect(() => {
    setSearchParams({ page: currentPage }, { replace: true });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    fetchBooks(currentPage);
  }, [currentPage, fetchBooks]);

  if (loading || wishlistLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <div className="flex">
        <FilterMenu />

        <BookCase
          title={title}
          books={bookBuffer}
          wishlistIds={wishlistIds}
          addToCart={addToCart}
          categoryName={categoryName}
          toggleWishlist={toggleWishlist}
          isWishlisted={isWishlisted}
          subtitle={subtitle}
          hideViewAll={true}
        />
      </div>

      {/* Pagination */}
      <AppPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default CategoryPage;
