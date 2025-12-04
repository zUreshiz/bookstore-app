import React, { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { Link } from "react-router";
import Loading from "../components/Loading";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/users/register", form);
      toast.success(res.data.message || "Create Account Success");
      setForm({ name: "", email: "", phoneNumber: "", password: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };


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
              Register New Account
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    type="text"
                    placeholder="Your name..."
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

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

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    type="phone"
                    placeholder="Your phone..."
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
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

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-700 hover:bg-blue-900 text-white font-semibold py-2.5 rounded-lg transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                    disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                  </button>
                </div>
              </div>
            </form>
            <div className="flex gap-3  pt-4">
              <Link
                to="/login"
                className=" text-center flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 rounded-lg transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
