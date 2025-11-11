import React from "react";

export default function PaymentPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        Thẻ Tín Dụng/Ghi Nợ & Tài Khoản Ngân Hàng
      </h2>

      <div className="space-y-8">
        <section className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Thẻ Tín Dụng/Ghi Nợ</h3>
            <button className="bg-primary text-white px-4 py-2 rounded">
              + Thêm Thẻ Mới
            </button>
          </div>
          <div className="text-center text-gray-400 py-8">
            Bạn chưa liên kết thẻ.
          </div>
        </section>

        <section className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Tài Khoản Ngân Hàng Của Tôi</h3>
            <button className="bg-primary text-white px-4 py-2 rounded">
              + Thêm Ngân Hàng Liên Kết
            </button>
          </div>
          <div className="text-center text-gray-400 py-8">
            Bạn chưa có tài khoản ngân hàng.
          </div>
        </section>
      </div>
    </div>
  );
}
