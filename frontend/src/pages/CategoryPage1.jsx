// CategoryPageMen.jsx — giống y cấu trúc CategoryPage.jsx (Nữ)
import { useMemo, useRef, useState } from "react";
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

// Dùng data nội bộ (NAM)
import {
  menCollection,
  accessoriesMale,
  suggestionsToday,
  suggestionsBest,
  categories, // dùng lại mảng danh mục tròn
} from "@/data/mock.js";

// ---------- helpers ----------
const toNumber = (v) => {
  if (typeof v === "number") return v;
  if (!v) return Number.POSITIVE_INFINITY;
  return Number(String(v).replace(/[^\d]/g, "")) || Number.POSITIVE_INFINITY;
};

// bỏ dấu + thường hoá để so khớp chắc chắn
const normalize = (s = "") =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

// bộ từ khoá loại NỮ (chặn sớm)
const FEMALE_BLOCK = [
  "nu",
  "vay",
  "dam",
  "dam len",
  "vay lien",
  "vay ren",
  "ao nu",
  "ao nhi nu",
  "ao len nu",
  "chan vay",
  "croptop",
];

// bộ từ khoá NAM (ít nhất 1 từ phải trúng)
const MALE_REQUIRE = [
  "nam",
  "ao nam",
  "so mi",
  "jacket",
  "ao khoac",
  "quan",
  "quan jean",
  "quan au",
  "short",
  "that lung",
  "belt",
  "giay nam",
];

const looksFemale = (name = "", img = "") => {
  const n = normalize(name);
  const p = normalize(img || "");
  const hitText = FEMALE_BLOCK.some((k) => n.includes(k));
  const hitPath = /(women|nu|dress|skirt|dam|vay)/i.test(img || "");
  return hitText || hitPath;
};

const looksMale = (name = "", img = "") => {
  const n = normalize(name);
  const p = normalize(img || "");
  const hitText = MALE_REQUIRE.some((k) => n.includes(k));
  const hitPath = /(men|nam|jacket|shirt|jean|belt)/i.test(img || "");
  return hitText || hitPath;
};

export default function CategoryPageMen() {
  const [sort, setSort] = useState("default");

  // Gom các sản phẩm "nam" — LỌC KỸ
  const maleProducts = useMemo(() => {
    // 1) Nguồn chắc chắn là Nam
    const base = [...(menCollection || [])];
    const maleAcc = [...(accessoriesMale || [])];

    // 2) Extra từ gợi ý: bắt buộc looksMale() và không được looksFemale()
    const extraSrc = [...(suggestionsToday || []), ...(suggestionsBest || [])];
    const extra = extraSrc
      .filter(
        (x) => !looksFemale(x.name, x.img) && looksMale(x.name, x.img) // strict
      )
      .map((x, i) => ({
        id: x.id,
        name: x.name,
        price: x.price,
        old: x.old,
        tag: x.tag,
        img: x.img,
        _k: `extra-${i}`,
      }));

    // 3) Gộp + loại trùng (ưu tiên id, rồi số trong tên ảnh, rồi name)
    const merged = [...base, ...maleAcc, ...extra];
    const seen = new Set();
    const unique = [];
    for (const p of merged) {
      const key =
        (p.id && `id-${p.id}`) ||
        (typeof p.img === "string" &&
          p.img.match(/\/(\d+)\.(webp|png|jpg|jpeg|avif)/)?.[1]) ||
        p._k ||
        p.name;
      if (seen.has(key)) continue;
      // chốt chặn cuối cùng: nếu tên/ảnh vẫn dính nữ thì bỏ
      if (looksFemale(p.name, p.img)) continue;
      seen.add(key);
      unique.push(p);
    }
    return unique;
  }, []);

  // Sắp xếp
  const sortedProducts = useMemo(() => {
    const arr = [...maleProducts];
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
  }, [maleProducts, sort]);

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

  return (
    <>
      <Header />

      {/* TIÊU ĐỀ + SẮP XẾP */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Phụ kiện / Sản phẩm nam</h1>

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
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {(categories || []).map((c, i) => (
              <div
                key={i}
                ref={i === 0 ? firstItemRef : null}
                className="snap-start shrink-0"
                style={{ width: 180 }}
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
            {sortedProducts.map((p, idx) => (
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
                <li className="cursor-pointer hover:text-pink-500">Áo nam</li>
                <li className="cursor-pointer hover:text-pink-500">Quần nam</li>
                <li className="cursor-pointer hover:text-pink-500">
                  Phụ kiện nam
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
                {["Đen", "Nâu", "Xanh dương", "Xám", "Trắng", "Be"].map(
                  (color) => (
                    <Badge
                      key={color}
                      variant="outline"
                      className="cursor-pointer px-3 py-1 text-sm hover:bg-blue-50 hover:border-blue-400 transition-all"
                    >
                      {color}
                    </Badge>
                  )
                )}
              </div>
            </div>

            {/* Size */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border">
              <h2 className="text-lg font-semibold mb-3">Size</h2>
              <div className="flex flex-wrap gap-2">
                {["S", "M", "L", "XL", "2XL"].map((size) => (
                  <Badge
                    key={size}
                    variant="outline"
                    className="cursor-pointer px-3 py-1 text-sm hover:bg-blue-50 hover:border-blue-400 transition-all"
                  >
                    {size}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Kiểu dáng */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border">
              <h2 className="text-lg font-semibold mb-3">Kiểu dáng</h2>
              <div className="flex items-center space-x-2">
                <Checkbox id="belt" />
                <label htmlFor="belt" className="text-sm">
                  Thắt lưng
                </label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox id="jacket" />
                <label htmlFor="jacket" className="text-sm">
                  Áo khoác
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
