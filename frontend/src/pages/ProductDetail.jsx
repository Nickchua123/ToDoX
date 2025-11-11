import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import {
  Truck,
  BadgePercent,
  RotateCcw,
  Headphones,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import productDetails from "../data/productDetails.js";

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

export default function ProductDetail({ id: passedId }) {
  const { id: routeId } = useParams();
  const id = String(passedId ?? routeId ?? "1");

  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);

  const product = productDetails[id];

  const gallery = useMemo(() => {
    const imgs = [product?.hero, ...(product?.images || [])].filter(Boolean);
    return imgs.length ? imgs : [];
  }, [product]);

  if (!product) {
    return (
      <>
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Không tìm thấy sản phẩm</h1>
            <Link to="/" className="text-brand-primary underline">
              Quay lại trang chủ
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const next = () => setActive((a) => (a + 1) % gallery.length);
  const prev = () => setActive((a) => (a - 1 + gallery.length) % gallery.length);

  const [tab, setTab] = useState("info");
  const tabLabels = {
    info: "Thông tin sản phẩm",
    policy: "Chính sách đổi trả",
    review: "Đánh giá sản phẩm",
  };

  const related = useMemo(() => {
    const arr = (product.related || []).filter((r) => String(r.id) !== String(id));
    return arr.slice(0, 3);
  }, [product, id]);

  return (
    <>
      <Header />
      <div className="py-10">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] p-6">
            <div>
              <div className="grid gap-3 lg:grid-cols-[80px_1fr]">
                <div className="flex md:flex-col gap-3 overflow-auto no-scrollbar">
                  {gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      type="button"
                      className={`h-16 w-full overflow-hidden rounded-xl bg-gray-100 ring-1 ${
                        active === i ? "ring-brand-primary" : "ring-gray-200"
                      }`}
                    >
                      <img src={img} alt={product.name} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>

                <div className="rounded-2xl overflow-hidden relative bg-gray-100 ring-1 ring-gray-200">
                  <img
                    src={gallery[active]}
                    alt={product.name}
                    className="w-full h-[420px] object-contain bg-gray-100"
                  />
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 ring-1 ring-gray-200 hover:bg-white"
                    type="button"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={next}
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
                {product.variant ? (
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-500">{product.variant}</p>
                ) : null}
                <h1 className="text-3xl font-semibold text-brand-dark">{product.name}</h1>
                <p className="text-2xl font-bold text-brand-primary">{product.price}</p>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">{product.desc}</p>

              <div className="flex items-center gap-3">
                <QtyInput value={qty} onChange={setQty} />
                <button
                  className="rounded-full bg-brand-primary px-5 py-2 text-white hover:bg-[#e5553d] transition"
                  type="button"
                  onClick={() => navigate("/cart")}
                >
                  Thêm vào giỏ
                </button>
                <button
                  className="rounded-full border border-brand-primary px-5 py-2 text-brand-primary hover:bg-brand-primary hover:text-white transition"
                  type="button"
                  onClick={() => navigate("/checkout")}
                >
                  Mua ngay
                </button>
              </div>

              <div className="space-y-3 rounded-2xl border bg-[#fffaf6] p-4">
                <p className="text-sm font-semibold text-brand-dark">Ưu đãi & vận chuyển</p>
                <div className="space-y-2 text-sm text-gray-600">
                  {(product.shipping || []).map((s, i) => {
                    const Icon = [Truck, BadgePercent, RotateCcw, Headphones][i] || Truck;
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-brand-primary" />
                        <div>
                          <p className="font-medium text-brand-dark">{s.title}</p>
                          <p>{s.sub}</p>
                        </div>
                      </div>
                    );
                  })}
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
                    tab === t.id ? "text-brand-primary border-b-2 border-brand-primary" : "text-gray-500"
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
                          {sec.title ? <div className="font-medium mb-1">{sec.title}</div> : null}
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
              <h2 className="text-xl font-semibold text-brand-dark text-center mb-4">Sản phẩm liên quan</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to={`/p/${r.id}`}
                    className="block bg-white rounded-2xl border shadow-card overflow-hidden"
                  >
                    <img src={r.img} className="w-full h-56 object-cover" alt={r.name} />
                    <div className="p-3">
                      <div className="text-sm text-gray-700 line-clamp-2">{r.name}</div>
                      <div className="mt-1 text-brand-primary font-semibold">{r.price}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </>
  );
}

