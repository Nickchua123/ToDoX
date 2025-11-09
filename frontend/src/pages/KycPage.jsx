import React from "react";

export default function KycPage(){
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Thông tin cá nhân (KYC)</h2>

      <div className="bg-white p-6 rounded shadow max-w-2xl">
        <p className="text-gray-600 mb-6">Bạn vui lòng nhập chính xác thông tin CCCD để đơn hàng được thông quan theo quy định. Thông tin sẽ được bảo mật.</p>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="w-36 text-gray-600">Họ và tên</label>
            <input className="flex-1 border rounded px-3 py-2" placeholder="Họ và tên đầy đủ trên CCCD" />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-36 text-gray-600">Số CCCD</label>
            <input className="flex-1 border rounded px-3 py-2" placeholder="Số định danh cá nhân trên CCCD" />
          </div>

          <div className="flex items-start gap-4">
            <label className="w-36 text-gray-600">Địa chỉ</label>
            <textarea className="flex-1 border rounded px-3 py-2" rows="3" placeholder="Địa chỉ Nơi thường trú trên CCCD"></textarea>
          </div>

          <div className="text-right">
            <button className="bg-primary text-white px-4 py-2 rounded opacity-90">Xác Nhận</button>
          </div>
        </div>
      </div>
    </div>
  );
}
