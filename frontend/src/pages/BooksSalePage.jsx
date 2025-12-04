import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { toast } from "react-toastify";
import BookCase from "../components/BookCase";
import Loading from "../components/Loading.jsx";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart.js";

const BooksSalePage = () => {
  const [bookSale, setBookSale] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const { wishlistIds, wishlistLoading, toggleWishlist, isWishlisted } = useWishlist();

  const fetchBookSale = async () => {
    try {
      setLoading(true);
      const res = await api.get("/books/sale");
      setBookSale(res.data);
    } catch (error) {
      console.log("Error data: ", error);
      toast.error("Error data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookSale();
  }, []);

  return (
    <div>
      {loading || wishlistLoading ? (
        <div className="flex h-screen items-center justify-center">
          <Loading />
        </div>
      ) : (
        <BookCase
          title={"Sale Page"}
          books={bookSale}
          wishlistIds={wishlistIds}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          isWishlisted={isWishlisted}
          hideViewAll={true}
        />
      )}
    </div>
  );
};

export default BooksSalePage;
