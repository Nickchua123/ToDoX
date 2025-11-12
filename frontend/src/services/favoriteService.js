import api from "@/lib/axios";
import { prepareCsrfHeaders } from "@/lib/csrf";

export async function fetchFavorites() {
  const { data } = await api.get("/favorites", { _skipAuthRedirect: true });
  return Array.isArray(data) ? data : [];
}

export async function addFavorite(productId) {
  const headers = await prepareCsrfHeaders();
  await api.post("/favorites", { productId }, { headers });
}

export async function removeFavorite(productId) {
  const headers = await prepareCsrfHeaders();
  await api.delete(`/favorites/${productId}`, { headers });
}
