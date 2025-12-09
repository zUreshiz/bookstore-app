import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { toast } from "react-toastify";
import BookCase from "../components/BookCase";
import Loading from "../components/Loading.jsx";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart.js";
import AppPagination from "@/components/AppPagination";
import { useSearchParams } from "react-router-dom";

const BooksSalePage = () => {
  const [bookSale, setBookSale] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const { wishlistIds, wishlistLoading, toggleWishlist, isWishlisted } = useWishlist();

  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookSale = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/books/sale?page=${page}&limit=12`);
      setBookSale(res.data.data || []);
      setCurrentPage(res.data.pagination.currentPage);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.log("Error data: ", error);
      toast.error("Error data");
    } finally {
      setLoading(false);
    }
  };

  // Scroll top on first load
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

    fetchBookSale(currentPage);
  }, [currentPage]);

  return (
    <div>
      {loading || wishlistLoading ? (
        <div className="flex h-screen items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          <BookCase
            title={"Sale Page"}
            books={bookSale}
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
        </>
      )}
    </div>
  );
};

export default BooksSalePage;
