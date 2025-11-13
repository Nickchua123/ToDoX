import { useCallback, useEffect, useMemo, useState } from "react";
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
import { addCartItem } from "@/services/cartService";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import api from "@/lib/axios";
import { fetchProductReviews } from "@/services/reviewService";

const QtyInput = ({ value, onChange, max }) => {
  const canDecrease = value > 1;
  const canIncrease = typeof max === "number" ? value < max : true;
  const handleDecrease = () => {
    if (!canDecrease) return;
    onChange(Math.max(1, value - 1));
  };
  const handleIncrease = () => {
    if (!canIncrease) return;
    const limit = typeof max === "number" ? max : value + 1;
    onChange(Math.min(limit, value + 1));
  };
  return (
    <div className="inline-flex items-center gap-3 rounded-xl border px-3 py-2">
      <button
        onClick={handleDecrease}
        className="text-sm disabled:opacity-40"
        type="button"
        disabled={!canDecrease}
      >
        -
      </button>
      <span className="min-w-6 text-center text-sm">{value}</span>
      <button
        onClick={handleIncrease}
        className="text-sm disabled:opacity-40"
        type="button"
        disabled={!canIncrease}
      >
        +
      </button>
    </div>
  );
};

const OptionSelector = ({ label, options = [], selected, onSelect }) => {
  if (!options.length) return null;
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-slate-700">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`px-3 py-1.5 rounded-full border text-sm transition ${
                active
                  ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                  : "border-slate-200 hover:border-brand-primary hover:text-brand-primary"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default function ProductDetail() {
  const { id: routeId } = useParams();
  const id = String(routeId ?? "1");
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [adding, setAdding] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("info");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const colors = Array.isArray(product?.colors) ? product.colors.filter(Boolean) : [];
  const sizes = Array.isArray(product?.sizes) ? product.sizes.filter(Boolean) : [];
  const stock = typeof product?.stock === "number" ? product.stock : null;
  const maxQty = typeof stock === "number" && stock > 0 ? stock : null;
  const isOutOfStock = typeof stock === "number" && stock <= 0;

  useEffect(() => {
    if (typeof maxQty === "number" && maxQty > 0 && qty > maxQty) {
      setQty(maxQty);
    }
    if (typeof maxQty === "number" && maxQty <= 0) {
      setQty(1);
    }
  }, [maxQty]);
  useEffect(() => {
    if (colors.length) {
      setSelectedColor((prev) => (colors.includes(prev) ? prev : colors[0]));
    } else {
      setSelectedColor("");
    }
  }, [colors.join("|")]);

  useEffect(() => {
    if (sizes.length) {
      setSelectedSize((prev) => (sizes.includes(prev) ? prev : sizes[0]));
    } else {
      setSelectedSize("");
    }
  }, [sizes.join("|")]);

  const [reviewProductId, setReviewProductId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewMeta, setReviewMeta] = useState({ total: 0, page: 1 });
  const [reviewSummary, setReviewSummary] = useState({ average: 0, total: 0 });
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setReviewProductId(data?._id || null);
        setError("");
      } catch (err) {
        console.error(err);
        setProduct(null);
        setError("Không tìm thấy sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const gallery = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length) return product.images;
    return [];
  }, [product]);

  const summaryTotal = reviewSummary?.total ?? 0;
  const summaryAverage = reviewSummary?.average ?? 0;

  const totalReviews = useMemo(() => {
    if (summaryTotal) return summaryTotal;
    if (reviewMeta.total) return reviewMeta.total;
    return reviews.length;
  }, [reviewMeta.total, summaryTotal, reviews.length]);

  const averageRating = useMemo(() => {
    if (summaryAverage) return summaryAverage;
    if (!reviews.length) return 0;
    const sum = reviews.reduce((total, r) => total + Number(r.rating || 0), 0);
    return sum / reviews.length;
  }, [summaryAverage, reviews]);

  const hasMoreReviews = reviews.length < totalReviews;

  const loadReviews = useCallback(
    async (page = 1, append = false) => {
      if (!reviewProductId) return;
      try {
        setReviewLoading(true);
        const data = await fetchProductReviews(reviewProductId, page, 5, {
          includeStats: !append && page === 1,
        });
        setReviews((prev) => (append ? [...prev, ...data.items] : data.items));
        setReviewMeta({ total: data.total || data.items.length, page: data.page || page });
        if (data.summary) {
          setReviewSummary({
            average: Number(data.summary.average || 0),
            total: data.summary.total || data.total || data.items.length || 0,
          });
        } else if (!append && page === 1) {
          const fallbackAverage = data.items?.length
            ? data.items.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
              data.items.length
            : 0;
          setReviewSummary({
            average: fallbackAverage,
            total: data.total || data.items.length || 0,
          });
        }
      } catch (err) {
        console.error("Không thể tải đánh giá", err);
        toast.error("Không tải được đánh giá sản phẩm");
      } finally {
        setReviewLoading(false);
      }
    },
    [reviewProductId]
  );

  useEffect(() => {
    setReviews([]);
    setReviewMeta({ total: 0, page: 1 });
    setReviewSummary({ average: 0, total: 0 });
    loadReviews(1, false);
  }, [reviewProductId, loadReviews]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-500">
          Đang tải thông tin sản phẩm...
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">{error || "Không tìm thấy sản phẩm"}</h1>
            <Link to="/" className="text-brand-primary underline">
              Quay lại trang chủ
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const next = () => setActive((a) => (gallery.length ? (a + 1) % gallery.length : 0));
  const prev = () => setActive((a) => (gallery.length ? (a - 1 + gallery.length) % gallery.length : 0));

  const handleAddToCart = async (redirect) => {
    if (colors.length && !selectedColor) {
      toast.error("Vui lòng chọn màu sắc");
      return;
    }
    if (sizes.length && !selectedSize) {
      toast.error("Vui lòng chọn kích cỡ");
      return;
    }
    if (isOutOfStock) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }
    try {
      setAdding(true);
      await addCartItem({
        productId: product._id,
        quantity: qty,
        options: {
          ...(selectedColor ? { color: selectedColor } : {}),
          ...(selectedSize ? { size: selectedSize } : {}),
        },
      });
      await refreshCart();
      toast.success("Đã thêm vào giỏ hàng");
      if (redirect) navigate("/checkout");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không thể thêm sản phẩm vào giỏ.");
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
                <div className="flex md:flex-col gap-3 overflow-auto no-scrollbar">
                  {gallery.map((img, i) => (
                    <button
                      key={img}
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
                  {gallery.length ? (
                    <img src={gallery[active]} alt={product.name} className="w-full h-[420px] object-contain bg-gray-100" />
                  ) : (
                    <div className="w-full h-[420px] grid place-items-center text-gray-400">Không có ảnh</div>
                  )}
                  {gallery.length > 1 && (
                    <>
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
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-semibold text-brand-dark">{product.name}</h1>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-bold text-brand-primary">
                    {product.price?.toLocaleString("vi-VN")}₫
                  </p>
                  {product.oldPrice ? (
                    <span className="text-gray-400 line-through">
                      {product.oldPrice?.toLocaleString("vi-VN")}₫
                    </span>
                  ) : null}
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <OptionSelector label="Màu sắc" options={colors} selected={selectedColor} onSelect={setSelectedColor} />
                  <OptionSelector label="Kích cỡ" options={sizes} selected={selectedSize} onSelect={setSelectedSize} />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="space-y-1">
                    <QtyInput value={qty} onChange={setQty} max={maxQty ?? undefined} />
                    {typeof stock === "number" && (
                      <p className="text-xs text-slate-500">
                        {isOutOfStock ? "Hết hàng" : `Còn ${stock} sản phẩm`}
                      </p>
                    )}
                  </div>
                  <button
                    className="rounded-full bg-brand-primary px-5 py-2 text-white hover:bg-[#e5553d] transition"
                    type="button"
                    onClick={() => handleAddToCart(false)}
                    disabled={adding || isOutOfStock}
                  >
                    Thêm vào giỏ
                  </button>
                  <button
                    className="rounded-full border border-brand-primary px-5 py-2 text-brand-primary hover:bg-brand-primary hover:text-white transition"
                    type="button"
                    onClick={() => handleAddToCart(true)}
                    disabled={adding || isOutOfStock}
                  >
                    {adding ? "Đang xử lý..." : "Mua ngay"}
                  </button>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border bg-[#fffaf6] p-4">
                <p className="text-sm font-semibold text-brand-dark">Ưu đãi & vận chuyển</p>
                <div className="space-y-2 text-sm text-gray-600">
                  {[Truck, BadgePercent, RotateCcw, Headphones].map((Icon, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-brand-primary" />
                      <p>{["Giao hàng toàn quốc", "Giảm giá thành viên", "Đổi trả 7 ngày", "Hỗ trợ 24/7"][i]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 pb-8">
            <div className="flex gap-6 justify-center border-b">
              {["info", "policy", "review"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`py-2 ${
                    tab === t ? "text-brand-primary border-b-2 border-brand-primary" : "text-gray-500"
                  }`}
                  type="button"
                >
                  {t === "info"
                    ? "Thông tin sản phẩm"
                    : t === "policy"
                    ? "Chính sách đổi trả"
                    : "Đánh giá sản phẩm"}
                </button>
              ))}
            </div>

            <div className="mt-6 text-sm text-gray-700 leading-6 max-w-4xl mx-auto">
              {tab === "info" && (
                <div className="space-y-3">
                  <p>{product.detail || product.description}</p>
                  {product.colors?.length ? (
                    <p className="text-gray-600">Màu sắc: {product.colors.join(", ")}</p>
                  ) : null}
                  {product.sizes?.length ? (
                    <p className="text-gray-600">Kích cỡ: {product.sizes.join(", ")}</p>
                  ) : null}
                </div>
              )}

              {tab === "policy" && (
                <p>Áp dụng theo chính sách đổi trả của cửa hàng (7 ngày, giữ nguyên tem mác).</p>
              )}

              {tab === "review" && (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border bg-gray-50 p-6">
                      <p className="text-sm text-gray-500">Đánh giá trung bình</p>
                      <div className="mt-2 flex items-end gap-3">
                        <span className="text-4xl font-bold text-brand-primary">
                          {averageRating.toFixed(1)}
                        </span>
                        <span className="text-gray-500">/5 ({totalReviews || 0} đánh giá)</span>
                      </div>
                      <div className="mt-3 flex gap-1 text-amber-400 text-xl">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <span key={i}>{i < Math.round(averageRating) ? "★" : "☆"}</span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border p-6 bg-white shadow-sm">
                      <p className="text-sm text-gray-500">Muốn chia sẻ trải nghiệm?</p>
                      <p className="mt-2 text-gray-700">
                        Sau khi nhận hàng thành công, hãy vào mục Đơn mua & chọn “Đánh giá sản phẩm”.
                        Đánh giá của bạn giúp chúng tôi phục vụ tốt hơn.
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate("/orders")}
                        className="mt-4 inline-flex items-center justify-center rounded-full border border-brand-primary px-5 py-2 text-brand-primary hover:bg-brand-primary hover:text-white transition"
                      >
                        Đến trang Đơn mua
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {reviewLoading && reviews.length === 0 ? (
                      <div className="text-gray-500">Đang tải đánh giá...</div>
                    ) : reviews.length ? (
                      reviews.map((review) => (
                        <div
                          key={review._id}
                          className="rounded-2xl border border-gray-100 p-5 shadow-sm bg-white"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-brand-dark">
                                {review.user?.name || "Khách hàng ẩn danh"}
                              </p>
                              <div className="flex gap-1 text-amber-400 text-sm">
                                {[0, 1, 2, 3, 4].map((i) => (
                                  <span key={i}>{i < Number(review.rating || 0) ? "★" : "☆"}</span>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-400">
                              {review.createdAt
                                ? new Date(review.createdAt).toLocaleDateString("vi-VN")
                                : ""}
                            </p>
                          </div>
                          {review.title && (
                            <p className="mt-3 font-medium text-gray-900">{review.title}</p>
                          )}
                          {review.body && (
                            <p className="mt-2 text-gray-600 whitespace-pre-line">{review.body}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Chưa có đánh giá cho sản phẩm này.</p>
                    )}
                  </div>

                  {hasMoreReviews && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => loadReviews((reviewMeta.page || 1) + 1, true)}
                        disabled={reviewLoading}
                        className="rounded-full border border-gray-300 px-5 py-2 text-sm text-gray-600 hover:border-brand-primary hover:text-brand-primary transition disabled:opacity-60"
                      >
                        {reviewLoading ? "Đang tải..." : "Xem thêm đánh giá"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
