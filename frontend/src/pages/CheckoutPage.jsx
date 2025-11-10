// src/pages/CheckoutPage.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ----- Helpers -----
const toNumber = (x) =>
  typeof x === "number"
    ? x
    : Number(String(x ?? "").replace(/[^\d]/g, "")) || 0;

const currency = (v) =>
  Number(v || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const buyNow = state?.buyNow; // { id, title, variant, price, img, qty }

  // ✅ Chỉ nhận từ "Mua ngay". Không có -> giỏ rỗng
  const cart = buyNow
    ? [
        {
          id: buyNow.id,
          title: buyNow.title,
          variant: buyNow.variant || "",
          price: toNumber(buyNow.price),
          img: buyNow.img,
          qty: buyNow.qty || 1,
        },
      ]
    : [];

  // ----- UI state -----
  const [selectedPayment, setSelectedPayment] = useState("bank");
  const [coupon, setCoupon] = useState("");
  const [shippingFee] = useState(0);

  // ----- Money -----
  const subtotal = useMemo(
    () => cart.reduce((sum, p) => sum + toNumber(p.price) * (p.qty || 1), 0),
    [cart]
  );
  const discount = useMemo(() => {
    if (!cart.length) return 0;
    return coupon.trim().toLowerCase() === "sale20"
      ? Math.round(subtotal * 0.2)
      : 0;
  }, [coupon, subtotal, cart.length]);
  const total = subtotal - discount + shippingFee;

  // ----- Actions -----
  const handlePlaceOrder = () => {
    if (!cart.length) return;
    alert("Đặt hàng thành công (demo)!");
    navigate("/orders"); // hoặc "/" tùy bạn
  };

  // ========== RENDER ==========
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: thông tin + thanh toán */}
          <div className="lg:col-span-8 bg-white rounded-xl p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-[#0b84a5] mb-6">
              ND Style
            </h1>

            {/* Nếu giỏ rỗng (không đi từ Mua ngay) */}
            {!cart.length ? (
              <div className="text-center py-16">
                <div className="text-xl font-semibold text-gray-700">
                  Chưa có sản phẩm để thanh toán
                </div>
                <p className="text-gray-500 mt-1">
                  Hãy chọn sản phẩm và bấm “Mua ngay”.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 rounded-md border"
                    type="button"
                  >
                    ← Quay lại
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 rounded-md bg-[#0b84a5] text-white hover:brightness-95"
                    type="button"
                  >
                    Về trang chủ
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Thông tin nhận hàng (rút gọn – tự điền sau) */}
                <h2 className="text-lg font-semibold mb-4">
                  Thông tin nhận hàng
                </h2>
                <div className="space-y-3">
                  <input
                    placeholder="Họ và tên"
                    className="w-full border rounded-md px-4 py-3"
                  />
                  <input
                    placeholder="Số điện thoại"
                    className="w-full border rounded-md px-4 py-3"
                  />
                  <input
                    placeholder="Địa chỉ"
                    className="w-full border rounded-md px-4 py-3"
                  />
                </div>

                {/* Vận chuyển & thanh toán */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Vận chuyển</h2>
                    <div className="p-4 rounded-md bg-sky-50 text-sky-700">
                      Vui lòng nhập thông tin giao hàng
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-4">Thanh toán</h2>
                    <div className="border rounded-md divide-y">
                      <label className="flex items-center gap-3 p-4">
                        <input
                          type="radio"
                          name="pay"
                          checked={selectedPayment === "bank"}
                          onChange={() => setSelectedPayment("bank")}
                        />
                        <div className="flex-1">
                          <div className="font-medium">Chuyển khoản</div>
                          <div className="text-sm text-gray-500">
                            Thông tin chuyển khoản sẽ được gửi khi đặt hàng
                          </div>
                        </div>
                        <div className="text-xl">🏦</div>
                      </label>

                      <label className="flex items-center gap-3 p-4">
                        <input
                          type="radio"
                          name="pay"
                          checked={selectedPayment === "cod"}
                          onChange={() => setSelectedPayment("cod")}
                        />
                        <div className="flex-1">
                          <div className="font-medium">Thu hộ (COD)</div>
                          <div className="text-sm text-gray-500">
                            Thanh toán khi nhận hàng
                          </div>
                        </div>
                        <div className="text-xl">📦</div>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT: tóm tắt đơn hàng */}
          <aside className="lg:col-span-4">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg">
                  Đơn hàng ({cart.reduce((n, p) => n + (p.qty || 1), 0)} sản
                  phẩm)
                </h3>

                {/* Danh sách sản phẩm */}
                <div className="mt-4 space-y-4 max-h-56 overflow-auto pr-2">
                  {cart.length ? (
                    cart.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 border rounded-md p-3"
                      >
                        <img
                          src={p.img}
                          alt=""
                          className="w-14 h-14 rounded-md object-cover bg-gray-100"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{p.title}</div>
                          <div className="text-xs text-gray-500">
                            {p.variant} {p.qty ? `• SL: ${p.qty}` : null}
                          </div>
                        </div>
                        <div className="text-sm w-24 text-right">
                          {currency(toNumber(p.price) * (p.qty || 1))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      Không có sản phẩm nào.
                    </div>
                  )}
                </div>

                {/* Mã giảm giá */}
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="mt-4 flex gap-3"
                >
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 border rounded-md px-3 py-2"
                    disabled={!cart.length}
                  />
                  <button
                    className="px-4 py-2 rounded-md bg-sky-600 text-white hover:brightness-90 disabled:opacity-50"
                    disabled={!cart.length}
                  >
                    Áp dụng
                  </button>
                </form>

                {/* Tổng kết */}
                <div className="mt-5 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span>{currency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giảm giá</span>
                    <span className="text-red-600">-{currency(discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span>
                      {shippingFee === 0 ? "-" : currency(shippingFee)}
                    </span>
                  </div>

                  <div className="border-top pt-3 mt-2 border-t flex justify-between items-end">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="text-sky-600 underline"
                    >
                      ‹ Quay lại
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="bg-[#0b84a5] hover:brightness-95 text-white px-6 py-3 rounded-md shadow-md disabled:opacity-50"
                      disabled={!cart.length}
                    >
                      ĐẶT HÀNG
                    </button>
                  </div>

                  <div className="mt-4 text-xs text-gray-400">
                    * Trang này chỉ hiện sản phẩm khi bạn bấm “Mua ngay”.
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
