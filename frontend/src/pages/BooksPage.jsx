import React, { useEffect, useState } from "react";
import FilterMenu from "../components/FilterMenu";
import BookCase from "../components/BookCase";
import api from "../api/axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import AppPagination from "@/components/AppPagination";
import { useSearchParams } from "react-router-dom";

const BooksPage = () => {
  const [bookSale, setBookSale] = useState([]);
  const [bookBuffer, setBookBuffer] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const { wishlistIds, wishlistLoading, toggleWishlist, isWishlisted } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = async (page = 1) => {
    try {
      setLoading(true);

      const res = await api.get(`/books?page=${page}&limit=12`);

      setBookBuffer(res.data.data);
      setCurrentPage(res.data.pagination.currentPage);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      toast.error("Error data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setSearchParams({ page: currentPage }, { replace: true });

    // Scroll lên top mượt mà
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    fetchBooks(currentPage);
  }, [currentPage]);

  return (
    <div>
      {loading || wishlistLoading ? (
        <div className="flex h-screen items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div>
          <div className="flex">
            <FilterMenu />
            <BookCase
              books={bookBuffer}
              wishlistIds={wishlistIds}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              isWishlisted={isWishlisted}
              hideViewAll={true}
            />
          </div>

          <AppPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default BooksPage;
