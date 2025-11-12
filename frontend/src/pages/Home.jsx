import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ProductCard from "../components/ProductCard.jsx";
import CategoryRound from "../components/CategoryRound.jsx";
import CouponCard from "../components/CouponCard.jsx";
import NewsCard from "../components/NewsCard.jsx";
import Testimonial from "../components/Testimonial.jsx";
import WomenCollection from "../components/WomenCollection.jsx";
import MenCollection from "../components/MenCollection.jsx";
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
} from "../data/mock.js";
import api from "@/lib/axios.js";
import { toast } from "sonner";

const asset = (p) => new URL(`../anhNNKB/${p}`, import.meta.url).href;
const fallbackImage = asset("img_banner_1.webp");
const formatPrice = (value) =>
  typeof value === "number"
    ? `${value.toLocaleString("vi-VN")}₫`
    : value || "Liên hệ";

const pickSpecificCategories = (allCats, rootName, childNames = []) => {
  const root = allCats.find((cat) => cat.name === rootName && !cat.parent);
  if (!root) return [];
  const subCats = allCats.filter(
    (cat) => cat.parent && String(cat.parent) === String(root._id)
  );
  const byName = new Map(subCats.map((cat) => [cat.name, cat]));
  return childNames
    .map((name) => byName.get(name))
    .filter(Boolean)
    .map((cat) => ({
      label: cat.name,
      slug: cat.slug,
      img: cat.image || fallbackImage,
    }));
};

