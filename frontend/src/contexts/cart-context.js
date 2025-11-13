import { createContext } from "react";

export const CartContext = createContext({
  totalItems: 0,
  refreshCart: () => {},
});
