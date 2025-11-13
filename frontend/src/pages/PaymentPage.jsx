import React from "react";

export default function PaymentPage() {
  const supportedMethods = [
    { label: "Thanh toán khi nhận hàng (COD)", desc: "Phí thu hộ được miễn hoàn toàn." },
    { label: "VNPAY (QR/Thẻ)", desc: "Hỗ trợ quét QR, thẻ nội địa và quốc tế qua cổng VNPAY." },
    { label: "Chuyển khoản ngân hàng", desc: "Thông tin chi tiết sẽ được hiển thị khi đơn hàng được xác nhận." },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Phương thức thanh toán</h2>
        <p className="text-gray-500">Quản lý thẻ, tài khoản ngân hàng và các hình thức thanh toán đã liên kết.</p>
      </div>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b px-6 py-4">
          <div>
            <h3 className="font-medium text-lg">Phương thức đã liên kết</h3>
            <p className="text-sm text-gray-500">Bạn chưa thêm phương thức thanh toán nào.</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-brand-primary text-white text-sm font-medium hover:bg-[#e5553d] transition">
            + Thêm phương thức
          </button>
        </div>
        <div className="px-6 py-10 text-center text-gray-400">Chưa có dữ liệu. Thêm phương thức để thanh toán nhanh hơn.</div>
        <div className="border-t px-6 py-4 bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-700">Các hình thức được hỗ trợ</h4>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {supportedMethods.map((method) => (
              <div key={method.label} className="rounded-xl border border-dashed border-gray-200 p-4 text-left">
                <p className="font-medium text-gray-900">{method.label}</p>
                <p className="text-sm text-gray-500 mt-1">{method.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
