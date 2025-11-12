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
import { addCartItem } from "@/services/cartService";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import api from "@/lib/axios";

const QtyInput = ({ value, onChange }) => (
  <div className="inline-flex items-center gap-3 rounded-xl border px-3 py-2">
    <button onClick={() => onChange(Math.max(1, value - 1))} className="text-sm" type="button">
      -
    </button>
    <span className="min-w-6 text-center text-sm">{value}</span>
    <button onClick={() => onChange(value + 1)} className="text-sm" type="button">
      +
    </button>
  </div>
);

export default function ProductDetail({ id: passedId }) {
  const { id: routeId } = useParams();
  const id = String(passedId ?? routeId ?? "1");
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [adding, setAdding] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("info");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
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

  const next = () => setActive((a) => (a + 1) % gallery.length);
  const prev = () => setActive((a) => (a - 1 + gallery.length) % gallery.length);

  const handleAddToCart = async (redirect) => {
    if (!product?._id) {
      toast.error("Không xác định được sản phẩm để thêm vào giỏ.");
      return;
    }
    try {
      setAdding(true);
      await addCartItem({
        productId: product._id,
        quantity: qty,
      });
      await refreshCart();
      toast.success("Đã thêm vào giỏ hàng");
      if (redirect) navigate("/checkout");
    } catch (err) {
      const message = err?.response?.data?.message || "Không thể thêm sản phẩm vào giỏ.";
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
                <div className="flex md:flex-col gap-3 overflow-auto no-scrollbar">
                  {gallery.map((img, i) => (
                    <button
                      key={img + i}
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

              {tab === "review" && <p>Chưa có đánh giá.</p>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
