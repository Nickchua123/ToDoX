import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Image as ImageIcon, RefreshCcw } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { prepareCsrfHeaders } from "@/lib/csrf";

const PAGE_SIZE = 10;
const blankForm = {
  name: "",
  slug: "",
  category: "",
  price: "",
  oldPrice: "",
  stock: "",
  description: "",
  colors: "",
  sizes: "",
  images: "",
  isPublished: true,
};

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(blankForm);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadProducts = async ({ page: nextPage = page } = {}) => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      params.set("limit", PAGE_SIZE);
      params.set("page", nextPage);
      params.set("sort", "-createdAt");
      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data?.items || []);
      setTotal(data?.total || 0);
      setPage(data?.page || nextPage);
    } catch (err) {
      const message = err?.response?.data?.message || "Không tải được danh sách sản phẩm";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Không tải được danh mục", err);
    }
  };

  useEffect(() => {
    loadProducts({ page: 1 });
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatCurrency = (value) => {
    if (typeof value !== "number") return "—";
    return value.toLocaleString("vi-VN") + "₫";
  };

  const openCreate = () => {
    setEditing(null);
    setFormData(blankForm);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setFormData({
      name: product.name || "",
      slug: product.slug || "",
      category: product.category?._id || product.category || "",
      price: product.price ?? "",
      oldPrice: product.oldPrice ?? "",
      stock: product.stock ?? "",
      description: product.description || "",
      colors: Array.isArray(product.colors) ? product.colors.join(", ") : "",
      sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
      images: Array.isArray(product.images) ? product.images.join(", ") : "",
      isPublished: product.isPublished !== false,
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditing(null);
    setFormData(blankForm);
  };

  const normalizePayload = () => {
    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      category: formData.category || undefined,
      price: Number(formData.price) || 0,
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
      stock: Number(formData.stock) || 0,
      description: formData.description,
      colors: formData.colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      sizes: formData.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      images: formData.images
        .split(",")
        .map((img) => img.trim())
        .filter(Boolean),
      isPublished: Boolean(formData.isPublished),
    };
    if (!payload.slug && payload.name) {
      payload.slug = payload.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = normalizePayload();
    if (!payload.name || !payload.slug || !payload.price || !payload.category) {
      toast.error("Vui lòng nhập đầy đủ tên, slug, giá và danh mục");
      return;
    }
    try {
      setSaving(true);
      const headers = await prepareCsrfHeaders();
      if (editing?._id) {
        await api.put(`/products/${editing._id}`, payload, { headers });
        toast.success("Đã cập nhật sản phẩm");
      } else {
        await api.post("/products", payload, { headers });
        toast.success("Đã tạo sản phẩm");
      }
      handleCloseForm();
      await loadProducts({ page: 1 });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không lưu được sản phẩm");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const ok = window.confirm(`Xóa sản phẩm "${product.name}"?`);
    if (!ok) return;
    try {
      const headers = await prepareCsrfHeaders();
      await api.delete(`/products/${product._id}`, { headers, params: { hard: true } });
      toast.success("Đã xóa sản phẩm");
      await loadProducts({ page });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không xóa được sản phẩm");
    }
  };

  const categoryOptions = useMemo(() => categories.map((cat) => ({ value: cat._id, label: cat.name })), [categories]);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,.12)] px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-semibold">Sản phẩm</h1>
          <div className="flex gap-2">
            <button
              onClick={() => loadProducts({ page: 1 })}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
              type="button"
            >
              <RefreshCcw className="w-4 h-4" />
              Tải lại
            </button>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-[#FF6A3D] text-white hover:opacity-90"
              type="button"
            >
              <Plus className="w-4 h-4" /> Thêm sản phẩm
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,.12)]">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-12 text-center text-slate-500">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="px-6 py-12 text-center text-rose-600">{error}</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="px-6 py-3">Ảnh</th>
                  <th className="px-6 py-3">Tên</th>
                  <th className="px-6 py-3">Danh mục</th>
                  <th className="px-6 py-3">Giá</th>
                  <th className="px-6 py-3">Kho</th>
                  <th className="px-6 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      {p.images?.length ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                        />
                      ) : (
                        <div className="w-14 h-14 grid place-content-center border border-slate-200 rounded-lg text-slate-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      <div className="flex flex-col">
                        <span>{p.name}</span>
                        <span className="text-xs text-slate-500">{p.slug}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{p.category?.name || "—"}</td>
                    <td className="px-6 py-4">{formatCurrency(p.price)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs ${
                          p.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {p.stock > 0 ? `${p.stock} còn` : "Hết hàng"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                          title="Sửa"
                          type="button"
                          onClick={() => openEdit(p)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                          title="Xoá"
                          type="button"
                          onClick={() => handleDelete(p)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                      Chưa có sản phẩm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-sm text-slate-600">
          <span>
            Trang {page}/{totalPages} — Tổng {total} sản phẩm
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => page > 1 && loadProducts({ page: page - 1 })}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50"
              type="button"
            >
              Trước
            </button>
            <button
              onClick={() => page < totalPages && loadProducts({ page: page + 1 })}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50"
              type="button"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl p-6 relative">
            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-600">Tên sản phẩm</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Slug</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">Giá</label>
                  <input
                    type="number"
                    min="0"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Giá cũ</label>
                  <input
                    type="number"
                    min="0"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData((prev) => ({ ...prev, oldPrice: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Tồn kho</label>
                  <input
                    type="number"
                    min="0"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={formData.stock}
                    onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-600">Danh mục</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="isPublished"
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary/30"
                  />
                  <label htmlFor="isPublished" className="text-sm text-slate-600">
                    Hiển thị sản phẩm
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600">Mô tả ngắn</label>
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">Màu sắc (phẩy)</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={formData.colors}
                    onChange={(e) => setFormData((prev) => ({ ...prev, colors: e.target.value }))}
                    placeholder="Đỏ, Xanh..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Kích cỡ (phẩy)</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={formData.sizes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sizes: e.target.value }))}
                    placeholder="S, M, L"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Ảnh (URL, phẩy)</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={formData.images}
                    onChange={(e) => setFormData((prev) => ({ ...prev, images: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                  disabled={saving}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#FF6A3D] px-4 py-2 text-sm font-medium text-white hover:bg-[#e65a2d]"
                  disabled={saving}
                >
                  {saving ? "Đang lưu..." : editing ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
