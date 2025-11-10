<<<<<<< Updated upstream
import { useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import SectionHeading from "./components/SectionHeading.jsx";
import ProductCard from "./components/ProductCard.jsx";
import CategoryRound from "./components/CategoryRound.jsx";
import CouponCard from "./components/CouponCard.jsx";
import NewsCard from "./components/NewsCard.jsx";
import Testimonial from "./components/Testimonial.jsx";
import WomenCollection from "./components/WomenCollection.jsx";
import MenCollection from "./components/MenCollection.jsx";
import {
  products,
  hero,
  categories,
  coupons,
  news,
  gallery,
  accessoriesMale,
  accessoriesFemale,
  suggestionsToday,
  suggestionsBest,
  specialDeals,
} from "./data/mock.js";

const asset = (p) => new URL(`./anhNNKB/${p}`, import.meta.url).href;
=======
﻿import { Toaster } from "sonner";
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
import NotFound from "./pages/NotFound";
>>>>>>> Stashed changes

export default function App() {
  const [tab, setTab] = useState("gia-tot");
  const [accTab, setAccTab] = useState("nam");

  return (
<<<<<<< Updated upstream
    <div className="min-h-screen bg-white">
      <Header />

      {/* 1. HERO: Banner */}
      <section className="section-hero">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="rounded-2xl overflow-hidden shadow-card">
            <img src={hero} className="w-full h-72 md:h-[380px] lg:h-[460px] object-cover" />
          </div>
        </div>
      </section>

      {/* 2. DANH MỤC TRANG */}
      <section className="py-10 section-surface">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-4 md:grid-cols-8 gap-6">
          {categories.map((c, i) => (
            <CategoryRound key={i} {...c} />
          ))}
        </div>
      </section>

      {/* 3. COUPON */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <SectionHeading title="DÀNH RIÊNG CHO BẠN" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {coupons.map((cp, i) => (
            <CouponCard key={i} {...cp} />
          ))}
        </div>
      </section>

      {/* 4. ƯU ĐÃI ĐẶC BIỆT (grid 4) */}
      <section className="py-10 bg-gradient-to-b from-[#ffe7df] to-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading title="Ưu đãi đặc biệt" />
          <div className="grid md:grid-cols-4 gap-4">
            {specialDeals.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
          <div className="text-center mt-6">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50">Xem tất cả</button>
          </div>
        </div>
      </section>

      {/* 5. GỢI Ý HÔM NAY */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <SectionHeading title="Gợi ý hôm nay" />
        {/* Tabs: Hàng mới về / Giá tốt */}
        <div className="flex items-center justify-center gap-6 text-sm">
          {[
            { id: "moi", label: "Hàng mới về" },
            { id: "gia-tot", label: "Giá tốt" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`${tab === t.id ? "text-brand-primary border-b-2 border-brand-primary" : "text-gray-500"} pb-1`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          {(tab === "gia-tot" ? suggestionsBest : suggestionsToday).map((p, i) => (
            <ProductCard key={i} {...p} />
          ))}
        </div>
      </section>

      {/* 6. 4 BANNER KHỐI */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <img className="rounded-2xl shadow-card" src={asset("img_banner_1.webp")} />
          <img className="rounded-2xl shadow-card" src={asset("img_banner_2.webp")} />
          <div className="grid gap-4">
            <img className="rounded-2xl shadow-card" src={asset("img_banner_3.webp")} />
            <img className="rounded-2xl shadow-card" src={asset("img_banner_4.webp")} />
          </div>
        </div>
      </section>

      {/* 7. BỘ SƯU TẬP NAM */}
      <MenCollection />

      {/* 8. LOOKBOOK + TEXT */}
      <section className="py-10 bg-[#ffefe8]">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-6 items-center">
          <img className="rounded-2xl shadow-card" src={asset("image_lookbook_1.webp")} />
          <div>
            <h3 className="text-3xl font-semibold">ENCHANTING DRESS 2024</h3>
            <p className="mt-3 text-gray-600">BST đầm dệt kim, tone pastel hiện đại, phối đi làm & đi chơi.</p>
            <button className="mt-4 px-4 py-2 rounded-xl bg-brand-primary text-white">Xem thêm</button>
          </div>
        </div>
      </section>

      {/* 9. BỘ SƯU TẬP NỮ */}
      <WomenCollection />

      {/* 10. BLACK FRIDAY 4 TILE */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-4 items-stretch">
          <img className="rounded-2xl shadow-card object-cover w-full" src={asset("img_banner_1.webp")} />
          <div className="grid gap-4">
            <img className="rounded-2xl shadow-card" src={asset("img_banner_2.webp")} />
            <img className="rounded-2xl shadow-card" src={asset("img_banner_3.webp")} />
          </div>
          <img className="rounded-2xl shadow-card object-cover w-full" src={asset("img_banner_4.webp")} />
        </div>
      </section>

      {/* 11. PHỤ KIỆN (tabs: nam / nữ) */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <SectionHeading title="PHỤ KIỆN" />
        <div className="flex items-center justify-center gap-6 text-sm">
          {[
            { id: "nam", label: "Phụ kiện nam" },
            { id: "nu", label: "Phụ kiện nữ" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setAccTab(t.id)}
              className={`${accTab === t.id ? "text-brand-primary border-b-2 border-brand-primary" : "text-gray-500"} pb-1`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {(accTab === "nam" ? accessoriesMale : accessoriesFemale).map((item, i) => (
            <ProductCard key={i} {...item} />
          ))}
        </div>
      </section>

      {/* 12. TESTIMONIAL */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <Testimonial />
      </section>

      {/* 13. TIN TỨC */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <SectionHeading title="Tin tức" />
        <div className="grid md:grid-cols-[2fr_1fr] gap-4">
          <NewsCard {...news[0]} />
          <div className="grid gap-4">
            <NewsCard {...news[1]} />
            <NewsCard {...news[2]} />
          </div>
        </div>
        <div className="text-center mt-6">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50">Xem tất cả</button>
        </div>
      </section>

      {/* 14. GALLERY */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <SectionHeading title="Cập nhật từ ND STYLE" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((g, i) => (
            <img key={i} className="rounded-2xl shadow-card border object-cover w-full h-48" src={g} />
          ))}
        </div>
        <div className="text-center mt-6">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ffefe8] text-brand-dark border border-orange-200">Theo dõi ngay</button>
        </div>
      </section>

      <Footer />
    </div>
=======
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/men" element={<MenList />} /> {/* thêm */}
            <Route path="/p/:id" element={<ProductDetail />} />{" "}
            {/* GIỮ 1 lần */}
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
>>>>>>> Stashed changes
  );
}
