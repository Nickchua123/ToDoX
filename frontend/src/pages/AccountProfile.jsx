import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
import { prepareCsrfHeaders } from "@/lib/csrf";
import { toast } from "sonner";

const inputClass =
  "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#ff6347]/60 focus:outline-none transition";

const genderOptions = ["Nam", "Nữ", "Khác"];

export default function AccountProfile() {
  const { user, refreshAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    gender: "Khác",
    dateOfBirth: "",
    avatar: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        phone: user.phone || "",
        gender: user.gender || "Khác",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const headers = await prepareCsrfHeaders();
      const payload = {
        ...formData,
        dateOfBirth: formData.dateOfBirth || null,
      };
      await api.patch("/users/me", payload, { headers });
      toast.success("Đã cập nhật hồ sơ");
      await refreshAuth();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-8 max-w-5xl">
      <h2 className="text-xl font-semibold mb-1">Hồ Sơ Của Tôi</h2>
      <p className="text-gray-500 mb-8">
        Quản lý thông tin hồ sơ để bảo mật tài khoản
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT FORM */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="text-sm text-gray-600">Tên đăng nhập</label>
            <input
              name="username"
              className={inputClass}
              value={formData.username}
              onChange={handleChange}
              placeholder="Tên đăng nhập"
            />
            <p className="text-xs text-gray-400 mt-1">
              Tên đăng nhập chỉ có thể thay đổi một lần.
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600">Tên</label>
            <input
              name="name"
              className={inputClass}
              value={formData.name}
              onChange={handleChange}
              placeholder="Họ và tên"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-800 flex-1 truncate">
                {user?.email || "chưa có"}
              </span>
              <button type="button" className="text-sm text-[#ff6347]">
                Thay đổi
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Số điện thoại</label>
            <div className="flex items-center gap-2">
              <input
                name="phone"
                className={`${inputClass} flex-1`}
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Giới tính</label>
            <div className="flex items-center gap-6 mt-2">
              {genderOptions.map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                    className="accent-[#ff6347]"
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Ngày sinh</label>
            <div className="flex gap-2 mt-1">
              <input
                type="date"
                name="dateOfBirth"
                className={`${inputClass} w-56`}
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-md bg-[#ff6347] text-white text-sm font-medium hover:bg-[#e45435] transition disabled:opacity-60"
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </div>

        {/* RIGHT AVATAR */}
        <div className="flex flex-col items-center gap-4 border-l pl-6">
          {formData.avatar ? (
            <img
              src={formData.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border flex items-center justify-center text-gray-400 text-3xl">
              <i className="fa-regular fa-user" />
            </div>
          )}
          <label className="cursor-pointer inline-block border px-4 py-2 rounded-md text-sm bg-gray-50 hover:bg-gray-100">
            Chọn Ảnh
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setFormData((p) => ({ ...p, avatar: url }));
                }
              }}
            />
          </label>
          <p className="text-xs text-gray-400 text-center">
            Dung lượng file tối đa 1MB<br />Định dạng: JPEG, PNG
          </p>
        </div>
      </form>
    </div>
  );
}

