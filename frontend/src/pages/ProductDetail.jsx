import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useEffect, useMemo, useState } from "react";
import { Truck, BadgePercent, RotateCcw, Headphones, ChevronLeft, ChevronRight } from "lucide-react";
import productDetails from "../data/productDetails.js";

function Qty({ value, onChange }) {
  return (
    <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-xl border">
      <button onClick={() => onChange(Math.max(1, value - 1))} className="px-2">-</button>
      <span className="min-w-6 text-center">{value}</span>
      <button onClick={() => onChange(value + 1)} className="px-2">+</button>
    </div>
  );
}

export default function ProductDetail({ id: propId }) {
  const [hashId, setHashId] = useState(() => (location.hash.split("/")[2] || ""));
  useEffect(() => {
    const fn = () => setHashId(location.hash.split("/")[2] || "");
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);

  const id = propId || hashId || "1";
  const data = productDetails[id];
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState("info");

  if (!data) {
    return (
      <>
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Không tìm thấy sản phẩm</h1>
            <a href="#/" className="text-brand-primary underline">Quay lại trang chủ</a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const { name, price, desc, images = [], hero, shipping = [], related = [], info, policy, reviews } = data;
  const gallery = useMemo(() => [hero, ...images].filter(Boolean), [hero, images]);
  const next = () => setActive((a) => (a + 1) % gallery.length);
  const prev = () => setActive((a) => (a - 1 + gallery.length) % gallery.length);

  // Related (ẩn sản phẩm hiện tại)
  const [relIndex, setRelIndex] = useState(0);
  const relWin = 3;
  const relAll = (related || []).filter((r) => String(r.id) !== String(id));
  const relLen = relAll.length || 1;
  const relNext = () => setRelIndex((i) => (i + 1) % relLen);
  const relPrev = () => setRelIndex((i) => (i - 1 + relLen) % relLen);
  const relatedWindow = relAll.length <= relWin
    ? relAll
    : [...relAll.slice(relIndex, relIndex + relWin), ...relAll.slice(0, Math.max(0, (relIndex + relWin) - relAll.length))];

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: thumbnails + main image with arrows */}
          <div className="grid grid-cols-[64px_1fr] gap-3">
            <div className="flex md:flex-col gap-3 overflow-auto no-scrollbar">
              {gallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setActive(i)}
                  className={`w-16 h-16 rounded-xl object-cover ring-1 ${active === i ? "ring-brand-primary" : "ring-gray-200"}`}
                />
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden relative bg-gray-100 ring-1 ring-gray-200">
              <img src={gallery[active]} className="w-full h-[420px] object-contain bg-gray-100" />
              <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 ring-1 ring-gray-200 hover:bg-white"><ChevronLeft className="w-4 h-4"/></button>
              <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 ring-1 ring-gray-200 hover:bg-white"><ChevronRight className="w-4 h-4"/></button>
            </div>
          </div>

          {/* Right: info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-brand-dark">{name}</h1>
            <div className="mt-2 text-[22px] font-bold text-brand-primary">{price}</div>
            <p className="mt-3 text-sm text-gray-700 leading-6">{desc}</p>

            <div className="mt-4 flex items-center gap-4">
              <Qty value={qty} onChange={setQty} />
              <button className="px-5 py-2 rounded-xl bg-black text-white">Thêm vào giỏ</button>
              <button className="px-5 py-2 rounded-xl bg-brand-primary text-white">Mua ngay</button>
            </div>

            {/* Shipping badges with icons */}
            <div className="mt-6 grid grid-cols-1 gap-2 text-sm">
              {shipping.map((s, i) => {
                const Icon = [Truck, BadgePercent, RotateCcw, Headphones][i] || Truck;
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#fff5f0] border border-orange-100">
                    <span className="p-2 rounded-full bg-white ring-1 ring-orange-200 text-brand-dark"><Icon className="w-4 h-4"/></span>
                    <div>
                      <div className="font-medium text-brand-dark">{s.title}</div>
                      <div className="text-gray-500">{s.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabs: info / policy / review */}
        <div className="mt-10">
          <div className="flex gap-6 justify-center border-b">
            {[
              { id: "info", label: "Thông tin sản phẩm" },
              { id: "policy", label: "Chính sách đổi trả" },
              { id: "review", label: "Đánh giá sản phẩm" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`py-2 ${tab === t.id ? "text-brand-primary border-b-2 border-brand-primary" : "text-gray-500"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="mt-6 text-sm text-gray-700 leading-6">
            {tab === "info" && (
              <div>
                {info && Array.isArray(info) ? (
                  <div className="space-y-2">
                    {info.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                ) : (
                  <>
                    <p>Thiết kế thanh lịch, phù hợp công sở và dạo phố. Chất liệu mềm mại, thoáng mát, thoải mái cả ngày dài.</p>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      <li>Dáng A tôn dáng, che khuyết điểm.</li>
                      <li>Cổ sơ mi cổ điển, thanh nhã.</li>
                      <li>Tay dài, xếp ly nhẹ nhàng.</li>
                    </ul>
                  </>
                )}
              </div>
            )}
            {tab === "policy" && (
              <div>
                {policy && Array.isArray(policy) ? (
                  <div className="space-y-3">
                    {policy.map((sec, i) => (
                      <div key={i}>
                        {sec.title ? <div className="font-medium mb-1">{sec.title}</div> : null}
                        {sec.lines ? (
                          <ul className="list-disc pl-6 space-y-1">
                            {sec.lines.map((l, j) => (<li key={j}>{l}</li>))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Đổi trả trong 7 ngày, còn tem & chưa qua sử dụng.</li>
                    <li>Hỗ trợ vận chuyển theo chính sách hiện hành.</li>
                    <li>Liên hệ CSKH 24/7 để được hướng dẫn.</li>
                  </ul>
                )}
              </div>
            )}
            {tab === "review" && (
              <div className="space-y-3">
                {Array.isArray(reviews) && reviews.length ? (
                  reviews.map((rv, i) => (
                    <div key={i}>
                      <div className="font-medium">{rv.name} • {rv.rating}/5</div>
                      <p className="text-gray-600">{rv.text}</p>
                    </div>
                  ))
                ) : (
                  <div>
                    <div className="font-medium">Đánh giá (4.8/5)</div>
                    <p className="text-gray-600 mt-1">Sản phẩm được nhiều khách hàng ưa thích vì form đẹp, chất liệu thoáng mát.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-brand-dark text-center mb-4">SẢN PHẨM LIÊN QUAN</h2>
          <div className="relative">
            {relAll.length > relWin ? (
              <>
                <button onClick={relPrev} aria-label="Trước" className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-white ring-1 ring-gray-200 shadow">‹</button>
                <button onClick={relNext} aria-label="Sau" className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-white ring-1 ring-gray-200 shadow">›</button>
              </>
            ) : null}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedWindow.map((r) => (
                <a key={r.id} href={`#/p/${r.id}`} className="block bg-white rounded-2xl border shadow-card overflow-hidden">
                  <img src={r.img} className="w-full h-56 object-cover" />
                  <div className="p-3">
                    <div className="text-sm text-gray-700 line-clamp-2">{r.name}</div>
                    <div className="mt-1 text-brand-primary font-semibold">{r.price}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

