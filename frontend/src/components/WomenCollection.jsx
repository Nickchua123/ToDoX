import { useRef } from "react";
import ProductCard from "./ProductCard.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { womenCollection } from "../data/mock.js";

// Tạo đường dẫn ảnh banner từ src/anhNNKB
const asset = (p) => new URL(`../anhNNKB/${p}`, import.meta.url).href;

export default function WomenCollection() {
  const scroller = useRef(null);
  const scrollBy = (x) => scroller.current?.scrollBy({ left: x, behavior: "smooth" });

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <SectionHeading title="Bộ sưu tập nữ" className="py-6" titleClassName="uppercase text-brand-primary font-extrabold" />

      <div className="grid md:grid-cols-4 gap-3 items-start">
        {/* Left: Carousel 1-5.webp (hiển thị khoảng 3 item) */}
        <div className="relative md:col-span-3">
          <button
            aria-label="Prev"
            onClick={() => scrollBy(-260)}
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-gray-200 hover:ring-gray-300 shadow"
          >
            ‹
          </button>

          <div
            ref={scroller}
            className="flex gap-3 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory no-scrollbar"
          >
            {womenCollection.map((p) => (
              <div key={p.id} className="min-w-[250px] snap-start">
                <ProductCard compact {...p} />
              </div>
            ))}
          </div>

          <button
            aria-label="Next"
            onClick={() => scrollBy(260)}
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-gray-200 hover:ring-gray-300 shadow"
          >
            ›
          </button>

          <div className="mt-6 flex justify-center">
            <button className="inline-flex items-center gap-2 rounded-xl bg-brand-primary text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90">
              Xem tất cả +
            </button>
          </div>
        </div>

        {/* Right: Poster */}
        <div className="rounded-2xl overflow-hidden shadow-card md:col-span-1">
          <img
            src={asset("img_product_banner_2.webp")}
            alt="ENCHANTING DRESS 2024"
            className="w-full h-[420px] object-cover"
          />
        </div>
      </div>
    </section>
  );
}

