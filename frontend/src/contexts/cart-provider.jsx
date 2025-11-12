import React, { useEffect, useMemo, useState } from "react";
import { fetchCart } from "@/services/cartService";
import { toast } from "sonner";
import { CartContext } from "./cart-context";

export function CartProvider({ children }) {
  const [cartData, setCartData] = useState({ cart: null, subtotal: 0 });

  const loadCart = async () => {
    try {
      const data = await fetchCart({ _skipAuthRedirect: true });
      setCartData(data);
    } catch (err) {
      const status = err?.response?.status;
      if (status !== 401) {
        const message = err?.response?.data?.message || "Không thể tải giỏ hàng.";
        toast.error(message);
      }
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const totalItems = useMemo(() => {
    const items = cartData.cart?.items || [];
    return items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }, [cartData]);

  return (
    <CartContext.Provider value={{ totalItems, refreshCart: loadCart }}>
      {children}
    </CartContext.Provider>
  );
}
