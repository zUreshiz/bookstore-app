import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import RequestReset from "./pages/RequestReset";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import CategoryPage from "./pages/CategoryPage";
import BooksPage from "./pages/BooksPage";
import WishlistPage from "./pages/WishlistPage";
import BooksSalePage from "./pages/BooksSalePage";
import { CartProvider } from "./hooks/CartProvider";
import BookDetailPage from "./pages/BookDetailPage";
import CartPage from "./pages/CartPage";
import ScrollToTop from "./components/ScrollToTop";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentResultPage from "./pages/PaymentResultPage";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CartProvider>
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/request-reset" element={<RequestReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/:bookName" element={<BookDetailPage />} />
          <Route path="/sale" element={<BooksSalePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
        {/* <Route path="/payment-success/:orderId" element={<PaymentSuccessPage />} /> */}
        <Route path="/payment-result/" element={<PaymentResultPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/my-orders/:id" element={<OrderDetailPage />} />
      </Routes>
    </CartProvider>
  </BrowserRouter>
);
