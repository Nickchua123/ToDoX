import { useEffect, useState } from "react";
import { Plus, RefreshCcw, Save, X, Trash2, Edit3 } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { prepareCsrfHeaders } from "@/lib/csrf";

const blankForm = {
  code: "",
  discountPercent: "",
  maxUses: "",
  expiresAt: "",
  active: true,
};

const formatDateInput = (value) => {
  if (!value) return "";
  try {
    const d = new Date(value);
    const iso = d.toISOString();
    return iso.slice(0, 16); // yyyy-MM-ddTHH:mm
  } catch {
    return "";
  }
};

export default function CouponsAdmin() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/coupons");
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không tải được danh sách mã");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(blankForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code || form.discountPercent === "") {
      toast.error("Nhập mã và % giảm");
      return;
    }
    setSaving(true);
    try {
      const headers = await prepareCsrfHeaders();
      const payload = {
        code: form.code.trim(),
        discountPercent: Number(form.discountPercent) || 0,
        maxUses: form.maxUses ? Number(form.maxUses) : 0,
        expiresAt: form.expiresAt ? new Date(form.expiresAt) : undefined,
        active: Boolean(form.active),
      };
      if (editingId) {
        await api.put(`/coupons/${editingId}`, payload, { headers });
        toast.success("Đã cập nhật mã");
      } else {
        await api.post("/coupons", payload, { headers });
        toast.success("Đã tạo mã");
      }
      resetForm();
      await loadCoupons();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lưu mã thất bại");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (coupon) => {
    setEditingId(coupon._id);
    setForm({
      code: coupon.code || "",
      discountPercent: coupon.discountPercent ?? "",
      maxUses: coupon.maxUses ?? "",
      expiresAt: formatDateInput(coupon.expiresAt),
      active: coupon.active !== false,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa mã này?")) return;
    try {
      const headers = await prepareCsrfHeaders();
      await api.delete(`/coupons/${id}`, { headers });
      toast.success("Đã xóa mã");
      await loadCoupons();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Xóa mã thất bại");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Quản lý mã giảm giá</h1>
          <p className="text-sm text-slate-500">Thêm/sửa mã và giới hạn lượt dùng.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm"
            onClick={loadCoupons}
            disabled={loading}
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Tải lại
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-600 text-white text-sm hover:brightness-95"
            onClick={resetForm}
          >
            <Plus className="w-4 h-4" />
            Mã mới
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="font-semibold text-slate-800">Danh sách mã</div>
            <span className="text-xs text-slate-500">{coupons.length} mã</span>
          </div>
          <div className="divide-y">
            {loading ? (
              <div className="p-4 text-sm text-slate-500">Đang tải...</div>
            ) : coupons.length === 0 ? (
              <div className="p-4 text-sm text-slate-500">Chưa có mã nào.</div>
            ) : (
              coupons.map((cp) => (
                <div key={cp._id} className="p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{cp.code}</span>
                      <span className="text-xs text-slate-500">-{cp.discountPercent}%</span>
                      {cp.active ? (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Đang bật
                        </span>
                      ) : (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          Tắt
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      Dùng {cp.used || 0}/{cp.maxUses || "∞"} • Hết hạn:{" "}
                      {cp.expiresAt ? new Date(cp.expiresAt).toLocaleString("vi-VN") : "Không đặt"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="p-2 rounded-lg border text-sm"
                      onClick={() => startEdit(cp)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg border border-red-200 text-red-600 text-sm"
                      onClick={() => handleDelete(cp._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900">
                {editingId ? "Sửa mã" : "Tạo mã mới"}
              </div>
              <div className="text-xs text-slate-500">Nhập thông tin mã giảm</div>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
              >
                <X className="w-3 h-3" /> Hủy sửa
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Mã</label>
              <input
                name="code"
                value={form.code}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-100 focus:border-sky-400"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">% giảm</label>
              <input
                type="number"
                name="discountPercent"
                value={form.discountPercent}
                onChange={onChange}
                min={0}
                max={100}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-100 focus:border-sky-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Giới hạn lượt</label>
              <input
                type="number"
                name="maxUses"
                value={form.maxUses}
                onChange={onChange}
                min={0}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-100 focus:border-sky-400"
                placeholder="0 = không giới hạn"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Hết hạn</label>
              <input
                type="datetime-local"
                name="expiresAt"
                value={form.expiresAt}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-sky-100 focus:border-sky-400"
              />
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={onChange}
              className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
            />
            Đang kích hoạt
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-lg border text-sm text-slate-600"
              disabled={saving}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:brightness-95 disabled:opacity-60 inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
