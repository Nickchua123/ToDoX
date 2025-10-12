// ...existing code...
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
  timeout: 10000,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
        return api(original);
      } catch (e) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
// ...existing code...