import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  loading: true,
  refreshAuth: async () => {},
  logout: async () => {},
});
