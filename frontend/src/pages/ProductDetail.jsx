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
import { addCartItem } from "@/services/cartService";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

/* ============================ */
/* QtyInput                     */
/* ============================ */
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

/* ============================ */
/* Reviews UI (inline)          */
/* ============================ */
function Star({ filled, className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`${className} ${filled ? "fill-yellow-400" : "fill-gray-300"}`}
    >
      <path d="M10 1.5 12.59 7l6 .44-4.57 3.9 1.4 5.84L10 14.9l-5.42 2.28 1.4-5.84L1.4 7.44 7.41 7 10 1.5z" />
    </svg>
  );
}

function ReviewsSection({ productId, initialReviews = [] }) {
  const storageKey = `reviews:${productId ?? "unknown"}`;
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: "", rating: 5, text: "" });
  const [submitting, setSubmitting] = useState(false);

  // Load từ localStorage (seed = initialReviews nếu chưa có)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (Array.isArray(saved)) {
        setReviews(saved);
      } else {
        setReviews(initialReviews);
        localStorage.setItem(storageKey, JSON.stringify(initialReviews));
      }
    } catch {
      setReviews(initialReviews);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const { avg, dist } = useMemo(() => {
    if (!reviews.length) return { avg: 0, dist: [0, 0, 0, 0, 0] };
    const counts = [0, 0, 0, 0, 0];
    let sum = 0;
    for (const r of reviews) {
      const val = Math.max(1, Math.min(5, Number(r.rating)));
      counts[val - 1] += 1;
      sum += val;
    }
    return { avg: sum / reviews.length, dist: counts };
  }, [reviews]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "rating" ? Number(value) : value,
    }));
  }

  function handleStarClick(value) {
    setForm((f) => ({ ...f, rating: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) {
      toast.error?.("Vui lòng nhập Tên và Nội dung đánh giá");
      return;
    }
    setSubmitting(true);
    // (Bạn có thể thay bằng call API thật ở đây)
    const newRv = {
      name: form.name.trim(),
      rating: form.rating,
      text: form.text.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = [newRv, ...reviews];
    setReviews(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    setForm({ name: "", rating: 5, text: "" });
    setSubmitting(false);
    toast.success?.("Đã gửi đánh giá, cảm ơn bạn!");
  }

  return (
    <section className="space-y-6">
      {/* Tổng quan sao */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold">{avg.toFixed(1)}</div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} filled={i < Math.round(avg)} />
            ))}
          </div>
          <div className="text-sm text-gray-600">
            ({reviews.length} đánh giá)
          </div>
        </div>

        {/* Phân phối sao */}
        <div className="w-full sm:w-1/2 space-y-1.5">
          {[5, 4, 3, 2, 1].map((s) => {
            const count = dist[s - 1];
            const pct = reviews.length
              ? Math.round((count / reviews.length) * 100)
              : 0;
            return (
              <div key={s} className="flex items-center gap-2">
                <span className="w-10 text-sm">{s}★</span>
                <div className="h-2 flex-1 bg-gray-200 rounded">
                  <div
                    className="h-2 rounded bg-yellow-400"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm text-gray-600">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danh sách đánh giá */}
      <div className="space-y-3">
        {reviews.length ? (
          reviews.map((rv, i) => (
            <div key={i} className="p-4 rounded-xl border bg-white">
              <div className="flex items-center justify-between">
                <div className="font-medium">{rv.name}</div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-4 h-4"
                      filled={idx < rv.rating}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mt-1">{rv.text}</p>
              {rv.createdAt && (
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(rv.createdAt).toLocaleString()}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá.</p>
        )}
      </div>

      {/* Form nhập đánh giá */}
      <form
        onSubmit={handleSubmit}
        className="p-4 rounded-xl border bg-white space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium mb-1">
              Tên của bạn
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="VD: Nguyễn A"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Đánh giá</label>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => {
                  const val = i + 1;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleStarClick(val)}
                      className="p-1"
                      aria-label={`Chọn ${val} sao`}
                    >
                      <Star filled={val <= form.rating} />
                    </button>
                  );
                })}
              </div>
              <select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                className="rounded-lg border px-2 py-1 outline-none focus:ring-2 focus:ring-black/10"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} sao
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Nội dung đánh giá
          </label>
          <textarea
            name="text"
            value={form.text}
            onChange={handleChange}
            rows={4}
            placeholder="Chia sẻ trải nghiệm của bạn…"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setForm({ name: "", rating: 5, text: "" })}
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            Xoá
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-black text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Đang gửi…" : "Gửi đánh giá"}
          </button>
        </div>
      </form>
    </section>
  );
}

/* ============================ */
/* ProductDetail                */
/* ============================ */
export default function ProductDetail({ id: passedId }) {
  const { id: routeId } = useParams();
  const id = String(passedId ?? routeId ?? "1");
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [adding, setAdding] = useState(false);

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

  const next = () =>
    gallery.length && setActive((a) => (a + 1) % gallery.length);
  const prev = () =>
    gallery.length &&
    setActive((a) => (a - 1 + gallery.length) % gallery.length);

  const [tab, setTab] = useState("info");
  const tabLabels = {
    info: "Thông tin sản phẩm",
    policy: "Chính sách đổi trả",
    review: "Đánh giá sản phẩm",
  };

  const related = useMemo(() => {
    const arr = (product.related || []).filter(
      (r) => String(r.id) !== String(id)
    );
    return arr.slice(0, 3);
  }, [product, id]);

  const handleAddToCart = async (redirect) => {
    if (!product?.id) {
      toast.error("Không xác định được sản phẩm để thêm vào giỏ.");
      return;
    }
    try {
      setAdding(true);
      await addCartItem({
        productId: product.id,
        quantity: qty,
      });
      await refreshCart();
      toast.success("Đã thêm vào giỏ hàng");
      if (redirect) {
        navigate("/checkout");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Không thể thêm sản phẩm vào giỏ.";
      toast.error(message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <Header />
      <div className="py-10">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] p-6">
            <div>
              <div className="grid gap-3 lg:grid-cols-[80px_1fr]">
                {/* Thumbnails */}
                <div className="flex md:flex-col gap-3 overflow-auto no-scrollbar">
                  {gallery.length ? (
                    gallery.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        type="button"
                        className={`h-16 w-full overflow-hidden rounded-xl bg-gray-100 ring-1 ${
                          active === i ? "ring-brand-primary" : "ring-gray-200"
                        }`}
                      >
                        <img
                          src={img}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))
                  ) : (
                    <div className="h-16 w-full rounded-xl bg-gray-100 ring-1 ring-gray-200" />
                  )}
                </div>

                {/* Main image */}
                <div className="rounded-2xl overflow-hidden relative bg-gray-100 ring-1 ring-gray-200">
                  {gallery.length ? (
                    <>
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
                    </>
                  ) : (
                    <div className="w-full h-[420px] bg-gray-100 flex items-center justify-center text-gray-400">
                      Không có hình ảnh
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right pane: info + actions */}
            <div className="space-y-4">
              <div>
                {product.variant ? (
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
                    {product.variant}
                  </p>
                ) : null}
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

              <div className="flex items-center gap-3">
                <QtyInput value={qty} onChange={setQty} />
                <button
                  className="rounded-full bg-brand-primary px-5 py-2 text-white hover:bg-[#e5553d] transition"
                  type="button"
                  onClick={() => handleAddToCart(false)}
                  disabled={adding}
                >
                  Thêm vào giỏ
                </button>
                <button
                  className="rounded-full border border-brand-primary px-5 py-2 text-brand-primary hover:bg-brand-primary hover:text-white transition"
                  type="button"
                  onClick={() => handleAddToCart(true)}
                  disabled={adding}
                >
                  {adding ? "Đang xử lý..." : "Mua ngay"}
                </button>
              </div>

              <div className="space-y-3 rounded-2xl border bg-[#fffaf6] p-4">
                <p className="text-sm font-semibold text-brand-dark">
                  Ưu đãi & vận chuyển
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  {(product.shipping || []).map((s, i) => {
                    const Icon =
                      [Truck, BadgePercent, RotateCcw, Headphones][i] || Truck;
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-brand-primary" />
                        <div>
                          <p className="font-medium text-brand-dark">
                            {s.title}
                          </p>
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
                <ReviewsSection
                  productId={product.id}
                  initialReviews={
                    Array.isArray(product.reviews) ? product.reviews : []
                  }
                />
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
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </>
  );
}
