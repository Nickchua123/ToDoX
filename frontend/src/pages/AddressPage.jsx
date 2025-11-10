import React from "react";

const DemoAddress = {
  name: "Vũ Thị Tuyết",
  phone: "(+84) 379 976 689",
  detail: "Cầu Cống Thóc - xóm 1, Xã Thụy Trình, Huyện Thái Thụy, Thái Bình",
};

export default function AddressPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Địa chỉ của tôi</h2>

      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">
              {DemoAddress.name}{" "}
              <span className="text-gray-400 text-sm">{DemoAddress.phone}</span>
            </div>
            <div className="text-gray-600 mt-2">{DemoAddress.detail}</div>
            <div className="mt-3">
              <span className="inline-block px-2 py-1 text-sm border rounded text-primary border-primary">
                Mặc định
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button className="text-sm text-primary">Cập nhật</button>
            <button className="text-sm text-red-500">Xóa</button>
            <button className="bg-gray-100 px-3 py-2 rounded text-sm">
              Thiết lập mặc định
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button className="bg-primary text-white px-4 py-2 rounded">
          + Thêm địa chỉ mới
        </button>
      </div>
    </div>
  );
}
