import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { addFavorite, fetchFavorites, removeFavorite } from "@/services/favoriteService";
import { useAuth } from "@/hooks/useAuth";
import { FavoriteContext } from "./favorite-context";

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
          .map((value) => String(value))
      );
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setFavoriteIds([]);
      setLoading(false);
      return;
    }
    loadFavorites();
  }, [loadFavorites, user]);

  const normalizeId = useCallback((value) => (value ? String(value) : ""), []);
  const isFavorite = useCallback(
    (productId) => {
      const normalized = normalizeId(productId);
      return Boolean(normalized && favoriteIds.includes(normalized));
    },
    [favoriteIds, normalizeId]
  );

  const toggleFavorite = useCallback(
    async (productId) => {
      if (!productId) return;
      try {
        const normalized = normalizeId(productId);
        if (!normalized) return;
        if (favoriteIds.includes(normalized)) {
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
    [favoriteIds, loadFavorites, normalizeId]
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
