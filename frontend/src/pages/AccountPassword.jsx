import { useState } from "react";
import api from "@/lib/axios";
import { prepareCsrfHeaders } from "@/lib/csrf";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const isStrongPassword = (pwd) => {
  const s = String(pwd || "");
  return s.length >= 12 && /[A-Z]/.test(s) && /\d/.test(s) && /[^A-Za-z0-9]/.test(s);
};

export default function AccountPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const { logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đủ thông tin");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Xác nhận mật khẩu không khớp");
      return;
    }
    if (!isStrongPassword(newPassword)) {
      toast.error("Mật khẩu mới yếu. Tối thiểu 12 ký tự, có chữ hoa, số và ký tự đặc biệt.");
      return;
    }
    setSaving(true);
    try {
      const headers = await prepareCsrfHeaders();
      await api.put("/auth/change-password", { currentPassword, newPassword }, { headers });
      toast.success("Đổi mật khẩu thành công, vui lòng đăng nhập lại");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      await logout();
      window.location.href = "/login";
    } catch (err) {
      const msg = err?.response?.data?.message || "Không đổi được mật khẩu";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2x2">
      <div>
        <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>
        <p className="text-gray-500 mt-1">Cho phép cập nhật mật khẩu khi cần.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
          <input
            type="password"
            className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Mật khẩu mới</label>
          <input
            type="password"
            className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <p className="text-xs text-gray-500">
            Tối thiểu 12 ký tự, có chữ hoa, số và ký tự đặc biệt.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-[#e5553d] transition disabled:opacity-60"
          >
            {saving ? "Đang lưu..." : "Cập nhật mật khẩu"}
          </button>
          <span className="text-xs text-gray-500">Bạn sẽ cần đăng nhập lại sau khi đổi.</span>
        </div>
      </form>
    </div>
  );
}
