// src/components/ProductCard.jsx
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "@/contexts/FavoriteContext";

export default function ProductCard({
  id,
  slug,
  name,
  price,
  old,
  img,
  tag,
  compact = false,
  isFavorite = false,
  onToggleFavorite,
}) {
  const { isFavorite: markFavorite, toggleFavorite } = useFavorites();
  // Ưu tiên slug/id được truyền xuống; fallback giữ logic cũ dựa trên đường dẫn ảnh
  const linkId = (() => {
    if (slug) return String(slug);
    if (id) return String(id);
    if (typeof img === "string") {
      const m1 = img.match(/\/assets\/(\d+)[.-]/); // built path
      if (m1) return m1[1];
      const m2 = img.match(/\/anhNNKB\/(\d+)\./); // dev path
      if (m2) return m2[1];
    }
    return undefined;
  })();

  const ImgEl = (
    <img
      src={img}
      alt={name}
      className={`w-full ${compact ? "h-56" : "h-72"} object-cover`}
    />
  );

  const entityId = slug || id;
  const normalizedEntityId = entityId ? String(entityId) : "";
  const resolvedIsFavorite =
    typeof isFavorite === "boolean"
      ? isFavorite
      : Boolean(normalizedEntityId && markFavorite?.(normalizedEntityId));
  const defaultToggle =
    !onToggleFavorite && toggleFavorite && normalizedEntityId
      ? () => toggleFavorite(normalizedEntityId)
      : undefined;
  const favoriteHandler = onToggleFavorite || defaultToggle;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden hover:-translate-y-0.5 transition">
      <div className="relative">
        {linkId ? <Link to={`/p/${linkId}`}>{ImgEl}</Link> : ImgEl}

        {tag ? (
          <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-white/90 border text-orange-500 font-semibold">
            -{tag}%
          </span>
        ) : null}

        {favoriteHandler ? (
          <button
            type="button"
            onClick={favoriteHandler}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow transition"
            aria-label={resolvedIsFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          >
            <Heart
              className="w-4 h-4"
              stroke={resolvedIsFavorite ? "#f97316" : "currentColor"}
              fill={resolvedIsFavorite ? "#f97316" : "none"}
            />
          </button>
        ) : null}
      </div>

      <div className="p-4">
        <div
          className={`${
            compact ? "text-[13px]" : "text-sm"
          } text-gray-700 line-clamp-2 min-h-[44px] leading-snug`}
        >
          {name}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div className="text-brand-dark font-semibold">{price}</div>
          {old ? (
            <div className="text-xs line-through text-gray-400">{old}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
