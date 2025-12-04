import React from "react";
import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router";
import Loading from "../components/Loading";
import { useCart } from "../hooks/useCart";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { fetchCart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/users/login", form);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      await fetchCart();
      console.log("Login success");
      toast.success("Login successful");
      setTimeout(() => {
        setIsLoginSuccess(true);
      }, 1000);
      setForm({ email: "", password: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (isLoginSuccess) {
    return <Navigate to="/" replace={true}></Navigate>;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }
  return (
    <>
      <div className="min-h-screen w-full relative">
        {/* Peachy Mint Dream Gradient */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(135deg, #FFB5A7 0%, #F8D7DA 25%, #E8F5E8 75%, #B8F2D0 100%)`,
          }}
        />
        <div className="relative z-10 flex items-center justify-center min-h-screen ">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              Login to Your Account
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    type="email"
                    placeholder="Your email..."
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    type="password"
                    placeholder="Your password..."
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>

                {/* Link */}
                <div className="text-right">
                  <Link
                    to="/request-reset"
                    replace={true}
                    className="text-sm text-blue-500 hover:text-blue-800 ">
                    Forgot your password?
                  </Link>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-700 hover:bg-blue-900 text-white font-semibold py-2.5 rounded-lg transition cursor-pointer">
                    Login
                  </button>
                  <div className="flex items-center">
                    <label>Or</label>
                  </div>
                  <Link
                    to="/register"
                    className="text-center flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 rounded-lg transition cursor-pointer">
                    Register
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
