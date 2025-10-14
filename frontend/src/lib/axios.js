import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
  timeout: 10000,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

// Interceptors
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err.response?.status;
    const cfg = err.config || {};

    // CSRF auto-retry once on 403
    if (status === 403 && !cfg._retryCSRF && !cfg.url?.includes("/auth/csrf-token")) {
      try {
        cfg._retryCSRF = true;
        await api.get("/auth/csrf-token");
        return api(cfg);
      } catch (_) {
        // fallthrough
      }
    }

    // 401 -> redirect to login
    if (status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
