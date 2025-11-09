import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(() => getFavorites());

  // Keep in sync if other tabs modify
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
    try { toast.success("Đã thêm vào giỏ hàng"); } catch {}
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-orange-100 text-center py-3 text-orange-600 font-medium">
        Sản phẩm yêu thích
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-500">
        Trang chủ / <span className="text-black font-medium">Yêu thích</span>
      </div>

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

      {favorites.length === 0 && (
        <p className="text-center text-gray-500 py-20">
          Chưa có sản phẩm yêu thích nào.
        </p>
      )}
    </div>
  );
}
