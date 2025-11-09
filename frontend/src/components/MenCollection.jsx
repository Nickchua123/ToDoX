import { useRef } from "react";
import ProductCard from "./ProductCard.jsx";
import SectionHeading from "./SectionHeading.jsx";
import { menCollection } from "../data/mock.js";

const asset = (p) => new URL(`../anhNNKB/${p}`, import.meta.url).href;

export default function MenCollection() {
  const scroller = useRef(null);
  const scrollBy = (x) => scroller.current?.scrollBy({ left: x, behavior: "smooth" });
  // Thứ tự mong muốn: 16, 17, 18, 19, 10
  const byId = (id) => menCollection.find((m) => m.id === id);
  const slides = [byId("16"), byId("17"), byId("18"), byId("19"), byId("10")].filter(Boolean);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <SectionHeading
        title="Bộ sưu tập nam"
        className="py-6"
        titleClassName="uppercase text-brand-primary font-extrabold"
      />

      <div className="grid md:grid-cols-4 gap-3 items-start">
        <div className="relative md:col-span-3">
          <button
            onClick={() => scrollBy(-260)}
            aria-label="Trước"
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-gray-200 hover:ring-gray-300 shadow"
          >
            <span className="text-xl">‹</span>
          </button>
          <div ref={scroller} className="flex gap-3 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory no-scrollbar">
            {slides.map((p, idx) => (
              <div key={p.id ?? `img-${idx}`} className="min-w-[250px] snap-start">
                <ProductCard compact {...p} />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <a
              href="#/men"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-primary text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90"
            >
              Xem tất cả
            </a>
          </div>
          <button
            onClick={() => scrollBy(260)}
            aria-label="Sau"
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-gray-200 hover:ring-gray-300 shadow"
          >
            <span className="text-xl">›</span>
          </button>
        </div>

        {/* Poster bên phải */}
        <div className="rounded-2xl overflow-hidden shadow-card md:col-span-1">
          <img src={asset("img_product_banner_1.webp")} alt="AUTUMN BASIC" className="w-full h-[420px] object-cover" />
        </div>
      </div>
    </section>
  );
}

