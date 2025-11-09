import { Star } from "lucide-react";
const asset = (p) => new URL(`../anhNNKB/${p}`, import.meta.url).href;

export default function Testimonial() {
  return (
    <div className="rounded-2xl bg-[#fff5f0] border border-orange-100 p-6 grid md:grid-cols-[1fr_2fr] gap-6">
      <div className="flex gap-4">
        <img
          src={asset("img_mini_review.webp")}
          alt="Hình ảnh đánh giá 1"
          className="rounded-xl object-cover w-36 h-48 md:w-48 md:h-60 shrink-0"
        />
        <img
          src={asset("img_mini_review_2.webp")}
          alt="Hình ảnh đánh giá 2"
          className="rounded-xl object-cover w-36 h-48 md:w-48 md:h-60 shrink-0"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-brand-dark mb-2">ĐÁNH GIÁ CỦA KHÁCH HÀNG</h3>
        <p className="text-sm text-gray-600">
          Chất liệu mềm mại thoáng khí, thiết kế hiện đại. Thích hợp đi làm và đi chơi,
          phù hợp xu hướng thời trang nhưng vẫn giữ nét riêng.
        </p>
        <div className="flex items-center gap-1 text-orange-500 mt-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-orange-500" />
          ))}
        </div>
        <div className="mt-4">
          <div className="text-sm font-semibold">Hương Mẫn</div>
          <div className="text-xs text-gray-500">Kinh doanh</div>
        </div>
      </div>
    </div>
  );
}

