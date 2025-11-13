import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  FolderTree,
  Image as ImageIcon,
  RefreshCw,
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { prepareCsrfHeaders } from "@/lib/csrf";

const PAGE_SIZE = 10;

const emptyForm = {
  name: "",
  slug: "",
  parent: "",
  description: "",
  image: "",
};

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [q, setQ] = useState("");
  const [parentFilter, setParentFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadCategories = async ({ nextPage = page, keyword = q, parentValue = parentFilter } = {}) => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      params.set("page", nextPage);
      params.set("limit", PAGE_SIZE);
      if (keyword.trim()) params.set("q", keyword.trim());
      if (parentValue === "root") params.set("parent", "null");
      else if (parentValue === "hasParent") params.set("parent", "notnull");
      const { data } = await api.get(`/categories?${params.toString()}`);
      const items = Array.isArray(data) ? data : data.items || [];
      setCategories(items);
      setTotal(Array.isArray(data) ? items.length : data.total || items.length);
      setPage(Array.isArray(data) ? 1 : data.page || nextPage);
    } catch (err) {
      const message = err?.response?.data?.message || "Không tải được danh mục";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const loadParentOptions = async () => {
    try {
      const { data } = await api.get("/categories");
      setAllCategories(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      console.error("Không tải được danh mục cha", err);
    }
  };

  useEffect(() => {
    loadCategories({ nextPage: 1 });
    loadParentOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCategories({ nextPage: 1, keyword: q });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const findParent = (id) => allCategories.find((c) => c._id === id)?.name ?? "—";
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,.12)] px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-lg font-semibold">Danh mục</h1>
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm tên hoặc slug…"
                className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 w-64 focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]/40"
              />
            </div>
            <select
              value={parentFilter}
              onChange={(e) => {
                const value = e.target.value;
                setParentFilter(value);
                loadCategories({ nextPage: 1, parentValue: value });
              }}
              className="px-3 py-2 rounded-xl border border-slate-200"
            >
              <option value="all">Tất cả</option>
              <option value="root">Chỉ danh mục gốc</option>
              <option value="hasParent">Chỉ danh mục con</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => loadCategories({ nextPage: 1 })}
                type="button"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw className="w-4 h-4" />
                Tải lại
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-[#FF6A3D] text-white hover:opacity-90"
                type="button"
                onClick={() => {
                  setEditing(null);
                  setFormData(emptyForm);
                  setShowForm(true);
                }}
              >
                <Plus className="w-4 h-4" /> Thêm danh mục
              </button>
            </div>
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
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3">Danh mục cha</th>
                  <th className="px-6 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {categories.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                        />
                      ) : (
                        <div className="w-14 h-14 grid place-content-center border border-slate-200 rounded-lg text-slate-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">{c.name}</td>
                    <td className="px-6 py-4 text-slate-600">{c.slug}</td>
                    <td className="px-6 py-4">
                      {c.parent ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-sky-50 text-sky-700">
                          <FolderTree className="w-3 h-3" /> {findParent(c.parent)}
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-lg bg-slate-100">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                          title="Sửa"
                          type="button"
                          onClick={() => {
                            setEditing(c);
                            setFormData({
                              name: c.name || "",
                              slug: c.slug || "",
                              parent: c.parent || "",
                              description: c.description || "",
                              image: c.image || "",
                            });
                            setShowForm(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                          title="Xoá"
                          type="button"
                          onClick={async () => {
                            const ok = window.confirm(`Xóa danh mục "${c.name}"?`);
                            if (!ok) return;
                            try {
                              const headers = await prepareCsrfHeaders();
                              await api.delete(`/categories/${c._id}`, { headers });
                              toast.success("Đã xóa danh mục");
                              loadCategories({ nextPage: 1 });
                              loadParentOptions();
                            } catch (err) {
                              toast.error(err?.response?.data?.message || "Không xóa được danh mục");
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                      Không có danh mục.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-sm text-slate-600">
          <span>
            Trang {page}/{totalPages} — Tổng {total} danh mục
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => page > 1 && loadCategories({ nextPage: page - 1 })}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50"
              type="button"
            >
              Trước
            </button>
            <button
              onClick={() => page < totalPages && loadCategories({ nextPage: page + 1 })}
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
        <div className="fixed inset-0 z-50 bg-black/40 px-4 flex items-center justify-center">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {editing ? "Cập nhật danh mục" : "Thêm danh mục"}
              </h2>
              <button
                type="button"
                className="text-slate-500 hover:text-slate-800"
                onClick={() => !saving && (setShowForm(false), setEditing(null), setFormData(emptyForm))}
              >
                ×
              </button>
            </div>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!formData.name.trim()) {
                  toast.error("Tên danh mục là bắt buộc");
                  return;
                }
                try {
                  setSaving(true);
                  const headers = await prepareCsrfHeaders();
                  const payload = {
                    name: formData.name.trim(),
                    slug: formData.slug.trim() || undefined,
                    description: formData.description,
                    image: formData.image?.trim() || undefined,
                    parent: formData.parent || null,
                  };
                  if (payload.parent === "root") payload.parent = null;
                  if (!payload.parent) delete payload.parent;
                  if (!payload.image) delete payload.image;
                  if (!payload.slug) delete payload.slug;
                  if (!payload.description) delete payload.description;
                  if (editing?._id) {
                    await api.put(`/categories/${editing._id}`, payload, { headers });
                    toast.success("Đã cập nhật danh mục");
                  } else {
                    await api.post("/categories", payload, { headers });
                    toast.success("Đã tạo danh mục");
                  }
                  setShowForm(false);
                  setEditing(null);
                  setFormData(emptyForm);
                  loadCategories({ nextPage: 1 });
                  loadParentOptions();
                } catch (err) {
                  toast.error(err?.response?.data?.message || "Không lưu được danh mục");
                } finally {
                  setSaving(false);
                }
              }}
            >
              <div>
                <label className="text-sm font-medium text-slate-600">Tên danh mục</label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-600">Slug</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Danh mục cha</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={formData.parent || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, parent: e.target.value || "" }))}
                  >
                    <option value="">-- Không có --</option>
                    {allCategories
                      .filter((cat) => !editing || cat._id !== editing._id)
                      .map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Ảnh (URL)</label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  value={formData.image}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Mô tả</label>
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                  onClick={() => !saving && (setShowForm(false), setEditing(null), setFormData(emptyForm))}
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
