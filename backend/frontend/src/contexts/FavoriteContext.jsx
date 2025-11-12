import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { addFavorite, fetchFavorites, removeFavorite } from "@/services/favoriteService";

const FavoriteContext = createContext({
  favorites: [],
  favoriteIds: [],
  loading: true,
  refreshFavorites: async () => {},
  toggleFavorite: async () => {},
  isFavorite: () => false,
});

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchFavorites();
      const list = Array.isArray(data) ? data : [];
      setFavorites(list);
      setFavoriteIds(
        list
          .map((item) => item.product?._id ?? item.product)
          .filter(Boolean)
      );
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const isFavorite = useCallback(
    (productId) => {
      if (!productId) return false;
      return favoriteIds.includes(productId);
    },
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (productId) => {
      if (!productId) return;
      try {
        if (favoriteIds.includes(productId)) {
          await removeFavorite(productId);
        } else {
          await addFavorite(productId);
        }
        await loadFavorites();
      } catch (err) {
        console.error(err);
        toast.error("Không cập nhật được yêu thích");
      }
    },
    [favoriteIds, loadFavorites]
  );

  const value = useMemo(
    () => ({
      favorites,
      favoriteIds,
      loading,
      refreshFavorites: loadFavorites,
      toggleFavorite,
      isFavorite,
    }),
    [favorites, favoriteIds, loading, loadFavorites, toggleFavorite, isFavorite]
  );

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
}

export const useFavorites = () => useContext(FavoriteContext);
