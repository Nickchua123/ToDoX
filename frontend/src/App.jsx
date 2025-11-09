import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import Unauthorized from "./pages/Unauthorized";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Layout from "./Layout";
import VerifyCode from "./pages/VerifyCode";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectTodos from "./pages/ProjectTodos";
import ProjectNotes from "./pages/ProjectNotes";
import CartPage from "./pages/CartPage";
import CategoryPage from "./pages/CategoryPage";
import FavoritesPage from "./pages/FavoritesPage";
import ContactPage from "./pages/ContactPage";
import NewsPage from "./pages/NewsPage";
import AddressPage from "./pages/AddressPage";
import CheckoutPage from "./pages/CheckoutPage";
import KycPage from "./pages/KycPage";
import NotificationsPage from "./pages/NotificationsPage";
import OrderPage from "./pages/OrderPage";
import PaymentPage from "./pages/PaymentPage";
import PrivacyPage from "./pages/PrivacyPage";

export default function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/verify" element={<VerifyCode />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectTodos />} />
            <Route path="/projects/:projectId/notes" element={<ProjectNotes />} />
            <Route path="/cart" element={<CartPage />} />
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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
