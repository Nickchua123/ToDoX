// src/pages/FavoritesPage.jsx
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(() => getFavorites());

  // Đồng bộ giữa các tab
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "favorites") setFavorites(getFavorites());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleToggleFavorite = (p) => {
    setFavorites(toggleFavorite(p));
  };

  const handleAddToCart = (p) => {
    addToCart(p, 1);
    try {
      toast.success("Đã thêm vào giỏ hàng");
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter] text-[#111]">
      {/* Header */}
      <Header />

      {/* Banner tiêu đề */}
      <div className="bg-orange-100 text-center py-3 text-orange-600 font-medium">
        Sản phẩm yêu thích
      </div>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-500">
        Trang chủ / <span className="text-black font-medium">Yêu thích</span>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 pb-10">
        {favorites.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
            isFavorite
            onToggleFavorite={() => handleToggleFavorite(item)}
            onAddToCart={() => handleAddToCart(item)}
          />
        ))}
      </div>

      {/* Khi không có sản phẩm */}
      {favorites.length === 0 && (
        <p className="text-center text-gray-500 py-20">
          Chưa có sản phẩm yêu thích nào.
        </p>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
