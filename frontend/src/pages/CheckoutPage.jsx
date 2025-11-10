=== RENDER ==========
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: thÃ´ng tin + thanh toÃ¡n */}
          <div className="lg:col-span-8 bg-white rounded-xl p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-[#0b84a5] mb-6">
              ND Style
            </h1>

            {/* Náº¿u giá» rá»—ng (khÃ´ng Ä‘i tá»« Mua ngay) */}
            {!cart.length ? (
              <div className="text-center py-16">
                <div className="text-xl font-semibold text-gray-700">
                  ChÆ°a cÃ³ sáº£n pháº©m Ä‘á»ƒ thanh toÃ¡n
                </div>
                <p className="text-gray-500 mt-1">
                  HÃ£y chá»n sáº£n pháº©m vÃ  báº¥m â€œMua ngayâ€.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 rounded-md border"
                    type="button"
                  >
                    â† Quay láº¡i
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 rounded-md bg-[#0b84a5] text-white hover:brightness-95"
                    type="button"
                  >
                    Vá» trang chá»§
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* ThÃ´ng tin nháº­n hÃ ng (rÃºt gá»n â€“ tá»± Ä‘iá»n sau) */}
                <h2 className="text-lg font-semibold mb-4">
                  ThÃ´ng tin nháº­n hÃ ng
                </h2>
                <div className="space-y-3">
                  <input
                    placeholder="Há» vÃ  tÃªn"
                    className="w-full border rounded-md px-4 py-3"
                  />
                  <input
                    placeholder="Sá»‘ Ä‘iá»‡n thoáº¡i"
                    className="w-full border rounded-md px-4 py-3"
                  />
                  <input
                    placeholder="Äá»‹a chá»‰"
                    className="w-full border rounded-md px-4 py-3"
                  />
                </div>

                {/* Váº­n chuyá»ƒn & thanh toÃ¡n */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Váº­n chuyá»ƒn</h2>
                    <div className="p-4 rounded-md bg-sky-50 text-sky-700">
                      Vui lÃ²ng nháº­p thÃ´ng tin giao hÃ ng
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-4">Thanh toÃ¡n</h2>
                    <div className="border rounded-md divide-y">
                      <label className="flex items-center gap-3 p-4">
                        <input
                          type="radio"
                          name="pay"
                          checked={selectedPayment === "bank"}
                          onChange={() => setSelectedPayment("bank")}
                        />
                        <div className="flex-1">
                          <div className="font-medium">Chuyá»ƒn khoáº£n</div>
                          <div className="text-sm text-gray-500">
                            ThÃ´ng tin chuyá»ƒn khoáº£n sáº½ Ä‘Æ°á»£c gá»­i khi Ä‘áº·t hÃ ng
                          </div>
                        </div>
                        <div className="text-xl">ðŸ¦</div>
                      </label>

                      <label className="flex items-center gap-3 p-4">
                        <input
                          type="radio"
                          name="pay"
                          checked={selectedPayment === "cod"}
                          onChange={() => setSelectedPayment("cod")}
                        />
                        <div className="flex-1">
                          <div className="font-medium">Thu há»™ (COD)</div>
                          <div className="text-sm text-gray-500">
                            Thanh toÃ¡n khi nháº­n hÃ ng
                          </div>
                        </div>
                        <div className="text-xl">ðŸ“¦</div>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT: tÃ³m táº¯t Ä‘Æ¡n hÃ ng */}
          <aside className="lg:col-span-4">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg">
                  ÄÆ¡n hÃ ng ({cart.reduce((n, p) => n + (p.qty || 1), 0)} sáº£n
                  pháº©m)
                </h3>

                {/* Danh sÃ¡ch sáº£n pháº©m */}
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
                            {p.variant} {p.qty ? `â€¢ SL: ${p.qty}` : null}
                          </div>
                        </div>
                        <div className="text-sm w-24 text-right">
                          {currency(toNumber(p.price) * (p.qty || 1))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      KhÃ´ng cÃ³ sáº£n pháº©m nÃ o.
                    </div>
                  )}
                </div>

                {/* MÃ£ giáº£m giÃ¡ */}
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="mt-4 flex gap-3"
                >
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Nháº­p mÃ£ giáº£m giÃ¡"
                    className="flex-1 border rounded-md px-3 py-2"
                    disabled={!cart.length}
                  />
                  <button
                    className="px-4 py-2 rounded-md bg-sky-600 text-white hover:brightness-90 disabled:opacity-50"
                    disabled={!cart.length}
                  >
                    Ãp dá»¥ng
                  </button>
                </form>

                {/* Tá»•ng káº¿t */}
                <div className="mt-5 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Táº¡m tÃ­nh</span>
                    <span>{currency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giáº£m giÃ¡</span>
                    <span className="text-red-600">-{currency(discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PhÃ­ váº­n chuyá»ƒn</span>
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
                      â€¹ Quay láº¡i
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="bg-[#0b84a5] hover:brightness-95 text-white px-6 py-3 rounded-md shadow-md disabled:opacity-50"
                      disabled={!cart.length}
=======
import React, { useState, useMemo } from "react";

export default function CheckoutPage() {
  // -------------------------------
  // GIáº¢ Láº¬P Dá»® LIá»†U & TRáº NG THÃI
  // -------------------------------
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Pháº¡m XuÃ¢n",
      phone: "0912345678",
      address: "Sá»‘ 12, XuÃ¢n Thá»§y, Cáº§u Giáº¥y, HÃ  Ná»™i",
      isDefault: true,
    },
    {
      id: 2,
      name: "Nguyá»…n Minh",
      phone: "0987654321",
      address: "35 LÃ½ ThÆ°á»ng Kiá»‡t, HoÃ n Kiáº¿m, HÃ  Ná»™i",
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
      title: "TÃºi XÃ¡ch Ná»¯ Da PU Cao Cáº¥p",
      variant: "Tráº¯ng",
      price: 1368000,
      img: "https://via.placeholder.com/60",
    },
    {
      id: 2,
      title: "Äáº§m Liá»n Ná»¯ DÃ¡ng A Cá»• SÆ¡ Mi DÃ i Tay Xáº¿p Ly",
      variant: "Há»“ng",
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
  // Xá»¬ LÃ FORM Äá»ŠA CHá»ˆ
  // -------------------------------
  const handleAddNewAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address) {
      alert("Vui lÃ²ng nháº­p Ä‘áº§y Ä‘á»§ thÃ´ng tin Ä‘á»‹a chá»‰ má»›i!");
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
    console.log("ÄÆ¡n hÃ ng:", {
      selectedAddress,
      payment: selectedPayment,
      coupon,
      total,
    });
    alert("Äáº·t hÃ ng thÃ nh cÃ´ng (demo)!");
  };

  // -------------------------------
  // JSX Báº®T Äáº¦U
  // -------------------------------
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FORM BÃŠN TRÃI */}
        <div className="lg:col-span-8 bg-white rounded-xl p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-[#0b84a5] mb-6">ND Style</h1>

          {/* ThÃ´ng tin nháº­n hÃ ng */}
          <h2 className="text-lg font-semibold mb-4">ThÃ´ng tin nháº­n hÃ ng</h2>

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

              {/* NÃºt thÃªm Ä‘á»‹a chá»‰ má»›i */}
              {!showNewAddressForm && (
                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#ff6347] hover:text-[#ff6347] transition"
                >
                  + ThÃªm Ä‘á»‹a chá»‰ má»›i
                </button>
              )}

              {/* Form thÃªm Ä‘á»‹a chá»‰ má»›i */}
              {showNewAddressForm && (
                <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                  <input
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    placeholder="Há» vÃ  tÃªn"
                    className="w-full border rounded-md px-4 py-2"
                  />
                  <input
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    placeholder="Sá»‘ Ä‘iá»‡n thoáº¡i"
                    className="w-full border rounded-md px-4 py-2"
                  />
                  <input
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    placeholder="Äá»‹a chá»‰"
                    className="w-full border rounded-md px-4 py-2"
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowNewAddressForm(false)}
                      className="px-3 py-2 text-gray-500 hover:text-gray-700"
                    >
                      Há»§y
                    </button>
                    <button
                      onClick={handleAddNewAddress}
                      className="px-4 py-2 bg-[#ff6347] text-white rounded-md hover:brightness-95"
                    >
                      LÆ°u
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <input placeholder="Email" className="w-full border rounded-md px-4 py-3" />
              <input placeholder="Há» vÃ  tÃªn" className="w-full border rounded-md px-4 py-3" />
              <input placeholder="Sá»‘ Ä‘iá»‡n thoáº¡i" className="w-full border rounded-md px-4 py-3" />
              <input placeholder="Äá»‹a chá»‰" className="w-full border rounded-md px-4 py-3" />
            </div>
          )}

          {/* Váº­n chuyá»ƒn & Thanh toÃ¡n */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Váº­n chuyá»ƒn</h2>
              <div className="p-4 rounded-md bg-sky-50 text-sky-700">
                Vui lÃ²ng nháº­p thÃ´ng tin giao hÃ ng
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Thanh toÃ¡n</h2>
              <div className="border rounded-md divide-y">
                <label className="flex items-center gap-3 p-4">
                  <input
                    type="radio"
                    name="pay"
                    checked={selectedPayment === "bank"}
                    onChange={() => setSelectedPayment("bank")}
                  />
                  <div className="flex-1">
                    <div className="font-medium">Chuyá»ƒn khoáº£n</div>
                    <div className="text-sm text-gray-500">
                      ThÃ´ng tin chuyá»ƒn khoáº£n sáº½ Ä‘Æ°á»£c gá»­i khi Ä‘áº·t hÃ ng
                    </div>
                  </div>
                  <div className="text-xl">ðŸ¦</div>
                </label>

                <label className="flex items-center gap-3 p-4">
                  <input
                    type="radio"
                    name="pay"
                    checked={selectedPayment === "cod"}
                    onChange={() => setSelectedPayment("cod")}
                  />
                  <div className="flex-1">
                    <div className="font-medium">Thu há»™ (COD)</div>
                    <div className="text-sm text-gray-500">Thanh toÃ¡n khi nháº­n hÃ ng</div>
                  </div>
                  <div className="text-xl">ðŸ“¦</div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* GIá»Ž HÃ€NG BÃŠN PHáº¢I */}
        <aside className="lg:col-span-4">
          <div className="sticky top-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg">ÄÆ¡n hÃ ng ({cart.length} sáº£n pháº©m)</h3>

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
                  placeholder="Nháº­p mÃ£ giáº£m giÃ¡"
                  className="flex-1 border rounded-md px-3 py-2"
                />
                <button className="px-4 py-2 rounded-md bg-sky-600 text-white hover:brightness-90">
                  Ãp dá»¥ng
                </button>
              </form>

              <div className="mt-5 text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Táº¡m tÃ­nh</span>
                  <span>{currency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Giáº£m giÃ¡</span>
                  <span className="text-red-600">-{currency(discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>PhÃ­ váº­n chuyá»ƒn</span>
                  <span>{shippingFee === 0 ? "-" : currency(shippingFee)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between items-end">
                  <div>
                    <div className="text-sm text-gray-500">Tá»•ng cá»™ng</div>
                    <div className="text-2xl font-semibold text-[#0b84a5]">
                      {currency(total)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 items-end">
                    <button
                      type="button"
                      onClick={() => alert("Quay vá» giá» hÃ ng (demo)")}
                      className="text-sky-600 underline"
                    >
                      â€¹ Quay vá» giá» hÃ ng
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="bg-[#0b84a5] hover:brightness-95 text-white px-6 py-3 rounded-md shadow-md"
                    >
                      Äáº¶T HÃ€NG
                    </button>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  * Äá»ƒ thay Ä‘á»•i sá»‘ lÆ°á»£ng, chá»‰nh á»Ÿ trang Giá» hÃ ng hoáº·c implement ngay á»Ÿ Ä‘Ã¢y.
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

