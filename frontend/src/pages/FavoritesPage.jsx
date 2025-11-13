// src/pages/FavoritesPage.jsx
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { addCartItem } from "@/services/cartService";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";

const formatPrice = (value) =>
  value ? `${Number(value).toLocaleString("vi-VN")}₫` : "Liên hệ";

export default function FavoritesPage() {
  const { favorites, loading, toggleFavorite } = useFavorites();
  const { refreshCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (productId) => {
    try {
      await addCartItem({ productId, quantity: 1 });
      await refreshCart();
      toast.success("Đã thêm vào giỏ hàng");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không thể thêm sản phẩm vào giỏ.");
    }
  };

  const data = Array.isArray(favorites) ? favorites : [];

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter] text-[#111]">
      <Header />

      <div className="bg-orange-100 text-center py-3 text-orange-600 font-medium">
        Sản phẩm yêu thích
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-500">
        Trang chủ / <span className="text-black font-medium">Yêu thích</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-10">
        {loading ? (
          <p className="text-gray-500 py-20 text-center">Đang tải yêu thích...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            {user ? "Chưa có sản phẩm yêu thích nào." : "Hãy đăng nhập để lưu sản phẩm yêu thích."}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map((fav) => {
              const product = fav.product;
              if (!product) return null;
              const normalized = {
                id: product._id,
                name: product.name,
                price: formatPrice(product.price),
                img: product.images?.[0] || "/logo.png",
              };
              return (
                <ProductCard
                  key={fav._id}
                  {...normalized}
                  onAddToCart={() => handleAddToCart(product._id)}
                  onToggleFavorite={() => toggleFavorite(product._id)}
                  isFavorite
                />
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
