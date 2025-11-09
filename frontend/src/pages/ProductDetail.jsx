import { useMemo, useState } from "react";
import { BadgePercent, ChevronLeft, ChevronRight, Headphones, Truck } from "lucide-react";
import productDetails from "../data/productDetails.js";

const QtyInput = ({ value, onChange }) => (
  <div className="inline-flex items-center gap-3 rounded-xl border px-3 py-2">
    <button onClick={() => onChange(Math.max(1, value - 1))} className="text-sm">-</button>
    <span className="min-w-6 text-center text-sm">{value}</span>
    <button onClick={() => onChange(value + 1)} className="text-sm">+</button>
  </div>
);

function ShippingIcon({ index }) {
  const icons = [Truck, BadgePercent, Headphones];
  const Icon = icons[index % icons.length];
  return <Icon className="w-4 h-4 text-brand-primary" />;
}

export default function ProductDetail({ id: passedId }) {
  const [qty, setQty] = useState(1);
  const id = passedId || "1";
  const product = productDetails[id];
  const gallery = useMemo(() => {
    if (!product) return [];
    return [product.hero, ...(product.images || [])].filter(Boolean);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold">Product not found</p>
          <p className="text-sm text-gray-500">Please return to the home page to continue shopping.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] p-6">
          <div>
            <div className="grid gap-3 lg:grid-cols-[80px_1fr]">
              <div className="flex flex-col gap-3">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    className="h-16 w-full overflow-hidden rounded-xl bg-gray-100"
                    style={{ border: idx === 0 ? "2px solid #ff7a45" : undefined }}
                    onClick={(evt) => {
                      const main = evt.currentTarget.parentElement.nextElementSibling.querySelector('img');
                      if (main) main.src = img;
                    }}
                  >
                    <img src={img} alt={product.name} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="rounded-2xl bg-gray-100 p-3 text-center">
                <img src={gallery[0]} alt={product.name} className="h-96 w-full object-contain" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500">{product.variant}</p>
              <h1 className="text-3xl font-semibold text-brand-dark">{product.name}</h1>
              <p className="text-2xl font-bold text-brand-primary">{product.price}</p>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{product.desc}</p>
            <div className="flex items-center gap-3">
              <QtyInput value={qty} onChange={setQty} />
              <button className="rounded-full bg-brand-primary px-5 py-2 text-white">Add to cart</button>
            </div>
            <div className="space-y-3 rounded-2xl border bg-[#fffaf6] p-4">
              <p className="text-sm font-semibold text-brand-dark">Shipping & perks</p>
              <div className="space-y-2 text-sm text-gray-600">
                {(product.shipping || []).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <ShippingIcon index={idx} />
                    <div>
                      <p className="font-medium text-brand-dark">{item.title}</p>
                      <p>{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
