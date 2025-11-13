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

const PAGE_SIZE = 9;

export default function CategoryPage() {
  const [sort, setSort] = useState("default");
  const [searchParams] = useSearchParams();
  const activeSlug = searchParams.get("slug");
  const [categoryTitle, setCategoryTitle] = useState("Danh mục sản phẩm");
  const [products, setProducts] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [comingSoon, setComingSoon] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let ignore = false;
    const loadCategoryProducts = async () => {
      if (!activeSlug) {
        setCategoryTitle("Danh mục sản phẩm");
        setProducts([]);
        setComingSoon(true);
        return;
      }
      try {
        setLoadingCategory(true);
        setComingSoon(false);
        const { data: category } = await api.get(`/categories/${activeSlug}`);
        if (ignore) return;
        setCategoryTitle(category?.name || "Danh mục");
        const categoryId = category?._id;
        if (!categoryId) {
          setProducts([]);
          setComingSoon(true);
          return;
        }
        const { data: productRes } = await api.get(`/products?category=${categoryId}&limit=100`);
        if (ignore) return;
        const items = productRes?.items || productRes || [];
        if (!items.length) {
          setProducts([]);
          setComingSoon(true);
          return;
        }
        const mapped = items.map((p, idx) => ({
          id: p._id || idx,
          slug: p.slug,
          name: p.name,
          price: formatPrice(p.price),
          old: p.oldPrice ? formatPrice(p.oldPrice) : undefined,
          img: p.images?.[0] || p.image || "/logo.png",
          tag: calcTag(Number(p.price), Number(p.oldPrice)),
        }));
        setProducts(mapped);
      } catch (err) {
        if (!ignore) {
          console.error(err);
          toast.error(err?.response?.data?.message || "Không tải được sản phẩm cho danh mục này");
          setProducts([]);
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

  const sortedProducts = useMemo(() => {
    const arr = [...products];
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
  }, [products, sort]);

  useEffect(() => {
    setPage(1);
  }, [activeSlug, sort, products.length]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE)),
    [sortedProducts.length]
  );

  useEffect(() => {
    setPage((prev) => {
      if (prev > totalPages) return totalPages;
      if (prev < 1) return 1;
      return prev;
    });
  }, [totalPages]);

  const finalProducts = useMemo(() => {
    const current = Math.min(page, totalPages);
    const start = (current - 1) * PAGE_SIZE;
    return sortedProducts.slice(start, start + PAGE_SIZE);
  }, [page, sortedProducts, totalPages]);

  const scrollOne = (dir = 1) => {
    const rail = railRef.current;
    const first = firstItemRef.current;
    if (!rail || !first) return;
    const gap = 24;
    const delta = first.offsetWidth + gap;
    rail.scrollBy({ left: dir * delta, behavior: "smooth" });
  };

  const comingSoonText = activeSlug
    ? "Sản phẩm sẽ sớm được cập nhật."
    : "Chọn một danh mục để xem sản phẩm.";

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">{categoryTitle}</h1>

          <div className="flex items-center gap-2 relative z-0">
            <span className="text-gray-700 text-sm font-medium">Sắp xếp theo</span>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Mặc định" />
              </SelectTrigger>
              <SelectContent
                align="start"
                position="popper"
                sideOffset={4}
                className="z-[60] bg-white border shadow-lg rounded-lg min-w-[160px]"
              >
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

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-sm text-gray-500">Danh mục carousel đang tạm ẩn.</div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-6">
            {activeSlug && loadingCategory && (
              <div className="col-span-full text-center text-sm text-gray-500">Đang tải sản phẩm...</div>
            )}
            {comingSoon && !loadingCategory && (
              <div className="col-span-full text-center text-sm text-gray-500">{comingSoonText}</div>
            )}
            {!loadingCategory && !comingSoon && finalProducts.length === 0 && (
              <div className="col-span-full text-center text-sm text-gray-500">Không có sản phẩm nào.</div>
            )}
            {finalProducts.map((p) => (
              <ProductCard key={p.id || p.slug || p.img} {...p} />
            ))}
            {totalPages > 1 && !loadingCategory && !comingSoon && (
              <div className="col-span-full mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-40"
                >
                  Trang trước
                </button>
                <span>
                  Trang {page} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-40"
                >
                  Trang sau
                </button>
              </div>
            )}
          </div>

          <div className="hidden lg:block col-span-3 space-y-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border">
              <h2 className="text-lg font-semibold mb-3">Danh mục sản phẩm</h2>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="cursor-pointer hover:text-pink-500">Tất cả</li>
                <li className="cursor-pointer hover:text-pink-500">Túi nữ</li>
                <li className="cursor-pointer hover:text-pink-500">Váy/Áo/Quần</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border">
              <h2 className="text-lg font-semibold mb-3">Chọn mức giá</h2>
              {["Dưới 200.000₫", "200.000₫ - 500.000₫", "500.000₫ - 700.000₫", "700.000₫ - 1.000.000₫", "Trên 1.000.000₫"].map((p) => (
                <div key={p} className="flex items-center space-x-2 mb-1">
                  <Checkbox id={p} />
                  <label htmlFor={p} className="text-sm">
                    {p}
                  </label>
                </div>
              ))}
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border">
              <h2 className="text-lg font-semibold mb-3">Màu phổ biến</h2>
              <div className="flex flex-wrap gap-2">
                {["Kem", "Nâu", "Hồng", "Đen", "Cam", "Vàng", "Xanh dương", "Tím", "Xanh lá cây", "Xám"].map((color) => (
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

            <div className="bg-white p-4 rounded-2xl shadow-sm border">
              <h2 className="text-lg font-semibold mb-3">Size</h2>
              <div className="flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL", "2XL", "3XL", "Free Size"].map((size) => (
                  <Badge
                    key={size}
                    variant="outline"
                    className="cursor-pointer px-3 py-1 text-sm hover:bg-pink-50 hover:border-pink-400 transition-all"
                  >
                    {size}
                  </Badge>
                ))}
              </div>
            </div>

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
