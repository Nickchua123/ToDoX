import { Heart, Search, ShoppingCart } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="bg-brand-primary text-white text-center py-1 text-xs">
        CHÀO ĐÓN BỘ SƯU TẬP THU ĐÔNG 2024
      </div>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="text-xl font-bold text-brand-dark">ND Style</div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a className="hover:text-brand-primary" href="#">
              Trang chủ
            </a>
            <a className="hover:text-brand-primary" href="#">
              Nữ
            </a>
            <a className="hover:text-brand-primary" href="#">
              Nam
            </a>
            <a className="hover:text-brand-primary" href="#">
              Tin tức
            </a>
            <a className="hover:text-brand-primary" href="#">
              Hệ thống cửa hàng
            </a>
            <a className="hover:text-brand-primary" href="#">
              Kiểm tra đơn
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                className="bg-transparent text-sm outline-none w-48"
                placeholder="Tìm kiếm..."
              />
            </div>
            <button className="p-2 rounded-xl hover:bg-gray-100">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl hover:bg-gray-100 relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-brand-primary text-white">
                1
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
