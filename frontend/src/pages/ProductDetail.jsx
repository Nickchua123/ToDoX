<<<<<<< Updated upstream
import Header from "../components/Header.jsx";
=======
﻿import { useMemo, useState } from "react";
import {
  BadgePercent,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Truck,
} from "lucide-react";
import productDetails from "../data/productDetails.js";
import Header from "../components/Header.jsx";
import { useParams, Link, useNavigate } from "react-router-dom";
>>>>>>> Stashed changes
import Footer from "../components/Footer.jsx";
import { useEffect, useMemo, useState } from "react";
import { Truck, BadgePercent, RotateCcw, Headphones, ChevronLeft, ChevronRight } from "lucide-react";
import productDetails from "../data/productDetails.js";

<<<<<<< Updated upstream
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
=======
const QtyInput = ({ value, onChange }) => (
  <div className="inline-flex items-center gap-3 rounded-xl border px-3 py-2">
    <button
      onClick={() => onChange(Math.max(1, value - 1))}
      className="text-sm"
      type="button"
    >
      -
    </button>
    <span className="min-w-6 text-center text-sm">{value}</span>
    <button
      onClick={() => onChange(value + 1)}
      className="text-sm"
      type="button"
    >
      +
    </button>
  </div>
);

function ShippingIcon({ index }) {
  const icons = [Truck, BadgePercent, Headphones];
  const Icon = icons[index % icons.length];
  return <Icon className="w-4 h-4 text-brand-primary" />;
}

/* debug */ console.debug("ProductDetail mount");

