import { createContext } from "react";

export const FavoriteContext = createContext({
  favorites: [],
  favoriteIds: [],
  loading: true,
  refreshFavorites: async () => {},
  toggleFavorite: async () => {},
  isFavorite: () => false,
});
