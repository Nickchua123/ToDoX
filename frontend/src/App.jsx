import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router";

import Layout from "./Layout";
import MenList from "./pages/MenList";
import CategoryPage from "./pages/CategoryPage";
import FavoritesPage from "./pages/FavoritesPage";
import ContactPage from "./pages/ContactPage";
import NewsPage from "./pages/NewsPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderPage from "./pages/OrderPage";
import AddressPage from "./pages/AddressPage";
import PaymentPage from "./pages/PaymentPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotificationsPage from "./pages/NotificationsPage";
import KycPage from "./pages/KycPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<MenList />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/account/address" element={<AddressPage />} />
            <Route path="/account/payment" element={<PaymentPage />} />
            <Route path="/account/privacy" element={<PrivacyPage />} />
            <Route path="/account/kyc" element={<KycPage />} />
            <Route path="/account/notifications" element={<NotificationsPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
