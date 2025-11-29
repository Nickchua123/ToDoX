import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { prepareCsrfHeaders } from "@/lib/csrf";
import { getProvinces, getDistricts, getWards } from "@/services/shippingService";

const emptyForm = {
  _id: "",
  label: "",
  line1: "",
  line2: "",
  city: "",
  district: "",
  ward: "",
  phone: "",
  isDefault: false,
  provinceId: "",
  districtId: "",
  wardCode: "",
  provinceName: "",
  districtName: "",
  wardName: "",
};

export default function AddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

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

  const ensureProvinces = async () => {
    if (provinces.length) return;
    try {
      setLoadingLocations(true);
      const data = await getProvinces();
      setProvinces(data);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được danh sách tỉnh/thành");
    } finally {
      setLoadingLocations(false);
    }
  };

  useEffect(() => {
    if (showForm) {
      ensureProvinces();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm]);

  const handleProvinceSelect = async (provinceId) => {
    const selected = provinces.find(
      (item) => String(item.ProvinceID) === String(provinceId)
    );
    setFormData((prev) => ({
      ...prev,
      provinceId: provinceId || "",
      city: selected?.ProvinceName || "",
      provinceName: selected?.ProvinceName || "",
      districtId: "",
      district: "",
      districtName: "",
      wardCode: "",
      ward: "",
      wardName: "",
    }));
    setDistricts([]);
    setWards([]);
    if (!provinceId) return;
    try {
      setLoadingLocations(true);
      const data = await getDistricts(provinceId);
      setDistricts(data);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được quận/huyện");
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleDistrictSelect = async (districtId) => {
    const selected = districts.find(
      (item) => String(item.DistrictID) === String(districtId)
    );
    setFormData((prev) => ({
      ...prev,
      districtId: districtId || "",
      district: selected?.DistrictName || "",
      districtName: selected?.DistrictName || "",
      wardCode: "",
      ward: "",
      wardName: "",
    }));
    setWards([]);
    if (!districtId) return;
    try {
      setLoadingLocations(true);
      const data = await getWards(districtId);
      setWards(data);
    } catch (err) {
      console.error(err);
      toast.error("Không tải được phường/xã");
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleWardSelect = (wardCode) => {
    const selected = wards.find((item) => item.WardCode === wardCode);
    setFormData((prev) => ({
      ...prev,
      wardCode: wardCode || "",
      ward: selected?.WardName || "",
      wardName: selected?.WardName || "",
    }));
  };

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
      if (formData._id) {
        await api.put(`/addresses/${formData._id}`, formData, { headers });
        toast.success("Đã cập nhật địa chỉ");
      } else {
        await api.post("/addresses", formData, { headers });
        toast.success("Đã thêm địa chỉ");
      }
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

  const startEdit = (addr) => {
    if (!addr) return;
    setFormData({
      _id: addr._id,
      label: addr.label || "",
      line1: addr.line1 || "",
      line2: addr.line2 || "",
      city: addr.city || "",
      district: addr.district || "",
      ward: addr.ward || "",
      phone: addr.phone || "",
      isDefault: Boolean(addr.isDefault),
      provinceId: addr.provinceId || "",
      districtId: addr.districtId || "",
      wardCode: addr.wardCode || "",
      provinceName: addr.provinceName || addr.city || "",
      districtName: addr.districtName || addr.district || "",
      wardName: addr.wardName || addr.ward || "",
    });
    setShowForm(true);
    ensureProvinces();
  };

  useEffect(() => {
    if (!showForm || !formData.provinceId) return;
    let active = true;
    const preload = async () => {
      try {
        setLoadingLocations(true);
        await ensureProvinces();
        const dist = await getDistricts(formData.provinceId);
        if (!active) return;
        setDistricts(dist);
        if (formData.districtId) {
          const wardsRes = await getWards(formData.districtId);
          if (!active) return;
          setWards(wardsRes);
        }
      } catch (err) {
        console.error("Không tải được danh mục địa lý khi sửa địa chỉ", err);
      } finally {
        if (active) setLoadingLocations(false);
      }
    };
    preload();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm, formData.provinceId, formData.districtId]);

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
          onClick={() => {
            setFormData(emptyForm);
            setShowForm((prev) => !prev);
            ensureProvinces();
          }}
        >
          {showForm ? "Đóng" : "+ Thêm địa chỉ"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="border-b px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">
                {formData._id ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
              </p>
              <p className="text-xs text-gray-500">Nhập chính xác để giao hàng nhanh chóng</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${formData.isDefault ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
              {formData.isDefault ? "Địa chỉ mặc định" : "Địa chỉ phụ"}
            </span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="label"
                placeholder="Tên địa chỉ (Nhà riêng, Công ty...)"
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary"
                value={formData.label}
                onChange={handleChange}
              />
              <input
                name="phone"
                placeholder="Số điện thoại"
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={formData.provinceId}
                onChange={(e) => handleProvinceSelect(e.target.value)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary"
                required
              >
                <option value="">Chọn tỉnh/thành</option>
                {provinces.map((province) => (
                  <option key={province.ProvinceID} value={province.ProvinceID}>
                    {province.ProvinceName}
                  </option>
                ))}
              </select>
              <select
                value={formData.districtId}
                onChange={(e) => handleDistrictSelect(e.target.value)}
                disabled={!formData.provinceId}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary disabled:bg-gray-100 disabled:text-gray-400"
                required
              >
                <option value="">Chọn quận/huyện</option>
                {districts.map((district) => (
                  <option key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
                  </option>
                ))}
              </select>
              <select
                value={formData.wardCode}
                onChange={(e) => handleWardSelect(e.target.value)}
                disabled={!formData.districtId}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary disabled:bg-gray-100 disabled:text-gray-400"
                required
              >
                <option value="">Chọn phường/xã</option>
                {wards.map((ward) => (
                  <option key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </option>
                ))}
              </select>
            </div>
            <input
              name="line1"
              placeholder="Địa chỉ chi tiết"
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary"
              value={formData.line1}
              onChange={handleChange}
              required
            />
            <input
              name="line2"
              placeholder="Ghi chú thêm (không bắt buộc)"
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary"
              value={formData.line2}
              onChange={handleChange}
            />
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                />
                Đặt làm địa chỉ mặc định
              </label>
              <span className="text-xs text-gray-400">Bạn có thể chỉnh sửa sau</span>
            </div>
          </div>
          <div className="px-5 py-4 border-t bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData(emptyForm);
              }}
              className="px-4 py-2 rounded-xl border text-sm text-gray-600 hover:bg-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-[#e5553d] transition disabled:opacity-60"
            >
              {saving ? "Đang lưu..." : "Lưu địa chỉ"}
            </button>
          </div>
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
                <div className="font-medium text-lg flex items-center gap-2 flex-wrap">
                  {addr.label || "Địa chỉ"}{" "}
                  <span className="text-gray-500 text-sm">
                    {addr.phone}
                  </span>
                  {addr.isDefault && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full border border-brand-primary text-brand-primary">
                      Mặc định
                    </span>
                  )}
                </div>
                <div className="text-gray-600 mt-1">
                  {addr.line1}
                  {addr.line2 ? `, ${addr.line2}` : ""},{" "}
                  {addr.wardName || addr.ward}, {addr.districtName || addr.district}, {addr.city || addr.provinceName}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl border text-sm"
                  onClick={() => startEdit(addr)}
                >
                  Sửa
                </button>
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

