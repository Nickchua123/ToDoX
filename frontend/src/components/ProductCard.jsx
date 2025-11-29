// src/components/ProductCard.jsx
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { useEffect, useState } from "react";

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
  const [toggling, setToggling] = useState(false);
  const [optimisticFavorite, setOptimisticFavorite] = useState(false);
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
    <div className={`relative w-full ${compact ? "h-52" : "h-64"}`}>
      <img
        src={img}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );

  // Dùng id thực (ObjectId) cho thao tác yêu thích; slug chỉ dùng cho URL
  const entityId = id || slug;
  const normalizedEntityId = entityId ? String(entityId) : "";
  const resolvedIsFavorite =
    typeof isFavorite === "boolean"
      ? isFavorite
      : Boolean(normalizedEntityId && markFavorite?.(normalizedEntityId));
  useEffect(() => {
    setOptimisticFavorite(resolvedIsFavorite);
  }, [resolvedIsFavorite]);
  const defaultToggle =
    !onToggleFavorite && toggleFavorite && normalizedEntityId
      ? () => toggleFavorite(normalizedEntityId)
      : undefined;
  const favoriteHandler = onToggleFavorite || defaultToggle;

  const handleFavoriteClick = async () => {
    if (!favoriteHandler || toggling) return;
    setToggling(true);
    setOptimisticFavorite(!resolvedIsFavorite);
    try {
      await Promise.resolve(favoriteHandler());
    } catch (err) {
      // Revert if failed
      setOptimisticFavorite(resolvedIsFavorite);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden hover:-translate-y-0.5 transition h-full flex flex-col">
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
            onClick={handleFavoriteClick}
            disabled={toggling}
            className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow transition ${
              toggling ? "opacity-60 cursor-wait" : "hover:bg-white"
            }`}
            aria-label={resolvedIsFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                optimisticFavorite ? "scale-110" : ""
              }`}
              stroke={optimisticFavorite ? "#f97316" : "currentColor"}
              fill={optimisticFavorite ? "#f97316" : "none"}
            />
          </button>
        ) : null}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div
          className={`${compact ? "text-[13px]" : "text-sm"} text-gray-700 leading-snug min-h-[36px] overflow-hidden`}
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
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
