import { useEffect, useState } from "react";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";

export default function CategoryPage() {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("Mặc định");
  const [favorites, setFavorites] = useState(() => getFavorites());

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products?limit=12")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sort) {
      case "az":
        return a.title.localeCompare(b.title);
      case "za":
        return b.title.localeCompare(a.title);
      case "priceAsc":
        return a.price - b.price;
      case "priceDesc":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const handleToggleFavorite = (p) => {
    const mapped = {
      id: p.id,
      title: p.title,
      image: p.image,
      price: p.price * 24000,
    };
    setFavorites(toggleFavorite(mapped));
  };

  const handleAddToCart = (p) => {
    const mapped = { id: p.id, title: p.title, image: p.image, price: p.price * 24000 };
    addToCart(mapped, 1);
    try { toast.success("Đã thêm vào giỏ hàng"); } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Phụ kiện nữ</h1>

        {/* Sắp xếp theo */}
        <div className="flex items-center gap-2 relative z-50">
          <span className="text-gray-700 text-sm font-medium">Sắp xếp theo</span>
          <Select onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent className="z-[1000] bg-white border shadow-lg rounded-lg">
              <SelectItem value="Mặc định">Mặc định</SelectItem>
              <SelectItem value="A -> Z">A → Z</SelectItem>
              <SelectItem value="Z -> A">Z → A</SelectItem>
              <SelectItem value="Giá tăng dần">Giá tăng dần</SelectItem>
              <SelectItem value="Giá giảm dần">Giá giảm dần</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Sản phẩm */}
        <div className="col-span-9 grid grid-cols-2 md:grid-cols-3 gap-6">
          {sortedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={{ id: p.id, title: p.title, image: p.image, price: p.price * 24000 }}
              isFavorite={favorites.some((f) => String(f.id) === String(p.id))}
              onToggleFavorite={() => handleToggleFavorite(p)}
              onAddToCart={() => handleAddToCart(p)}
            />
          ))}
        </div>

        {/* Bộ lọc bên phải */}
        <div className="col-span-3 space-y-6">
          {/* Danh mục */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-3">Danh mục sản phẩm</h2>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="cursor-pointer hover:text-pink-500">Tất cả</li>
              <li className="cursor-pointer hover:text-pink-500">Túi nữ</li>
              <li className="cursor-pointer hover:text-pink-500">Phụ kiện khác</li>
            </ul>
          </div>

          {/* Mức giá */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-3">Chọn mức giá</h2>
            {["Dưới 200.000₫", "200.000₫ - 500.000₫", "500.000₫ - 700.000₫", "700.000₫ - 1.000.000₫", "Trên 1.000.000₫"].map(
              (p, i) => (
                <div key={i} className="flex items-center space-x-2 mb-1">
                  <Checkbox id={p} />
                  <label htmlFor={p} className="text-sm">
                    {p}
                  </label>
                </div>
              )
            )}
          </div>

          {/* Màu sắc */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-3">Màu phổ biến</h2>
            <div className="flex flex-wrap gap-2">
              {["Kem", "Nâu", "Hồng", "Đen", "Cam", "Vàng", "Xanh dương", "Tím", "Xanh lá cây", "Xám"].map(
                (color) => (
                  <Badge
                    key={color}
                    variant="outline"
                    className="cursor-pointer px-3 py-1 text-sm hover:bg-pink-50 hover:border-pink-400 transition-all"
                  >
                    {color}
                  </Badge>
                )
              )}
            </div>
          </div>

          {/* Size */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-3">Size</h2>
            <div className="flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL", "2XL", "3XL", "Free Size"].map((size) => (
                <Badge
                  key={size}
                  variant="outline"
                  className="cursor-pointer px-3 py-1 text-sm hover:bg-pink-50 hover:border-pink-400 transition-all"
                >
                  {size}
                </Badge>
              ))}
            </div>
          </div>

          {/* Kiểu dáng */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-3">Kiểu dáng</h2>
            <div className="flex items-center space-x-2">
              <Checkbox id="bag" />
              <label htmlFor="bag" className="text-sm">
                Túi xách
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
