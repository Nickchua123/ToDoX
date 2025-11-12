import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
import { prepareCsrfHeaders } from "@/lib/csrf";
import { toast } from "sonner";

const toggleClass =
  "flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 bg-white";

export default function PrivacyPage() {
  const { user, refreshAuth } = useAuth();
  const [requestingDelete, setRequestingDelete] = useState(false);
  const [updatingKey, setUpdatingKey] = useState(null);

  const toggleOptions = [
    {
      key: "emailMarketing",
      title: "Nhận email khuyến mãi",
      desc: "Cho phép ND Style gửi thông tin ưu đãi tới hộp thư của bạn.",
    },
    {
      key: "smsMarketing",
      title: "Nhận SMS khuyến mãi",
      desc: "Nhận thông báo flash sale, voucher qua tin nhắn.",
    },
    {
      key: "shareDataWithPartners",
      title: "Chia sẻ dữ liệu với đối tác",
      desc: "Cho phép chia sẻ hạn chế dữ liệu mua sắm với đơn vị vận chuyển.",
    },
  ];

  const handleToggle = async (key) => {
    if (!user) return;
    const nextValue = !user[key];
    setUpdatingKey(key);
    try {
      const headers = await prepareCsrfHeaders();
      await api.patch(
        "/users/me",
        { [key]: nextValue },
        { headers }
      );
      toast.success("Đã cập nhật thiết lập");
      await refreshAuth();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không lưu được thiết lập");
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleDeleteRequest = async () => {
    if (!window.confirm("Yêu cầu xóa tài khoản sẽ được xử lý trong 7 ngày. Bạn có chắc?")) return;
    setRequestingDelete(true);
    try {
      const headers = await prepareCsrfHeaders();
      await api.post("/users/delete-request", null, { headers });
      toast.success("Đã ghi nhận yêu cầu xóa tài khoản");
      await refreshAuth();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không gửi được yêu cầu");
    } finally {
      setRequestingDelete(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Thiết lập riêng tư</h2>
        <p className="text-gray-500 mt-1">
          Kiểm soát cách chúng tôi liên lạc và xử lý dữ liệu cá nhân.
        </p>
      </div>

      <section className="space-y-3">
        {toggleOptions.map((item) => (
          <div key={item.key} className={toggleClass}>
            <div>
              <div className="font-medium text-gray-800">{item.title}</div>
              <div className="text-sm text-gray-500">{item.desc}</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={Boolean(user?.[item.key])}
                onChange={() => handleToggle(item.key)}
                disabled={updatingKey === item.key}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-brand-primary transition" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5" />
            </label>
          </div>
        ))}
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="font-semibold text-red-600">Xóa tài khoản</div>
          <p className="text-sm text-gray-500">
            Sau khi xác nhận, tài khoản sẽ được xóa vĩnh viễn sau 7 ngày (trong thời gian đó bạn có thể liên hệ để hủy yêu cầu).
          </p>
          {user?.deleteRequestedAt && (
            <p className="text-xs text-gray-500 mt-1">
              Đã gửi yêu cầu vào: {new Date(user.deleteRequestedAt).toLocaleString()}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleDeleteRequest}
          disabled={requestingDelete}
          className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-60"
        >
          {requestingDelete ? "Đang gửi..." : "Yêu cầu xóa"}
        </button>
      </section>
    </div>
  );
}
