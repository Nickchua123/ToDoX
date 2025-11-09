import { ChevronRight } from "lucide-react";
export default function CouponCard({ title, sub, badge, img }) {
  return (
    <div className="p-4 bg-white shadow-card rounded-2xl border border-orange-100 text-center">
      {img ? (
        <img src={img} alt={title} className="w-full rounded-xl mb-3 object-cover" />
      ) : null}
      <div className="text-sm text-orange-600 font-semibold">{badge}</div>
      <div className="text-xl font-bold mt-1">{title}</div>
      <div className="text-xs text-gray-500 mt-1">{sub}</div>
      <button className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-white text-sm hover:bg-brand-dark">
        Xem ngay <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

