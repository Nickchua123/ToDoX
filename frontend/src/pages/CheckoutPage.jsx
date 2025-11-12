// src/pages/CheckoutPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  fetchCart,
  clearCart as clearCartApi,
} from "@/services/cartService";
import api from "@/lib/axios";
import { toast } from "sonner";

const currency = (v) =>
  Number(v || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState({ cart: null, subtotal: 0 });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("bank");
  const [coupon, setCoupon] = useState("");
  const [shippingFee] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cartRes, addrRes] = await Promise.all([
        fetchCart(),
        api.get("/addresses"),
      ]);
      setCartData(cartRes);
      setAddresses(addrRes.data || []);
      const defaultAddress =
        addrRes.data?.find((addr) => addr.isDefault) || addrRes.data?.[0];
      setSelectedAddress(defaultAddress?._id || "");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Không thể tải dữ liệu checkout.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const items = cartData.cart?.items || [];

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const productPrice = Number(item.product?.price ?? 0);
        const variantDelta = Number(item.variant?.priceDelta ?? 0);
        return sum + (productPrice + variantDelta) * Number(item.quantity || 0);
      }, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (!items.length) return 0;
    return coupon.trim().toLowerCase() === "sale20"
      ? Math.round(subtotal * 0.2)
      : 0;
  }, [coupon, subtotal, items.length]);

  const total = subtotal - discount + shippingFee;

  const handlePlaceOrder = async () => {
    if (!items.length) {
      toast.error("Giỏ hàng của bạn đang trống.");
      return;
    }
    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }
    try {
      setPlacingOrder(true);
      await api.post("/orders", {
        items: items.map((item) => ({
          productId: item.product?._id || item.product,
          quantity: item.quantity,
          variant: item.variant?._id || item.variant,
        })),
        addressId: selectedAddress,
        notes,
        shippingFee,
        discount,
      });
      await clearCartApi();
      toast.success("Đặt hàng thành công!");
      navigate("/orders");
    } catch (err) {
      const message = err?.response?.data?.message || "Đặt hàng thất bại.";
      toast.error(message);
    } finally {
      setPlacingOrder(false);
    }
  };

  const totalItems = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white rounded-xl p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-[#0b84a5] mb-6">
              ND Style
            </h1>

            {loading ? (
              <div className="text-center py-16 text-gray-500">
                Đang tải thông tin thanh toán...
              </div>
            ) : !items.length ? (
              <div className="text-center py-16">
                <div className="text-xl font-semibold text-gray-700">
                  Chưa có sản phẩm để thanh toán
                </div>
                <p className="text-gray-500 mt-1">
                  Hãy quay lại cửa hàng và thêm sản phẩm vào giỏ.
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
                <h2 className="text-lg font-semibold mb-4">
                  Chọn địa chỉ giao hàng
                </h2>
                {addresses.length ? (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr._id}
                        className="flex items-start gap-3 border rounded-lg p-4 cursor-pointer hover:border-sky-400 transition"
                      >
                        <input
                          type="radio"
                          name="address"
                          className="mt-1"
                          checked={selectedAddress === addr._id}
                          onChange={() => setSelectedAddress(addr._id)}
                        />
                        <div>
                          <div className="font-medium">
                            {addr.label} • {addr.phone}
                          </div>
                          <div className="text-sm text-gray-600">
                            {addr.line1}
                            {addr.line2 ? `, ${addr.line2}` : ""},{" "}
                            {addr.ward}, {addr.district}, {addr.city}
                          </div>
                          {addr.isDefault ? (
                            <span className="text-xs text-sky-600">
                              Mặc định
                            </span>
                          ) : null}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Bạn chưa có địa chỉ nào. Hãy thêm trong phần Tài khoản.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Vận chuyển</h2>
                    <div className="p-4 rounded-md bg-sky-50 text-sky-700">
                      Chúng tôi sẽ liên hệ để xác nhận phí vận chuyển (hiện tại
                      miễn phí).
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

                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">Ghi chú</h2>
                  <textarea
                    className="w-full rounded-md border px-4 py-3"
                    rows={3}
                    placeholder="Ví dụ: giao giờ hành chính..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg">
                  Đơn hàng ({totalItems} sản phẩm)
                </h3>

                <div className="mt-4 space-y-4 max-h-56 overflow-auto pr-2">
                  {items.length ? (
                    items.map((item) => (
                      <div
                        key={item._id || item.id}
                        className="flex items-center gap-3 border rounded-md p-3"
                      >
                        <img
                          src={
                            item.product?.images?.[0] ||
                            item.product?.image ||
                            "/logo.png"
                          }
                          alt={item.product?.name}
                          className="w-14 h-14 rounded-md object-cover bg-gray-100"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {item.product?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.variant?.label
                              ? `Biến thể: ${item.variant.label} • `
                              : ""}
                            SL: {item.quantity}
                          </div>
                        </div>
                        <div className="text-sm w-24 text-right">
                          {currency(
                            (Number(item.product?.price ?? 0) +
                              Number(item.variant?.priceDelta ?? 0)) *
                              Number(item.quantity || 0)
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      Không có sản phẩm nào.
                    </div>
                  )}
                </div>

                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="mt-4 flex gap-3"
                >
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 border rounded-md px-3 py-2"
                    disabled={!items.length}
                  />
                  <button
                    className="px-4 py-2 rounded-md bg-sky-600 text-white hover:brightness-90 disabled:opacity-50"
                    disabled={!items.length}
                  >
                    Áp dụng
                  </button>
                </form>

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
                  <div className="flex justify-between font-semibold text-base pt-2 border-t">
                    <span>Tổng cộng</span>
                    <span>{currency(total)}</span>
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
                      disabled={!items.length || placingOrder}
                    >
                      {placingOrder ? "Đang xử lý..." : "ĐẶT HÀNG"}
                    </button>
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
