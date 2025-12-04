import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export const useWishlist = () => {
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Fetch wishlist khi component mount
  const fetchWishlist = async () => {
    setWishlistLoading(true);
    try {
      const res = await api.get("/wishlist");
      const bookIds = res.data.map((item) => item.book?._id ?? item._id);

      setWishlistIds(bookIds);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlistIds([]);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Toggle wishlist (add/remove)
  const toggleWishlist = async (_id) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.info("Vui lòng đăng nhập để lưu yêu thích!");
      return;
    }

    const isIn = wishlistIds.includes(_id);

    // Optimistic UI
    setWishlistIds((prev) => (isIn ? prev.filter((id) => id !== _id) : [...prev, _id]));

    try {
      if (isIn) {
        await api.delete(`/wishlist/${_id}`);
        toast.success("Removed from wishlist");
      } else {
        await api.post(`/wishlist/${_id}`);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error("Wishlist update failed:", err);

      // rollback UI
      setWishlistIds((prev) => (isIn ? [...prev, _id] : prev.filter((id) => id !== _id)));

      toast.error("Failed to update wishlist");
    }
  };

  // Check if book is in wishlist
  const isWishlisted = (_id) => wishlistIds.includes(_id);

  // Fetch wishlist on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchWishlist();
    } else {
      setWishlistIds([]);
    }
  }, []);

  return {
    wishlistIds,
    wishlistLoading,
    toggleWishlist,
    isWishlisted,
  };
};
