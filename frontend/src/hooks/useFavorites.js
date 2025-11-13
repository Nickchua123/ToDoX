import { useContext } from "react";
import { FavoriteContext } from "@/contexts/favorite-context";

export function useFavorites() {
  return useContext(FavoriteContext);
}
