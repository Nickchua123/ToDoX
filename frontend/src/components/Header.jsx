<<<<<<< Updated upstream
import { Heart, Search, ShoppingCart } from "lucide-react";
=======
﻿import { Heart, Search, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
>>>>>>> Stashed changes

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="bg-brand-primary text-white text-center py-1 text-xs">
        CHÀO ĐÓN BỘ SƯU TẬP THU ĐÔNG 2024
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-brand-dark hover:text-brand-primary transition"
          >
            ND Style
          </Link>

          {/* Menu */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-brand-primary">
              Trang chủ
            </Link>
            <Link to="/category" className="hover:text-brand-primary">
              Nữ
            </Link>
            <Link to="/category1" className="hover:text-brand-primary">
              Nam
            </Link>
            <Link to="/news" className="hover:text-brand-primary">
              Tin tức
            </Link>
            <Link to="/contact" className="hover:text-brand-primary">
              Liên Hệ
            </Link>
            <Link to="/orders" className="hover:text-brand-primary">
              Kiểm tra đơn
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-2">
            {/* Ô tìm kiếm */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                className="bg-transparent text-sm outline-none w-48"
                placeholder="Tìm kiếm..."
              />
            </div>

            {/* Yêu thích */}
            <Link
              to="/favorites"
              className="p-2 rounded-xl hover:bg-gray-100 inline-flex items-center justify-center"
              title="Yêu thích"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Giỏ hàng */}
            <Link
              to="/cart"
              className="p-2 rounded-xl hover:bg-gray-100 relative inline-flex items-center justify-center"
              title="Giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-brand-primary text-white">
                1
              </span>
            </Link>

            {/* 🔹 Tài khoản */}
            <Link
              to="/account"
              className="p-2 rounded-xl hover:bg-gray-100 flex flex-col items-center text-[11px] text-gray-600 hover:text-brand-primary transition"
              title="Tài khoản"
            >
              <User className="w-5 h-5 mb-0.5" />
              <span>Tài khoản</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
