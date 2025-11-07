import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";

const NewsletterSignup = ({
  onSubmit,
  placeholder = "Nhập email của bạn",
  buttonText = "Đăng ký ngay",
  className = "",
  theme = "blue",
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const validateEmail = (value) => {
    const re = /^\S+@\S+\.\S+$/;
    return re.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) return setError("Vui lòng nhập email.");
    if (!validateEmail(email)) return setError("Địa chỉ email không hợp lệ.");

    if (onSubmit) {
      try {
        setLoading(true);
        await onSubmit(email);
        setSuccess("Cảm ơn! Bạn đã đăng ký thành công.");
        setEmail("");
      } catch (err) {
        setError((err && err.message) || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    } else {
      // demo success when no onSubmit provided
      setSuccess("Cảm ơn! Bạn đã đăng ký thành công.");
      setEmail("");
    }
  };

  // we inject classes inline below based on `theme` prop (blue | muted)

  return (
    <section className={`w-full ${className}`} aria-labelledby="newsletter-heading">
      <div
        className={
          theme === "muted"
            ? "bg-gradient-to-r from-sky-700 via-indigo-800 to-violet-800 text-white py-12"
            : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12"
        }>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div
            className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 shadow-md mx-auto ${
              theme === "muted" ? "bg-white text-sky-700" : "bg-white text-blue-600"
            }`}>
            <FaEnvelope className="w-6 h-6" />
          </div>

          <h3 id="newsletter-heading" className="text-2xl font-semibold mb-2">
            Đăng ký nhận tin
          </h3>
          <p className="text-white/90 mb-6">
            Nhận thông tin về sách mới, ưu đãi đặc biệt và các chương trình khuyến mãi hấp
            dẫn
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-center gap-3 flex-wrap">
            <label htmlFor="ns-email" className="sr-only">
              Email
            </label>
            <input
              id="ns-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              aria-label="Email đăng ký"
              className={
                theme === "muted"
                  ? "w-[360px] max-w-full rounded-md px-4 py-3 outline-none bg-white/8 placeholder-white/50 border border-white/6 focus:border-white/20 shadow-sm text-white"
                  : "w-[360px] max-w-full rounded-md px-4 py-3 outline-none bg-white/10 placeholder-white/60 border border-white/10 focus:border-white/30 shadow-sm text-white"
              }
            />

            <button
              type="submit"
              disabled={loading}
              className={
                theme === "muted"
                  ? "inline-flex items-center justify-center bg-white/95 text-sky-700 font-semibold px-5 py-3 rounded-md shadow-sm hover:shadow-md disabled:opacity-60"
                  : "inline-flex items-center justify-center bg-white text-blue-600 font-semibold px-5 py-3 rounded-md shadow-sm hover:shadow-md disabled:opacity-60"
              }>
              {loading ? "Đang gửi..." : buttonText}
            </button>
          </form>

          <div className="mt-4 min-h-[1.25rem]">
            {error && <p className="text-sm text-red-200">{error}</p>}
            {success && <p className="text-sm text-white">{success}</p>}
          </div>

          <p className="text-xs text-white/80 mt-6">
            Bằng việc đăng ký, bạn đồng ý với điều khoản sử dụng của chúng tôi
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
