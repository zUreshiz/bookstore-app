import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-100">Về Chúng Tôi</h3>
          <p className="text-gray-300 leading-relaxed">
            BookStore là điểm đến lý tưởng cho những người yêu sách, cung cấp đa dạng các
            thể loại sách với giá cả hợp lý.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-100">Links Hữu Ích</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="text-gray-300 hover:text-blue-400 transition-colors">
                Trang Chủ
              </a>
            </li>
            <li>
              <a
                href="/books"
                className="text-gray-300 hover:text-blue-400 transition-colors">
                Sách
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="text-gray-300 hover:text-blue-400 transition-colors">
                Về Chúng Tôi
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-gray-300 hover:text-blue-400 transition-colors">
                Liên Hệ
              </a>
            </li>
            <li>
              <a
                href="/terms"
                className="text-gray-300 hover:text-blue-400 transition-colors">
                Điều Khoản Sử Dụng
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-100">Danh Mục Sách</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="/category/fiction"
                className="text-gray-300 hover:text-blue-400 transition-colors">
                Văn Học
              </a>
            </li>
            <li>
              <a
                href="/category/business"
                className="text-gray-300 hover:text-blue-400 transition-colors">
                Kinh Tế
              </a>
            </li>
            <li>
              <a
                href="/category/children"
                className="text-gray-300 hover:text-blue-400 transition-colors">
                Thiếu Nhi
              </a>
            </li>
            <li>
              <a
                href="/category/education"
                className="text-gray-300 hover:text-blue-400 transition-colors">
                Giáo Dục
              </a>
            </li>
            <li>
              <a
                href="/category/lifestyle"
                className="text-gray-300 hover:text-blue-400 transition-colors">
                Lifestyle
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-100">Liên Hệ</h3>
          <div className="space-y-2 text-gray-300">
            <p>Email: contact@bookstore.com</p>
            <p>Điện thoại: (84) 123-456-789</p>
            <p>Địa chỉ: 123 Đường Sách, Quận 1, TP.HCM</p>
          </div>
          <div className="flex space-x-4 pt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-400 transition-colors text-2xl">
              <i className="fab fa-facebook"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-400 transition-colors text-2xl">
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-blue-400 transition-colors text-2xl">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="text-center pt-8 mt-8 border-t border-gray-700">
        <p className="text-gray-400 text-sm">
          &copy; {currentYear} BookStore. Tất cả các quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
