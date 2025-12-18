import axios from "axios";

// In production (Render), FE and BE thường chạy chung domain => dùng "/api".
// Khi dev, mặc định trỏ localhost:5001; có thể override bằng VITE_API_BASE_URL.
const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:5001/api" : "/api");

const api = axios.create({
  baseURL,
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
    const skipAuthRedirect = Boolean(cfg._skipAuthRedirect);

    // CSRF auto-retry once on 403
    if (status === 403 && !cfg._retryCSRF && !cfg.url?.includes("/auth/csrf-token")) {
      try {
        cfg._retryCSRF = true;
        await api.get("/auth/csrf-token");
        return api(cfg);
      } catch (csrfErr) {
        console.warn("CSRF retry failed", csrfErr);
      }
    }

    // 401 -> try refresh flow once (trừ khi chủ động skip), rồi redirect login nếu không skip
    if (status === 401 && !skipAuthRedirect) {
      if (
        !cfg._retryRefresh &&
        !cfg.url?.includes("/auth/refresh") &&
        !cfg.url?.includes("/auth/login")
      ) {
        try {
          cfg._retryRefresh = true;
          // Ensure CSRF token cookie/header is present for POST /auth/refresh
          await api.get("/auth/csrf-token");
          await api.post("/auth/refresh");
          return api(cfg);
        } catch (refreshErr) {
          console.warn("Refresh token attempt failed", refreshErr);
        }
      }
      try {
        sessionStorage.setItem("postLoginRedirect", window.location.pathname + window.location.search);
      } catch (storageErr) {
        console.warn("Không lưu được postLoginRedirect", storageErr);
      }
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
