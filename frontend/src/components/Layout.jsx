import React from "react";
import Header from "./Header.jsx";
import { Outlet } from "react-router-dom";
import Footer from "./Footer.jsx";
import NewsletterSignup from "./NewsletterSignup.jsx";

const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <NewsletterSignup />
      <Footer />
    </div>
  );
};

export default Layout;
