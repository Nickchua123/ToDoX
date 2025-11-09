import { Heart, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProductCard({
  product,
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
}) {
  const title = product?.title || product?.name || "Sản phẩm";
  const image = product?.image || product?.thumbnail || product?.img || "";
  const price = Number(product?.price || 0);
  const colors = Array.isArray(product?.colors) ? product.colors : [];

  return (
    <Card className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition hover:-translate-y-0.5 relative group">
      {image ? (
        <img
          src={image}
          alt={title}
          className="w-full h-72 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-72 bg-muted rounded-t-2xl" />
      )}

      {onToggleFavorite && (
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white rounded-full shadow"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product);
            }}
            aria-label={isFavorite ? "Bỏ yêu thích" : "Thêm yêu thích"}
            title={isFavorite ? "Bỏ yêu thích" : "Thêm yêu thích"}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "text-red-500 fill-red-500" : "text-gray-500"}`} />
          </Button>
        </div>
      )}

      {onAddToCart && (
        <div className="absolute inset-x-0 top-[60%] -translate-y-[20%] flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            className="bg-white text-black font-medium rounded-full shadow-md hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" /> Thêm vào giỏ hàng
          </Button>
        </div>
      )}

      <CardContent className="pt-3 pb-5 px-3 flex flex-col items-center">
        {colors.length > 0 && (
          <div className="flex justify-center gap-2 mb-2">
            {colors.map((color, i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-full border ${color?.selected ? "border-primary" : "border-gray-300"} flex items-center justify-center`}
              >
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color?.hex || "#ddd" }} />
              </div>
            ))}
          </div>
        )}

        <h3 className="text-sm font-medium text-gray-800 mb-1 text-center line-clamp-2">
          {title}
        </h3>
        <div className="text-orange-600 font-semibold">
          {price > 0 ? price.toLocaleString("vi-VN") + "₫" : ""}
        </div>
      </CardContent>
    </Card>
  );
}

