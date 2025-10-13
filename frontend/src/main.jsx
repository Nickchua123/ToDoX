// frontend/src/main.jsx
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import api from "./lib/axios";

function Root() {
  useEffect(() => {
    // Fetch CSRF token and set axios header for subsequent POST/PUT/DELETE
    api
      .get("/auth/csrf-token")
      .then((res) => {
        if (res?.data?.csrfToken) {
          api.defaults.headers.common["X-XSRF-TOKEN"] = res.data.csrfToken;
        }
      })
      .catch(() => {
        // ignore; protected POSTs will fail until this succeeds
      });
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);

