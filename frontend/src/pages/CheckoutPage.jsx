import React, { useState, useMemo } from "react";

/**
 * CheckoutPage.jsx
 * One-file checkout page (React + Tailwind).
 * Usage: import CheckoutPage from './CheckoutPage' and render <CheckoutPage />
 *
 * Note: customize colors, fonts in tailwind config (primary: #ff6347).
 */

const sampleCart = [
  {
    id: 1,
    title: "Túi Xách Nữ Da PU Cao Cấp",
    variant: "Trắng",
    price: 1368000,
    qty: 1,
    img: "https://via.placeholder.com/64x64?text=Img1",
  },
  {
    id: 2,
    title: "Đầm Liền Nữ Dáng A Cổ Sơ Mi",
    variant: "Hồng",
    price: 868000,
    qty: 1,
    img: "https://via.placeholder.com/64x64?text=Img2",
  },
];

const currency = (v) =>
  v.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

export default function CheckoutPage() {
  const [cart, setCart] = useState(sampleCart);
  const [coupon, setCoupon] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState("bank");
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    note: "",
  });

  const subtotal = useMemo(
    () => cart.reduce((s, p) => s + p.price * p.qty, 0),
    [cart]
  );

  const discount = useMemo(() => {
    if (coupon.trim().toLowerCase() === "SALE20") return Math.round(subtotal * 0.2);
    return 0;
  }, [coupon, subtotal]);

  const total = subtotal - discount + shippingFee;

  function updateQty(id, delta) {
    setCart((c) =>
      c.map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p))
    );
  }

  function removeItem(id) {
    setCart((c) => c.filter((p) => p.id !== id));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function applyCoupon(e) {
    e.preventDefault();
    // discount computed in useMemo; you can validate coupon here and show toast
  }

  function placeOrder() {
    // Basic front-end validation
    if (!form.name || !form.phone) {
      alert("Vui lòng nhập tên và số điện thoại.");
      return;
    }
    // Build payload and submit to server (axios/fetch)
    const payload = { customer: form, cart, payment: selectedPayment, totals: { subtotal, discount, shippingFee, total } };
    console.log("Đặt hàng:", payload);
    alert("Đặt hàng thành công (demo). Kiểm tra console để xem payload.");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left main form */}
        <div className="lg:col-span-8 bg-white rounded-xl p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-[#0b84a5] mb-6">ND Style</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping info */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Thông tin nhận hàng</h2>
              <div className="space-y-3">
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full border rounded-md px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6347]/30"
                />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Họ và tên"
                  className="w-full border rounded-md px-4 py-3"
                />
                <div className="flex gap-3">
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Số điện thoại"
                    className="flex-1 border rounded-md px-4 py-3"
                  />
                  <div className="flex items-center px-3 border rounded-md bg-white">
                    <span className="text-sm">🇻🇳</span>
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Địa chỉ (tùy chọn)"
                  className="w-full border rounded-md px-4 py-3"
                />
                <select name="city" value={form.city} onChange={handleChange} className="w-full border rounded-md px-4 py-3 bg-white">
                  <option value="">Tỉnh thành</option>
                  <option>Hà Nội</option>
                  <option>Hồ Chí Minh</option>
                </select>
                <select name="district" value={form.district} onChange={handleChange} className="w-full border rounded-md px-4 py-3 bg-white">
                  <option>Quận/Huyện (tùy chọn)</option>
                </select>
                <select name="ward" value={form.ward} onChange={handleChange} className="w-full border rounded-md px-4 py-3 bg-white">
                  <option>Phường/Xã (tùy chọn)</option>
                </select>
                <textarea name="note" value={form.note} onChange={handleChange} placeholder="Ghi chú (tùy chọn)" className="w-full border rounded-md px-4 py-3 h-24" />
              </div>
            </div>

            {/* Shipping & Payment */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Vận chuyển</h2>
              <div className="mb-6">
                <div className="p-4 rounded-md bg-sky-50 text-sky-700">Vui lòng nhập thông tin giao hàng</div>
              </div>

              <h2 className="text-lg font-semibold mb-4">Thanh toán</h2>
              <div className="border rounded-md divide-y">
                <label className="flex items-center gap-3 p-4">
                  <input type="radio" name="pay" checked={selectedPayment === "bank"} onChange={() => setSelectedPayment("bank")} />
                  <div className="flex-1">
                    <div className="font-medium">Chuyển khoản</div>
                    <div className="text-sm text-gray-500">Thông tin chuyển khoản sẽ được gửi khi đặt hàng</div>
                  </div>
                  <div className="text-slate-300">🏦</div>
                </label>

                <label className="flex items-center gap-3 p-4">
                  <input type="radio" name="pay" checked={selectedPayment === "cod"} onChange={() => setSelectedPayment("cod")} />
                  <div className="flex-1">
                    <div className="font-medium">Thu hộ (COD)</div>
                    <div className="text-sm text-gray-500">Thanh toán khi nhận hàng</div>
                  </div>
                  <div className="text-slate-300">📦</div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right cart sidebar */}
        <aside className="lg:col-span-4">
          <div className="sticky top-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg">Đơn hàng ({cart.length} sản phẩm)</h3>

              <div className="mt-4 space-y-4 max-h-56 overflow-auto pr-2">
                {cart.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 border rounded-md p-3">
                    <img src={p.img} alt="" className="w-14 h-14 rounded-md object-cover" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{p.title}</div>
                      <div className="text-xs text-gray-500">{p.variant}</div>
                    </div>
                    <div className="text-sm w-20 text-right">{currency(p.price)}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={applyCoupon} className="mt-4 flex gap-3">
                <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Nhập mã giảm giá" className="flex-1 border rounded-md px-3 py-2" />
                <button className="px-4 py-2 rounded-md bg-sky-600 text-white">Áp dụng</button>
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
                  <span>{shippingFee === 0 ? "-" : currency(shippingFee)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between items-end">
                  <div>
                    <div className="text-sm text-gray-500">Tổng cộng</div>
                    <div className="text-2xl font-semibold text-[#0b84a5]">{currency(total)}</div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button type="button" onClick={() => alert("Quay về giỏ hàng (demo)")} className="text-sky-600 underline">
                      ‹ Quay về giỏ hàng
                    </button>
                    <button onClick={placeOrder} className="bg-[#0b84a5] hover:brightness-95 text-white px-6 py-3 rounded-md shadow-md">
                      ĐẶT HÀNG
                    </button>
                  </div>
                </div>
              </div>

              {/* quick qty controls (optional) */}
              <div className="mt-4 text-xs text-gray-400">
                * Để thay đổi số lượng, chỉnh ở trang Giỏ hàng hoặc implement ngay ở đây.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
