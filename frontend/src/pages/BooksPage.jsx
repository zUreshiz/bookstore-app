import React, { useEffect, useState } from "react";
import FilterMenu from "../components/FilterMenu";
import BookCase from "../components/BookCase";
import api from "../api/axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";

const BooksPage = () => {
  const [bookSale, setBookSale] = useState([]);
  const [bookBuffer, setBookBuffer] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const { wishlistIds, wishlistLoading, toggleWishlist, isWishlisted } = useWishlist();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const [allBooksRes, saleBookRes] = await Promise.all([
        api.get("/books"),
        api.get("/books/sale"),
      ]);
      setBookBuffer(allBooksRes.data || []);
      setBookSale(saleBookRes.data || []);
    } catch (error) {
      console.log("Error data: ", error);
      toast.error("Error data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      {loading || wishlistLoading ? (
        <div className="flex h-screen items-center justify-center">
          <Loading />
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default BooksPage;
