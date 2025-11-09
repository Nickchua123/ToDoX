const KEY = "cart";

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
    // notify other tabs
    window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
  } catch {}
}

export function getCart() {
  return read();
}

export function total(items = read()) {
  return items.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0), 0);
}

export function addToCart(product, qty = 1) {
  const items = read();
  const id = String(product.id);
  const idx = items.findIndex((p) => String(p.id) === id);
  if (idx >= 0) {
    items[idx].quantity = Number(items[idx].quantity || 0) + Number(qty || 1);
  } else {
    items.push({
      id: product.id,
      name: product.name || product.title || "",
      title: product.title || product.name || "",
      image: product.image || product.thumbnail || product.img || "",
      price: Number(product.price || 0),
      quantity: Number(qty || 1),
    });
  }
  write(items);
  return items;
}

export function updateQty(id, qty) {
  const items = read();
  const i = items.findIndex((p) => String(p.id) === String(id));
  if (i < 0) return items;
  const n = Number(qty);
  if (!Number.isFinite(n) || n <= 0) {
    items.splice(i, 1);
  } else {
    items[i].quantity = n;
  }
  write(items);
  return items;
}

export function increment(id) {
  const items = read();
  const i = items.findIndex((p) => String(p.id) === String(id));
  if (i >= 0) {
    items[i].quantity = Number(items[i].quantity || 0) + 1;
    write(items);
  }
  return items;
}

export function decrement(id) {
  const items = read();
  const i = items.findIndex((p) => String(p.id) === String(id));
  if (i >= 0) {
    const q = Number(items[i].quantity || 0) - 1;
    if (q <= 0) items.splice(i, 1); else items[i].quantity = q;
    write(items);
  }
  return items;
}

export function removeFromCart(id) {
  const items = read().filter((p) => String(p.id) !== String(id));
  write(items);
  return items;
}

export function clearCart() {
  write([]);
  return [];
}

