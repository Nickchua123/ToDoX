import api from "@/lib/axios";
import { prepareCsrfHeaders } from "@/lib/csrf";

export async function submitReview({ productId, rating, title, body }) {
  const headers = await prepareCsrfHeaders();
  const payload = {
    product: productId,
    rating: Number(rating),
    title: title?.trim(),
    body: body?.trim(),
  };
  const { data } = await api.post("/reviews", payload, { headers });
  return data;
}

export async function fetchProductReviews(productId, page = 1, limit = 5, opts = {}) {
  const params = new URLSearchParams();
  params.set("product", productId);
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (opts.includeStats !== false) {
    params.set("includeStats", "true");
  }
  const { data } = await api.get(`/reviews?${params.toString()}`);
  return {
    items: data?.items || [],
    total: data?.total || 0,
    page: data?.page || page,
    summary: data?.summary || null,
  };
}
