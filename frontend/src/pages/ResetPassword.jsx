import React, { useState } from "react";
import api from "../api/axios";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [params] = useSearchParams();
  const token = params.get("token");

  const handleSubmit = async () => {
    try {
      await api.post("/users/reset-password", { token, newPassword: password });
      toast.success("Password reset successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Peachy Mint Dream Gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, #FFB5A7 0%, #F8D7DA 25%, #E8F5E8 75%, #B8F2D0 100%)`,
        }}
      />
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-8 w-80">
          <h2 className="text-xl font-semibold mb-4 text-center">Reset Password</h2>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full mb-3 p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-800">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