export default function ProductDetail({ id: passedId }) {
  // Lấy id từ router
  const { id: routeId } = useParams();
  const id = String(passedId ?? routeId ?? "1");

  const [qty, setQty] = useState(1);
  const navigate = useNavigate();
  const product = productDetails[id];
  console.debug("PD id=", id, product);

  // Từ điển tên/ảnh để enrich "related"
  const nameDict = useMemo(
    () =>
      Object.fromEntries([
        ...(womenCollection || []).map((x) => [String(x.id), x]),
        ...(accessoriesMale || []).map((x) => [String(x.id), x]),
        ...(accessoriesFemale || []).map((x) => [String(x.id), x]),
        ...(menCollection || []).map((x) => [String(x.id), x]),
        ...(suggestionsToday || []).map((x) => [String(x.id), x]),
        ...(suggestionsBest || []).map((x) => [String(x.id), x]),
      ]),
    [
      womenCollection,
      accessoriesMale,
      accessoriesFemale,
      menCollection,
      suggestionsToday,
      suggestionsBest,
    ]
  );

  const enrichRelated = (r) => {
    const k = String(r.id);
    const src = nameDict[k] || {};
    const bad = typeof r.name === "string" && /^Sản phẩm\s+\d+$/i.test(r.name);
    return {
      id: k,
      name: bad || !r.name ? src.name || r.name : r.name,
      price: src.price || r.price,
      img:
        src.img ||
        r.img ||
        (k
          ? new URL("../anhNNKB/" + k + ".webp", import.meta.url).href
          : undefined),
    };
  };

  const gallery = useMemo(() => {
    if (!product) return [];
    const g = [product.hero, ...(product.images || [])].filter(Boolean);
    return g;
  }, [product]);

  if (!product) {
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
  const [tab, setTab] = useState("info");
  const tabLabels = {
    info: "Thông tin sản phẩm",
    policy: "Chính sách đổi trả",
    review: "Đánh giá sản phẩm",
  };

  const related = useMemo(() => {
    const arr = (product?.related || []).filter(
      (r) => String(r.id) !== String(id)
    );
    return arr.slice(0, 3).map(enrichRelated);
  }, [product, id]);
>>>>>>> Stashed changes

  // Ảnh chính fallback an toàn
  const mainImg = gallery[0] || product.hero;

  return (
    <>
      <Header />
<<<<<<< Updated upstream
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
=======
      <div className="py-10">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] p-6">
            <div>
              <div className="grid gap-3 lg:grid-cols-[80px_1fr]">
                <div className="flex flex-col gap-3">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      className="h-16 w-full overflow-hidden rounded-xl bg-gray-100"
                      style={{
                        border: idx === 0 ? "2px solid #ff7a45" : undefined,
                      }}
                      onClick={(evt) => {
                        const main =
                          evt.currentTarget.parentElement.nextElementSibling.querySelector(
                            "img"
                          );
                        if (main) main.src = img;
                      }}
                      type="button"
                    >
                      <img
                        src={img}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div className="rounded-2xl bg-gray-100 p-3 text-center relative">
                  <img
                    src={mainImg}
                    alt={product.name}
                    className="h-96 w-full object-contain"
                  />
                  <button
                    onClick={(e) => {
                      const el =
                        e.currentTarget.parentElement.querySelector("img");
                      const currentSrc = el?.getAttribute("src");
                      const idx = Math.max(
                        0,
                        gallery.findIndex((g) => g === currentSrc)
                      );
                      const next = (idx - 1 + gallery.length) % gallery.length;
                      if (el) el.src = gallery[next] || mainImg;
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 ring-1 ring-gray-200 hover:bg-white"
                    type="button"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      const el =
                        e.currentTarget.parentElement.querySelector("img");
                      const currentSrc = el?.getAttribute("src");
                      const idx = Math.max(
                        0,
                        gallery.findIndex((g) => g === currentSrc)
                      );
                      const next = (idx + 1) % gallery.length;
                      if (el) el.src = gallery[next] || mainImg;
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 ring-1 ring-gray-200 hover:bg-white"
                    type="button"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
                  {product.variant}
                </p>
                <h1 className="text-3xl font-semibold text-brand-dark">
                  {product.name}
                </h1>
                <p className="text-2xl font-bold text-brand-primary">
                  {product.price}
                </p>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {product.desc}
              </p>

              {/* Nút hành động */}
              <div className="flex items-center gap-3">
                <QtyInput value={qty} onChange={setQty} />

                {/* Thêm vào giỏ */}
                <button
                  className="rounded-full bg-brand-primary px-5 py-2 text-white hover:bg-[#e5553d] transition"
                  type="button"
                  onClick={() => {
                    // TODO: thêm sản phẩm vào giỏ tại đây
                    navigate("/cart");
                  }}
                >
                  Thêm vào giỏ
                </button>

                {/* Mua ngay */}
                <button
                  className="rounded-full border border-brand-primary px-5 py-2 text-brand-primary hover:bg-brand-primary hover:text-white transition"
                  type="button"
                  onClick={() => {
                    // TODO: điều hướng đến trang mua ngay / thanh toán
                    navigate("/checkout");
                  }}
                >
                  Mua ngay
                </button>
              </div>

              <div className="space-y-3 rounded-2xl border bg-[#fffaf6] p-4">
                <p className="text-sm font-semibold text-brand-dark">
                  Ưu đãi & vận chuyển
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  {(product.shipping || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <ShippingIcon index={idx} />
                      <div>
                        <p className="font-medium text-brand-dark">
                          {item.title}
                        </p>
                        <p>{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 pb-8">
            <div className="flex gap-6 justify-center border-b">
              {[{ id: "info" }, { id: "policy" }, { id: "review" }].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`py-2 ${
                    tab === t.id
                      ? "text-brand-primary border-b-2 border-brand-primary"
                      : "text-gray-500"
                  }`}
                  type="button"
                >
                  {tabLabels[t.id]}
                </button>
              ))}
            </div>

            <div className="mt-6 text-sm text-gray-700 leading-6 max-w-4xl mx-auto">
              {tab === "info" && (
                <div>
                  {Array.isArray(product.info) ? (
                    <ul className="list-disc pl-6 space-y-1">
                      {product.info.map((l, i) => (
                        <li key={i}>{l}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{product.desc}</p>
                  )}
                </div>
              )}

              {tab === "policy" && (
                <div>
                  {Array.isArray(product.policy) ? (
                    <div className="space-y-3">
                      {product.policy.map((sec, i) => (
                        <div key={i}>
                          {sec.title ? (
                            <div className="font-medium mb-1">{sec.title}</div>
                          ) : null}
                          {sec.lines ? (
                            <ul className="list-disc pl-6 space-y-1">
                              {sec.lines.map((l, j) => (
                                <li key={j}>{l}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Áp dụng theo chính sách hiện hành.</p>
                  )}
                </div>
              )}

              {tab === "review" && (
                <div className="space-y-3">
                  {Array.isArray(product.reviews) && product.reviews.length ? (
                    product.reviews.map((rv, i) => (
                      <div key={i}>
                        <div className="font-medium">
                          {rv.name} • {rv.rating}/5
                        </div>
                        <p className="text-gray-600">{rv.text}</p>
                      </div>
                    ))
                  ) : (
                    <p>Chưa có đánh giá.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Related */}
          {related.length ? (
            <div className="px-6 pb-8">
              <h2 className="text-xl font-semibold text-brand-dark text-center mb-4">
                Sản phẩm liên quan
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to={`/p/${r.id}`}
                    className="block bg-white rounded-2xl border shadow-card overflow-hidden"
                  >
                    <img
                      src={r.img}
                      className="w-full h-56 object-cover"
                      alt={r.name}
                    />
                    <div className="p-3">
                      <div className="text-sm text-gray-700 line-clamp-2">
                        {r.name}
                      </div>
                      <div className="mt-1 text-brand-primary font-semibold">
                        {r.price}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
>>>>>>> Stashed changes
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
