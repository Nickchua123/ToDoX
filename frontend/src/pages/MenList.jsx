import SectionHeading from "../components/SectionHeading.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { menCollection } from "../data/mock.js";

export default function MenList() {
  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <SectionHeading title="Bộ sưu tập nam" />
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {menCollection.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </section>
    </div>
  );
}

