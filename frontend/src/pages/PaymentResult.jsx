import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import api from "@/lib/axios";

const statusText = (success) => (success ? "Thanh toán thành công" : "Thanh toán thất bại");

export default function PaymentResult() {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, success: false, message: "" });

  useEffect(() => {
    const fetchResult = async () => {
      if (!location.search) {
        setState({ loading: false, success: false, message: "Thiếu thông tin giao dịch" });
        return;
      }
      try {
        const { data } = await api.get(`/payments/vnpay/verify${location.search}`);
        setState({
          loading: false,
          success: Boolean(data?.success),
          message: data?.message || statusText(Boolean(data?.success)),
          details: data,
        });
      } catch (err) {
        setState({
          loading: false,
          success: false,
          message: err?.response?.data?.message || "Không xác thực được giao dịch",
        });
      }
    };
    fetchResult();
  }, [location.search]);

  const { loading, success, message, details } = state;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          {loading ? (
            <>
              <p className="text-lg text-gray-600">Đang xác thực giao dịch của bạn...</p>
            </>
          ) : (
            <>
              <div className={`text-2xl font-semibold ${success ? "text-emerald-600" : "text-rose-600"}`}>
                {statusText(success)}
              </div>
              <p className="mt-3 text-gray-600">{message}</p>
              {details?.orderId ? (
                <div className="mt-6 text-left text-sm text-gray-600 space-y-2 bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between">
                    <span>Mã đơn hàng:</span>
                    <span className="font-medium text-gray-900">{details.orderId}</span>
                  </div>
                  {typeof details.amount === "number" && (
                    <div className="flex justify-between">
                      <span>Số tiền:</span>
                      <span className="font-medium text-gray-900">
                        {details.amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      </span>
                    </div>
                  )}
                  {details.responseCode && (
                    <div className="flex justify-between">
                      <span>Mã phản hồi:</span>
                      <span className="font-medium text-gray-900">{details.responseCode}</span>
                    </div>
                  )}
                </div>
              ) : null}
              <div className="mt-8 flex flex-col md:flex-row gap-3 justify-center">
                <Link
                  to="/orders"
                  className="px-4 py-2.5 rounded-xl bg-[#0b84a5] text-white font-semibold hover:brightness-95"
                >
                  Xem đơn hàng
                </Link>
                <Link
                  to="/"
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Về trang chủ
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
