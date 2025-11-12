// CategoryPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryRound from "@/components/CategoryRound";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/axios";
import { toast } from "sonner";

// Dùng data nội bộ
import {
  womenCollection,
  accessoriesFemale,
  suggestionsToday,
  suggestionsBest,
  categories, // mảng danh mục tròn
} from "@/data/mock.js";

// ---------- helpers ----------
const toNumber = (v) => {
  if (typeof v === "number") return v;
  if (!v) return Number.POSITIVE_INFINITY;
  return Number(String(v).replace(/[^\d]/g, "")) || Number.POSITIVE_INFINITY;
};

const formatPrice = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "Liên hệ";
  return `${num.toLocaleString("vi-VN")}₫`;
};

const calcTag = (price, oldPrice) => {
  if (!Number.isFinite(price) || !Number.isFinite(oldPrice) || oldPrice <= price) return undefined;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

export default function CategoryPage() {
  const [sort, setSort] = useState("default");
  const [searchParams] = useSearchParams();
  const activeSlug = searchParams.get("slug");
  const [categoryTitle, setCategoryTitle] = useState("Phụ kiện / Sản phẩm nữ");
  const [dynamicProducts, setDynamicProducts] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);

  // Gom các sản phẩm "nữ"
  const femaleProducts = useMemo(() => {
    const base = [...(womenCollection || [])]; // 1..5
    const femaleAcc = [...(accessoriesFemale || [])]; // 14..15

    // Bổ sung thêm từ gợi ý nếu tên mang sắc thái "nữ"
    const isFemaleName = (name = "") =>
      /Nữ|Váy|Váy liền|Váy ren|Áo Nỉ Nữ|Áo dạ len|Áo gilet/i.test(name);

    const extra = [...(suggestionsToday || []), ...(suggestionsBest || [])]
      .filter((x) => isFemaleName(x.name))
      .map((x, i) => ({
        id: x.id,
        name: x.name,
        price: x.price,
        old: x.old,
        tag: x.tag,
        img: x.img,
        _k: `extra-${i}`,
      }));

    // Gộp + loại trùng (ưu tiên theo id, rồi số trong tên ảnh, rồi name)
    const merged = [...base, ...femaleAcc, ...extra];
    const seen = new Set();
    const unique = [];
    for (const p of merged) {
      const key =
        (p.id && `id-${p.id}`) ||
        (typeof p.img === "string" &&
          p.img.match(/\/(\d+)\.(webp|png|jpg)/)?.[1]) ||
        p._k ||
        p.name;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(p);
    }
    return unique;
  }, []);

  // Sắp xếp
  const sortedProducts = useMemo(() => {
    const arr = [...femaleProducts];
    switch (sort) {
      case "az":
        return arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      case "za":
        return arr.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
      case "priceAsc":
        return arr.sort((a, b) => toNumber(a.price) - toNumber(b.price));
      case "priceDesc":
        return arr.sort((a, b) => toNumber(b.price) - toNumber(a.price));
      default:
        return arr;
    }
  }, [femaleProducts, sort]);

  // ---------- Carousel danh mục ----------
  const railRef = useRef(null);
  const firstItemRef = useRef(null);

  const scrollOne = (dir = 1) => {
    const rail = railRef.current;
    const first = firstItemRef.current;
    if (!rail || !first) return;
    const gap = 24; // ~ gap-6 tailwind
    const delta = first.offsetWidth + gap; // cuộn đúng 1 item
    rail.scrollBy({ left: dir * delta, behavior: "smooth" });
  };

  useEffect(() => {
    let ignore = false;
    const loadCategoryProducts = async () => {
      if (!activeSlug) {
        setCategoryTitle("Phụ kiện / Sản phẩm nữ");
        setDynamicProducts([]);
        setComingSoon(false);
        return;
      }
      try {
        setLoadingCategory(true);
        setComingSoon(false);
        const { data: category } = await api.get(`/categories/${activeSlug}`);
        if (ignore) return;
        const categoryId = category?._id;
        setCategoryTitle(category?.name || "Danh mục");
        if (!categoryId) {
          setDynamicProducts([]);
          setComingSoon(true);
          return;
        }
        const { data: productRes } = await api.get(`/products?category=${categoryId}&limit=100`);
        if (ignore) return;
        const items = productRes?.items || productRes || [];
        if (!items.length) {
          setDynamicProducts([]);
          setComingSoon(true);
          return;
        }
        const mapped = items.map((p, idx) => ({
          id: p._id || idx,
          slug: p.slug,
          name: p.name,
          price: formatPrice(p.price),
          old: p.oldPrice ? formatPrice(p.oldPrice) : undefined,
          img: p.images?.[0] || p.image || "/placeholder.png",
          tag: calcTag(Number(p.price), Number(p.oldPrice)),
        }));
        setDynamicProducts(mapped);
      } catch (err) {
        if (!ignore) {
          console.error(err);
          toast.error("Không tải được sản phẩm cho danh mục này");
          setDynamicProducts([]);
          setComingSoon(true);
        }
      } finally {
        if (!ignore) setLoadingCategory(false);
      }
    };
    loadCategoryProducts();
    return () => {
      ignore = true;
    };
  }, [activeSlug]);

  const finalProducts = useMemo(
    () => (activeSlug ? dynamicProducts : sortedProducts),
    [activeSlug, dynamicProducts, sortedProducts]
  );

  return (
    <>
      <Header />

      {/* TIÊU ĐỀ + SẮP XẾP */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">{categoryTitle}</h1>

          <div className="flex items-center gap-2 relative z-50">
            <span className="text-gray-700 text-sm font-medium">
              Sắp xếp theo
            </span>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Mặc định" />
              </SelectTrigger>
              <SelectContent className="z-[1000] bg-white border shadow-lg rounded-lg">
                <SelectItem value="default">Mặc định</SelectItem>
                <SelectItem value="az">A → Z</SelectItem>
                <SelectItem value="za">Z → A</SelectItem>
                <SelectItem value="priceAsc">Giá tăng dần</SelectItem>
                <SelectItem value="priceDesc">Giá giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* DANH MỤC TRÒN - Hiển thị to (~5 item), cuộn từng cái bằng nút */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 relative">
          {/* Nút trái */}
          <button
            aria-label="Prev"
            onClick={() => scrollOne(-1)}
            className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full border bg-white shadow hover:bg-gray-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Thanh kéo ngang */}
          <div
            ref={railRef}
            // Nếu muốn ẩn thanh scrollbar mà không thêm CSS global,
            // có thể dùng arbitrary styles của tailwind:
            // className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden ..."
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {(categories || []).map((c, i) => (
              <div
                key={i}
                ref={i === 0 ? firstItemRef : null}
                className="snap-start shrink-0"
                style={{ width: 180 }} // to hơn, khoảng 5 item/khung lớn
              >
                <CategoryRound {...c} />
              </div>
            ))}
          </div>

          {/* Nút phải */}
          <button
            aria-label="Next"
            onClick={() => scrollOne(1)}
            className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full border bg-white shadow hover:bg-gray-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* GRID + BỘ LỌC */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Sản phẩm */}
          <div className="col-span-12 lg:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-6">
            {activeSlug && loadingCategory && (
              <div className="col-span-full text-center text-sm text-gray-500">Đang tải sản phẩm...</div>
            )}
            {comingSoon && !loadingCategory && (
              <div className="col-span-full text-center text-sm text-gray-500">
                Sản phẩm sẽ sớm được cập nhật.
              </div>
            )}
            {finalProducts.map((p, idx) => (
              <ProductCard key={p.id || p.img || idx} {...p} />
            ))}
          </div>

          {/* Bộ lọc bên phải (trang trí) */}
          <div className="hidden lg:block col-span-3 space-y-6">
            {/* Danh mục */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border">
              <h2 className="text-lg font-semibold mb-3">Danh mục sản phẩm</h2>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="cursor-pointer hover:text-pink-500">Tất cả</li>
                <li className="cursor-pointer hover:text-pink-500">Túi nữ</li>
                <li className="cursor-pointer hover:text-pink-500">
                  Váy/Áo/Quần
                </li>
              </ul>
            </div>

            {/* Mức giá */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border">
              <h2 className="text-lg font-semibold mb-3">Chọn mức giá</h2>
              {[
                "Dưới 200.000₫",
                "200.000₫ - 500.000₫",
                "500.000₫ - 700.000₫",
                "700.000₫ - 1.000.000₫",
                "Trên 1.000.000₫",
              ].map((p, i) => (
                <div key={i} className="flex items-center space-x-2 mb-1">
                  <Checkbox id={p} />
                  <label htmlFor={p} className="text-sm">
                    {p}
                  </label>
                </div>
              ))}
            </div>

            {/* Màu sắc */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border">
              <h2 className="text-lg font-semibold mb-3">Màu phổ biến</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "Kem",
                  "Nâu",
                  "Hồng",
                  "Đen",
                  "Cam",
                  "Vàng",
                  "Xanh dương",
                  "Tím",
                  "Xanh lá cây",
                  "Xám",
                ].map((color) => (
                  <Badge
                    key={color}
                    variant="outline"
                    className="cursor-pointer px-3 py-1 text-sm hover:bg-pink-50 hover:border-pink-400 transition-all"
                  >
                    {color}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border">
              <h2 className="text-lg font-semibold mb-3">Size</h2>
              <div className="flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL", "2XL", "3XL", "Free Size"].map(
                  (size) => (
                    <Badge
                      key={size}
                      variant="outline"
                      className="cursor-pointer px-3 py-1 text-sm hover:bg-pink-50 hover:border-pink-400 transition-all"
                    >
                      {size}
                    </Badge>
                  )
                )}
              </div>
            </div>

            {/* Kiểu dáng */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border">
              <h2 className="text-lg font-semibold mb-3">Kiểu dáng</h2>
              <div className="flex items-center space-x-2">
                <Checkbox id="bag" />
                <label htmlFor="bag" className="text-sm">
                  Túi xách
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