export default function Home() {
  const [tab, setTab] = useState("gia-tot");
  const [accTab, setAccTab] = useState("nam");
  const [categoryData, setCategoryData] = useState(categories);
  const [specialDealsData, setSpecialDealsData] = useState(specialDeals);
  const [suggestNew, setSuggestNew] = useState(suggestionsToday);
  const [suggestDeals, setSuggestDeals] = useState(suggestionsBest);
  const [loadingHome, setLoadingHome] = useState(true);

  useEffect(() => {
    const loadHome = async () => {
      try {
        const [catRes, newRes, dealRes] = await Promise.all([
          api.get("/categories?limit=200"),
          api.get("/products?limit=8&sort=-createdAt"),
          api.get("/products?limit=8&sort=-price"),
        ]);
        const allCats = catRes.data || [];
        const femaleGroup = pickSpecificCategories(allCats, "Nữ", [
          "Đồ thể thao nữ",
          "Áo nữ",
          "Quần nữ",
          "Phụ kiện nữ",
        ]);
        const maleGroup = pickSpecificCategories(allCats, "Nam", [
          "Đồ thể thao nam",
          "Áo nam",
          "Quần nam",
          "Phụ kiện nam",
        ]);
        const mappedCats = [...femaleGroup, ...maleGroup];
        if (mappedCats.length) setCategoryData(mappedCats);

        const mapProducts = (items) =>
          (items || []).map((p) => ({
            id: p._id,
            name: p.name,
            price: formatPrice(p.price),
            img: p.images?.[0] || fallbackImage,
          }));

        const newProducts = mapProducts(newRes.data?.items || newRes.data || []);
        if (newProducts.length) setSuggestNew(newProducts);

        const dealProducts = mapProducts(dealRes.data?.items || dealRes.data || []);
        if (dealProducts.length) {
          setSuggestDeals(dealProducts);
          setSpecialDealsData(dealProducts.slice(0, 4));
        }
      } catch (err) {
        console.error(err);
        toast.error("Không tải được dữ liệu mới, hiển thị nội dung mặc định.");
      } finally {
        setLoadingHome(false);
      }
    };
    loadHome();
  }, []);

  const currentSuggestions = useMemo(
    () => (tab === "gia-tot" ? suggestDeals : suggestNew),
    [tab, suggestDeals, suggestNew]
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* 1. HERO: Banner */}
      <section className="section-hero">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="rounded-2xl overflow-hidden shadow-card">
            <img
              src={hero}
              alt="ND Style Hero"
              className="w-full h-72 md:h-[380px] lg:h-[460px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. DANH MỤC TRANG */}
      <section className="py-10 section-surface">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-4 md:grid-cols-8 gap-6">
          {categoryData.map((c, i) => (
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
            {(specialDealsData.length ? specialDealsData : products.slice(0, 4)).map(
              (p, i) => (
                <ProductCard key={p.id ?? i} {...p} />
              )
            )}
          </div>
          <div className="text-center mt-6">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50">
              Xem tất cả
            </button>
          </div>
        </div>
      </section>

      {/* 5. GỢI Ý HÔM NAY */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <SectionHeading title="Gợi ý hôm nay" />
        <div className="flex items-center justify-center gap-6 text-sm">
          {[
            { id: "moi", label: "Hàng mới về" },
            { id: "gia-tot", label: "Giá tốt" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`${
                tab === t.id
                  ? "text-brand-primary border-b-2 border-brand-primary"
                  : "text-gray-500"
              } pb-1`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-4 gap-4 mt-6">
          {currentSuggestions.map((p, i) => (
            <ProductCard key={p.id ?? i} {...p} />
          ))}
        </div>
      </section>

      {/* 6. 4 BANNER KHỐI */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <img
            className="rounded-2xl shadow-card"
            src={asset("img_banner_1.webp")}
            alt="Banner 1"
          />
          <img
            className="rounded-2xl shadow-card"
            src={asset("img_banner_2.webp")}
            alt="Banner 2"
          />
          <div className="grid gap-4">
            <img
              className="rounded-2xl shadow-card"
              src={asset("img_banner_3.webp")}
              alt="Banner 3"
            />
            <img
              className="rounded-2xl shadow-card"
              src={asset("img_banner_4.webp")}
              alt="Banner 4"
            />
          </div>
        </div>
      </section>

      {/* 7. BỘ SƯU TẬP NAM */}
      <MenCollection />

      {/* 8. LOOKBOOK + TEXT */}
      <section className="py-10 bg-[#ffefe8]">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-6 items-center">
          <img
            className="rounded-2xl shadow-card"
            src={asset("image_lookbook_1.webp")}
            alt="Lookbook"
          />
          <div>
            <h3 className="text-3xl font-semibold">ENCHANTING DRESS 2024</h3>
            <p className="mt-3 text-gray-600">
              BST đầm dệt kim, tông pastel hiện đại, phù hợp đi làm & đi chơi.
            </p>
            <button className="mt-4 px-4 py-2 rounded-xl bg-brand-primary text-white">
              Xem thêm
            </button>
          </div>
        </div>
      </section>

      {/* 9. BỘ SƯU TẬP NỮ */}
      <WomenCollection />

      {/* 10. BLACK FRIDAY 4 TILE */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-4 items-stretch">
          <img
            className="rounded-2xl shadow-card object-cover w-full"
            src={asset("img_banner_1.webp")}
            alt="Tile 1"
          />
          <div className="grid gap-4">
            <img
              className="rounded-2xl shadow-card"
              src={asset("img_banner_2.webp")}
              alt="Tile 2"
            />
            <img
              className="rounded-2xl shadow-card"
              src={asset("img_banner_3.webp")}
              alt="Tile 3"
            />
          </div>
          <img
            className="rounded-2xl shadow-card object-cover w-full"
            src={asset("img_banner_4.webp")}
            alt="Tile 4"
          />
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
              className={`${
                accTab === t.id
                  ? "text-brand-primary border-b-2 border-brand-primary"
                  : "text-gray-500"
              } pb-1`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {(accTab === "nam" ? accessoriesMale : accessoriesFemale).map(
            (item, i) => (
              <ProductCard key={i} {...item} />
            )
          )}
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
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50">
            Xem tất cả
          </button>
        </div>
      </section>

      {/* 14. GALLERY */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <SectionHeading title="Cập nhật từ ND STYLE" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((g, i) => (
            <img
              key={i}
              className="rounded-2xl shadow-card border object-cover w-full h-48"
              src={g}
              alt={`Gallery ${i + 1}`}
            />
          ))}
        </div>
        <div className="text-center mt-6">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ffefe8] text-brand-dark border border-orange-200">
            Theo dõi ngay
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
