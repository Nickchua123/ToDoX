import api from "@/lib/axios";
import { prepareCsrfHeaders } from "@/lib/csrf";

const withCartTotals = (cart) => {
  if (!cart || !Array.isArray(cart.items)) {
    return { cart: cart || null, subtotal: 0 };
  }

  const items = cart.items;
  const subtotal = items.reduce((sum, item) => {
    const productPrice = Number(item.product?.price ?? item.price ?? 0);
    const variantDelta = Number(item.variant?.priceDelta ?? 0);
    const quantity = Number(item.quantity ?? 0);
    return sum + (productPrice + variantDelta) * quantity;
  }, 0);

  return { cart, subtotal };
};

export async function fetchCart(config = {}) {
  const { data } = await api.get("/cart", config);
  return withCartTotals(data);
}

export async function addCartItem({ productId, variantId, quantity = 1 }) {
  const headers = await prepareCsrfHeaders();
  await api.post(
    "/cart/items",
    {
      productId,
      variantId,
      quantity,
    },
    { headers }
  );
  return fetchCart();
}

export async function updateCartItem(itemId, quantity) {
  const headers = await prepareCsrfHeaders();
  await api.put(`/cart/items/${itemId}`, { quantity }, { headers });
  return fetchCart();
}

export async function removeCartItem(itemId) {
  const headers = await prepareCsrfHeaders();
  await api.delete(`/cart/items/${itemId}`, { headers });
  return fetchCart();
}

export async function clearCart() {
  const headers = await prepareCsrfHeaders();
  await api.delete("/cart", { headers });
  return fetchCart();
}

export function countCartItems(cart) {
  if (!cart || !Array.isArray(cart.items)) return 0;
  return cart.items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );
}
