import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import BannerSale from "../components/BannerSale";
import BookCase from "../components/BookCase";
import BookCaseSale from "../components/BookCaseSale";

const Home = () => {
  const [bookBuffer, setBookBuffer] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/books");
      setBookBuffer(res.data.books || []);
      console.log(res.data.books);
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
  return (
    <>
      <BannerSale />
      <BookCaseSale />
      <BookCase />
    </>
  );
};

export default Home;
