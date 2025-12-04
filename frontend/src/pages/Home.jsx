import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import BannerSale from "../components/BannerSale";
import BookCase from "../components/BookCase";
import BookCaseSale from "../components/BookCaseSale";
import BookCarousels from "../components/BookCarousels";
import BookSlogan from "../components/BookSlogan";
import NewsletterSignup from "../components/NewsletterSignup";
import Loading from "../components/Loading";
import NewBook from "../components/NewBook";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";

const Home = () => {
  const [topSaleBooks, setTopSaleBooks] = useState([]);
  const [topSoldBooks, setTopSoldBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  const { wishlistIds, wishlistLoading, toggleWishlist, isWishlisted } = useWishlist();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/books/top");
      setTopSoldBooks(res.data.topSoldBooks || []);
      setTopSaleBooks(res.data.topSaleBooks || []);
      setNewBooks(res.data.newBooks || []);
    } catch (error) {
      console.log("Error data: ", error);
      toast.error("Error tasks data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading || wishlistLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <BannerSale />
      <BookCaseSale
        books={topSaleBooks}
        wishlistIds={wishlistIds}
        addToCart={addToCart}
        toggleWishlist={toggleWishlist}
        isWishlisted={isWishlisted}
      />
      <BookSlogan />
      <NewBook
        books={newBooks}
        wishlistIds={wishlistIds}
        toggleWishlist={toggleWishlist}
        addToCart={addToCart}
        isWishlisted={isWishlisted}
      />
      <BookCase
        books={topSoldBooks}
        wishlistIds={wishlistIds}
        toggleWishlist={toggleWishlist}
        addToCart={addToCart}
        isWishlisted={isWishlisted}
      />
      <BookCarousels />
    </>
  );
};

export default Home;
