import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router";

import Layout from "./Layout";
import MenList from "./pages/MenList";
import CategoryPage from "./pages/CategoryPage";
import FavoritesPage from "./pages/FavoritesPage";
import ContactPage from "./pages/ContactPage";
import NewsPage from "./pages/NewsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderPage from "./pages/OrderPage";
import AddressPage from "./pages/AddressPage";
import PaymentPage from "./pages/PaymentPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotificationsPage from "./pages/NotificationsPage";
import KycPage from "./pages/KycPage";
import AccountLayout from "./components/AccountLayout";
import AccountProfile from "./pages/AccountProfile";
import AccountBank from "./pages/AccountBank";
import AccountPassword from "./pages/AccountPassword";
import AccountVouchers from "./pages/AccountVouchers";
import AccountXu from "./pages/AccountXu";
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
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/account" element={<AccountLayout />}>
              <Route path="profile" element={<AccountProfile />} />
              <Route path="bank" element={<AccountBank />} />
              <Route path="address" element={<AddressPage />} />
              <Route path="password" element={<AccountPassword />} />
              <Route path="payment" element={<PaymentPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="kyc" element={<KycPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="vouchers" element={<AccountVouchers />} />
              <Route path="xu" element={<AccountXu />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}



