import React from "react";
import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Layout from "./Layout";
import MenList from "./pages/MenList"; // GIỮ vì ta sẽ thêm route /men
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail.jsx";
import CategoryPage from "./pages/CategoryPage";
import CategoryPage1 from "./pages/CategoryPage1";
import FavoritesPage from "./pages/FavoritesPage";
import ContactPage from "./pages/ContactPage";
import NewsPage from "./pages/NewsPage";
import NewsPage1 from "./pages/NewsPage1";
import NewsPage2 from "./pages/NewsPage2";
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
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyCode from "./pages/VerifyCode";
import NotFound from "./pages/NotFound";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoriteProvider } from "./contexts/FavoriteContext";

export default function App() {
  return (
    <AuthProvider>
      <FavoriteProvider>
        <CartProvider>
          <Toaster richColors />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/men" element={<MenList />} />
                <Route path="/p/:id" element={<ProductDetail />} />
                <Route path="/category" element={<CategoryPage />} />
                <Route path="/category1" element={<CategoryPage1 />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/news" element={<NewsPage />}>
                  <Route index element={<NewsPage1 />} />
                  <Route path="2" element={<NewsPage2 />} />
                </Route>
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrderPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot" element={<ForgotPassword />} />
                <Route path="/reset" element={<ResetPassword />} />
                <Route path="/verify" element={<VerifyCode />} />
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
        </CartProvider>
      </FavoriteProvider>
    </AuthProvider>
  );
}

