import React, { useState, useMemo } from "react";

export default function CheckoutPage() {
  // -------------------------------
  // GIẢ LẬP DỮ LIỆU & TRẠNG THÁI
  // -------------------------------
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Phạm Xuân",
      phone: "0912345678",
      address: "Số 12, Xuân Thủy, Cầu Giấy, Hà Nội",
      isDefault: true,
    },
    {
      id: 2,
      name: "Nguyễn Minh",
      phone: "0987654321",
      address: "35 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
      isDefault: false,
    },
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [selectedPayment, setSelectedPayment] = useState("bank");
  const [coupon, setCoupon] = useState("");
  const [shippingFee, setShippingFee] = useState(0);

  const cart = [
    {
      id: 1,
      title: "Túi Xách Nữ Da PU Cao Cấp",
      variant: "Trắng",
      price: 1368000,
      img: "https://via.placeholder.com/60",
    },
    {
      id: 2,
      title: "Đầm Liền Nữ Dáng A Cổ Sơ Mi Dài Tay Xếp Ly",
      variant: "Hồng",
      price: 868000,
      img: "https://via.placeholder.com/60",
    },
  ];

  const currency = (v) =>
    v.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

  const subtotal = useMemo(() => cart.reduce((sum, p) => sum + p.price, 0), [cart]);
  const discount = useMemo(() => {
    if (coupon.trim().toLowerCase() === "sale20") return Math.round(subtotal * 0.2);
    return 0;
  }, [coupon, subtotal]);
  const total = subtotal - discount + shippingFee;

  // -------------------------------
  // XỬ LÝ FORM ĐỊA CHỈ
  // -------------------------------
  const handleAddNewAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address) {
      alert("Vui lòng nhập đầy đủ thông tin địa chỉ mới!");
      return;
    }
    const id = addresses.length + 1;
    const added = { id, ...newAddress };
    setAddresses([...addresses, added]);
    setSelectedAddressId(id);
    setShowNewAddressForm(false);
    setNewAddress({ name: "", phone: "", address: "" });
  };

  const handlePlaceOrder = () => {
    let selectedAddress = addresses.find((a) => a.id === selectedAddressId);
    console.log("Đơn hàng:", {
      selectedAddress,
      payment: selectedPayment,
      coupon,
      total,
    });
    alert("Đặt hàng thành công (demo)!");
  };

  // -------------------------------
  // JSX BẮT ĐẦU
  // -------------------------------
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FORM BÊN TRÁI */}
        <div className="lg:col-span-8 bg-white rounded-xl p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-[#0b84a5] mb-6">ND Style</h1>

          {/* Thông tin nhận hàng */}
          <h2 className="text-lg font-semibold mb-4">Thông tin nhận hàng</h2>

          {isLoggedIn ? (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`block border rounded-lg p-4 cursor-pointer transition ${
                    selectedAddressId === addr.id
                      ? "border-[#ff6347] bg-[#ff6347]/5"
                      : "border-gray-200 hover:border-[#ff6347]/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mr-3 accent-[#ff6347]"
                  />
                  <div className="inline-block align-top">
                    <div className="font-medium">{addr.name}</div>
                    <div className="text-sm text-gray-600">{addr.phone}</div>
                    <div className="text-sm text-gray-600">{addr.address}</div>
                  </div>
                </label>
              ))}

              {/* Nút thêm địa chỉ mới */}
              {!showNewAddressForm && (
                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#ff6347] hover:text-[#ff6347] transition"
                >
                  + Thêm địa chỉ mới
                </button>
              )}

              {/* Form thêm địa chỉ mới */}
              {showNewAddressForm && (
                <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                  <input
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    placeholder="Họ và tên"
                    className="w-full border rounded-md px-4 py-2"
                  />
                  <input
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    placeholder="Số điện thoại"
                    className="w-full border rounded-md px-4 py-2"
                  />
                  <input
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    placeholder="Địa chỉ"
                    className="w-full border rounded-md px-4 py-2"
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowNewAddressForm(false)}
                      className="px-3 py-2 text-gray-500 hover:text-gray-700"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleAddNewAddress}
                      className="px-4 py-2 bg-[#ff6347] text-white rounded-md hover:brightness-95"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <input placeholder="Email" className="w-full border rounded-md px-4 py-3" />
              <input placeholder="Họ và tên" className="w-full border rounded-md px-4 py-3" />
              <input placeholder="Số điện thoại" className="w-full border rounded-md px-4 py-3" />
              <input placeholder="Địa chỉ" className="w-full border rounded-md px-4 py-3" />
            </div>
          )}

          {/* Vận chuyển & Thanh toán */}
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
                    <div className="text-sm text-gray-500">Thanh toán khi nhận hàng</div>
                  </div>
                  <div className="text-xl">📦</div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* GIỎ HÀNG BÊN PHẢI */}
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

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="mt-4 flex gap-3"
              >
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Nhập mã giảm giá"
                  className="flex-1 border rounded-md px-3 py-2"
                />
                <button className="px-4 py-2 rounded-md bg-sky-600 text-white hover:brightness-90">
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
                  <span>{shippingFee === 0 ? "-" : currency(shippingFee)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between items-end">
                  <div>
                    <div className="text-sm text-gray-500">Tổng cộng</div>
                    <div className="text-2xl font-semibold text-[#0b84a5]">
                      {currency(total)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 items-end">
                    <button
                      type="button"
                      onClick={() => alert("Quay về giỏ hàng (demo)")}
                      className="text-sky-600 underline"
                    >
                      ‹ Quay về giỏ hàng
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="bg-[#0b84a5] hover:brightness-95 text-white px-6 py-3 rounded-md shadow-md"
                    >
                      ĐẶT HÀNG
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  * Để thay đổi số lượng, chỉnh ở trang Giỏ hàng hoặc implement ngay ở đây.
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
