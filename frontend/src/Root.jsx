import { useEffect, useState } from "react";
import App from "./App.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import MenList from "./pages/MenList.jsx";

export default function Root() {
  const [hash, setHash] = useState(() => location.hash);
  useEffect(() => {
    const fn = () => setHash(location.hash);
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);

  if (hash.startsWith("#/p/")) {
    return <ProductDetail />;
  }
  if (hash === "#/men") {
    return <MenList />;
  }
  return <App />;
}
