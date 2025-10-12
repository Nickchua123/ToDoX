// frontend/src/main.jsx
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import api from "./lib/axios";

function Root() {
  useEffect(() => {
    // Gọi để server set cookie XSRF-TOKEN (non-HttpOnly) cho axios
    api.get("/auth/csrf-token").catch(() => {
      // nếu lỗi (ví dụ csurf chưa mount) thì ignore — không làm app crash
    });
  }, []);

  return <App />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
