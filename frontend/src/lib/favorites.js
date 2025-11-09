// Simple favorites store using localStorage
const KEY = "favorites";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

export function getFavorites() {
  return read();
}

export function isFavorite(id) {
  return read().some((p) => String(p.id) === String(id));
}

export function toggleFavorite(product) {
  const items = read();
  const idx = items.findIndex((p) => String(p.id) === String(product.id));
  if (idx >= 0) {
    items.splice(idx, 1);
  } else {
    // Normalize shape
    const normalized = {
      id: product.id,
      title: product.title || product.name || "",
      name: product.name || product.title || "",
      image: product.image || product.thumbnail || product.img || "",
      price: Number(product.price || 0),
      addedAt: Date.now(),
    };
    items.unshift(normalized);
  }
  write(items);
  return items;
}

export function removeFavorite(id) {
  const items = read().filter((p) => String(p.id) !== String(id));
  write(items);
  return items;
}

