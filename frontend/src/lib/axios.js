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

    // 401 -> try refresh flow once, then redirect to login on failure
    if (
      status === 401 &&
      !skipAuthRedirect &&
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

    if (status === 401 && !skipAuthRedirect) {
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
