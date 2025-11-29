import { useEffect, useState } from "react";
import { RefreshCcw, Copy } from "lucide-react";
import { toast } from "sonner";
import { getAvailableCoupons } from "@/services/userCouponService";

const formatDate = (value) => {
  if (!value) return "Không đặt";
  try {
    return new Date(value).toLocaleString("vi-VN");
  } catch {
    return "Không đặt";
  }
};

export default function AccountVouchers() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAvailableCoupons();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không tải được ưu đãi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Đã sao chép mã ${code}`);
    } catch {
      toast.error("Không sao chép được");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Kho voucher</h2>
          <p className="text-gray-500 mt-1">Lưu trữ mã giảm giá và ưu đãi của bạn.</p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm"
          disabled={loading}
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Tải lại
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <span className="font-semibold text-gray-800">Mã khả dụng</span>
          <span className="text-xs text-gray-500">{coupons.length} mã</span>
        </div>
        {loading ? (
          <div className="p-4 text-sm text-gray-500">Đang tải...</div>
        ) : coupons.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">Chưa có mã nào khả dụng.</div>
        ) : (
          <div className="divide-y">
            {coupons.map((cp) => (
              <div
                key={cp._id || cp.code}
                className="p-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-base font-semibold text-gray-900">
                    {cp.code}
                    <span className="text-xs text-gray-500">-{cp.discountPercent}%</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Lượt dùng: {cp.used || 0}/{cp.maxUses || "∞"} • Hết hạn: {formatDate(cp.expiresAt)}
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm text-sky-700 hover:bg-sky-50"
                  onClick={() => copyCode(cp.code)}
                >
                  <Copy className="w-4 h-4" />
                  Sao chép
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

