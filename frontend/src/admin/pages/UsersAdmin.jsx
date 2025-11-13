import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, Mail, CalendarDays, PhoneCall, Pencil, Trash2, Plus } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { prepareCsrfHeaders } from "@/lib/csrf";

const PAGE_SIZE = 10;
const GENDERS = ["Nam", "Nữ", "Khác"];
const ROLE_OPTIONS = [
  { value: "admin", label: "Quản trị viên" },
  { value: "staff", label: "Nhân viên" },
  { value: "customer", label: "Khách hàng" },
];
const blankForm = {
  name: "",
  email: "",
  username: "",
  phone: "",
  gender: "Khác",
  password: "",
  role: "customer",
};

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(blankForm);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async ({ page: nextPage = page, keyword = q } = {}) => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      params.set("limit", PAGE_SIZE);
      params.set("page", nextPage);
      if (keyword.trim()) params.set("q", keyword.trim());
      const { data } = await api.get(`/users?${params.toString()}`);
      setUsers(data?.items || []);
      setTotal(data?.total || 0);
      setPage(data?.page || nextPage);
    } catch (err) {
      const message = err?.response?.data?.message || "Không tải được người dùng";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers({ page: 1, keyword: q });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  const formattedUsers = useMemo(
    () =>
      users.map((u) => ({
        ...u,
        createdLabel: u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "—",
      })),
    [users]
  );

  const openCreate = () => {
    setEditing(null);
    setFormData(blankForm);
    setShowForm(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      username: user.username || "",
      phone: user.phone || "",
      gender: GENDERS.includes(user.gender) ? user.gender : "Khác",
      role: ROLE_OPTIONS.some((r) => r.value === user.role) ? user.role : "customer",
      password: "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditing(null);
    setFormData(blankForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Tên và email là bắt buộc");
      return;
    }
    if (!editing && formData.password.trim().length < 8) {
      toast.error("Mật khẩu tối thiểu 8 ký tự");
      return;
    }
    try {
      setSaving(true);
      const headers = await prepareCsrfHeaders();
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        username: formData.username.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        role: formData.role,
      };
      if (!payload.username) delete payload.username;
      if (!payload.phone) payload.phone = "";
      if (!payload.role) delete payload.role;
      if (editing?._id) {
        await api.patch(`/users/${editing._id}`, payload, { headers });
        toast.success("Đã cập nhật người dùng");
      } else {
        payload.password = formData.password.trim();
        await api.post("/users", payload, { headers });
        toast.success("Đã tạo người dùng");
      }
      closeForm();
      fetchUsers({ page: 1 });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không lưu được người dùng");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    const ok = window.confirm(`Xóa người dùng ${user.name || user.email}?`);
    if (!ok) return;
    try {
      const headers = await prepareCsrfHeaders();
      await api.delete(`/users/${user._id}`, { headers });
      toast.success("Đã xóa người dùng");
      fetchUsers({ page: 1 });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không xóa được người dùng");
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,.12)] px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-lg font-semibold">Người dùng</h1>
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm tên hoặc email…"
                className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 w-64 focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]/40"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchUsers({ page: 1 })}
                type="button"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw className="w-4 h-4" /> Tải lại
              </button>
              <button
                onClick={openCreate}
                type="button"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-[#FF6A3D] text-white hover:opacity-90"
              >
                <Plus className="w-4 h-4" /> Thêm người dùng
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
                  <th className="px-6 py-3">Tên</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">SĐT</th>
                  <th className="px-6 py-3">Giới tính</th>
                  <th className="px-6 py-3">Quyền</th>
                  <th className="px-6 py-3">Ngày tạo</th>
                  <th className="px-6 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {formattedUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-medium">
                      <div className="flex flex-col">
                        <span>{u.name || "(Không tên)"}</span>
                        <span className="text-xs text-slate-500">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-slate-400" />
                        <span>{u.phone || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{u.gender || "Khác"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${
                          u.role === "admin"
                            ? "bg-rose-50 text-rose-700"
                            : u.role === "staff"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {ROLE_OPTIONS.find((r) => r.value === u.role)?.label || "Khách hàng"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                        <span>{u.createdLabel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                          title="Sửa"
                          type="button"
                          onClick={() => openEdit(u)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                          title="Xoá"
                          type="button"
                          onClick={() => handleDelete(u)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {formattedUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                      Không có người dùng.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-sm text-slate-600">
          <span>
            Trang {page}/{totalPages} — Tổng {total} người dùng
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => page > 1 && fetchUsers({ page: page - 1 })}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50"
              type="button"
            >
              Trước
            </button>
            <button
              onClick={() => page < totalPages && fetchUsers({ page: page + 1 })}
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
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editing ? "Cập nhật" : "Thêm người dùng"}</h2>
              <button
                type="button"
                className="text-slate-500 hover:text-slate-800"
                onClick={closeForm}
                disabled={saving}
              >
                ×
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-600">Họ tên</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Email</label>
                  <input
                    type="email"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-600">Username</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={formData.username}
                    onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Số điện thoại</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">Giới tính</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={formData.gender}
                    onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value }))}
                  >
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Quyền hạn</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    value={formData.role}
                    onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                  >
                    {ROLE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {!editing && (
                  <div>
                    <label className="text-sm font-medium text-slate-600">Mật khẩu</label>
                    <input
                      type="password"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                  onClick={closeForm}
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
