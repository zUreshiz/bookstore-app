import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import BookCase from "../components/BookCase";
import FilterMenu from "../components/FilterMenu";
import { toast } from "react-toastify";
import api from "../api/axios";
import Loading from "../components/Loading";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const title = `Category: ${categoryName}`;
  const subtitle = `Showing books for ${categoryName}`;
  const [bookSale, setBookSale] = useState([]);
  const [bookBuffer, setBookBuffer] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  const { wishlistIds, wishlistLoading, toggleWishlist, isWishlisted } = useWishlist();

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const [allBooksRes, saleBookRes] = await Promise.all([
        api.get(`/books?category=${categoryName}`),
        api.get("/books/sale"),
      ]);
      setBookBuffer(allBooksRes.data || []);
      setBookSale(saleBookRes.data || []);
    } catch (error) {
      console.log("Error data: ", error);
      toast.error("Error tasks data");
    } finally {
      setLoading(false);
    }
  }, [categoryName]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const filteredBooks = useMemo(
    () => bookBuffer.filter((book) => book.category === categoryName),
    [categoryName, bookBuffer]
  );

  if (loading || wishlistLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
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
  );
};

export default CategoryPage;
