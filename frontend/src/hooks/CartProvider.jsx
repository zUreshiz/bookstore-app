// CartContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  const fetchCart = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      setLoadingCart(true);
      const res = await api.get("/cart");
      setCart(res.data.items || []);
    } catch (err) {
      console.log(err);
      setCart([]);
    } finally {
      setLoadingCart(false);
    }
  };

  const addToCart = async (bookId, quantity = 1) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.info("Vui lòng đăng nhập để mua hàng!");
      return;
    }
    try {
      const res = await api.post("/cart/add", { bookId, quantity });
      setCart(res.data.items);
      toast.success("Added to cart");
    } catch (err) {
      console.log(err);
      toast.error("Error adding to cart");
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      const res = await api.delete(`/cart/remove/${bookId}`);
      setCart(res.data.items);
      toast.info("Removed from cart");
    } catch (err) {
      console.log(err);
      toast.error("Error removing item");
    }
  };

  const decreaseQuantity = async (bookId) => {
    try {
      const res = await api.patch(`/cart/decrease/${bookId}`);
      setCart(res.data.items);
    } catch (err) {
      console.log(err);
      toast.error("Error decreasing quantity");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchCart();
    }
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        fetchCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
