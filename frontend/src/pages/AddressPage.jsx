import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { prepareCsrfHeaders } from "@/lib/csrf";

const emptyForm = {
  label: "",
  line1: "",
  line2: "",
  city: "",
  district: "",
  ward: "",
  phone: "",
  isDefault: false,
};

export default function AddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/addresses");
      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không tải được địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const headers = await prepareCsrfHeaders();
      await api.post("/addresses", formData, { headers });
      toast.success("Đã thêm địa chỉ");
      setFormData(emptyForm);
      setShowForm(false);
      await loadAddresses();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không thêm được địa chỉ");
    } finally {
      setSaving(false);
    }
  };

  const makeDefault = async (id) => {
    try {
      const headers = await prepareCsrfHeaders();
      await api.put(`/addresses/${id}/default`, null, { headers });
      toast.success("Đã đặt làm mặc định");
      await loadAddresses();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không đặt được mặc định");
    }
  };

  const removeAddress = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
    try {
      const headers = await prepareCsrfHeaders();
      await api.delete(`/addresses/${id}`, { headers });
      toast.success("Đã xóa địa chỉ");
      await loadAddresses();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không xóa được địa chỉ");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Địa chỉ của tôi</h2>
          <p className="text-gray-500 mt-1">
            Quản lý các địa chỉ nhận hàng đã lưu.
          </p>
        </div>
        <button
          className="bg-brand-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#e5553d] transition"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Đóng" : "+ Thêm địa chỉ"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3 bg-white rounded-2xl p-5 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="label"
              placeholder="Tên địa chỉ (Nhà riêng, Công ty...)"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm"
              value={formData.label}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Số điện thoại"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <input
            name="line1"
            placeholder="Địa chỉ chi tiết"
            className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm"
            value={formData.line1}
            onChange={handleChange}
            required
          />
          <input
            name="line2"
            placeholder="Ghi chú thêm (không bắt buộc)"
            className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm"
            value={formData.line2}
            onChange={handleChange}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              name="city"
              placeholder="Tỉnh/Thành phố"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <input
              name="district"
              placeholder="Quận/Huyện"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm"
              value={formData.district}
              onChange={handleChange}
              required
            />
            <input
              name="ward"
              placeholder="Phường/Xã"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm"
              value={formData.ward}
              onChange={handleChange}
              required
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />
            Đặt làm địa chỉ mặc định
          </label>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-brand-primary text-white font-semibold hover:bg-[#e5553d] transition disabled:opacity-60"
          >
            {saving ? "Đang lưu..." : "Lưu địa chỉ"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-gray-500">Đang tải địa chỉ...</div>
      ) : addresses.length === 0 ? (
        <div className="text-gray-500">Bạn chưa có địa chỉ nào.</div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <div className="font-medium text-lg">
                  {addr.label || "Địa chỉ"}{" "}
                  <span className="text-gray-500 text-sm">
                    {addr.phone}
                  </span>
                </div>
                <div className="text-gray-600 mt-1">
                  {addr.line1}
                  {addr.line2 ? `, ${addr.line2}` : ""}, {addr.ward}, {addr.district}, {addr.city}
                </div>
                {addr.isDefault && (
                  <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full border border-brand-primary text-brand-primary">
                    Mặc định
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {!addr.isDefault && (
                  <button
                    className="px-3 py-1.5 rounded-xl border text-sm"
                    onClick={() => makeDefault(addr._id)}
                  >
                    Đặt mặc định
                  </button>
                )}
                <button
                  className="px-3 py-1.5 rounded-xl border border-red-200 text-sm text-red-600"
                  onClick={() => removeAddress(addr._id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

