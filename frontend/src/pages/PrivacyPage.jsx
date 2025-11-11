import React from "react";

export default function PrivacyPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Nhá»¯ng thiáº¿t láº­p riÃªng tÆ°</h2>

      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">Yêu cầu xóa tài khoản</div>
            <div className="text-sm text-gray-500">
              Bạn có thể gửi yêu cầu xóa tài khoản. Hành động này sẽ ...
            </div>
          </div>
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            Xóa bỏ
          </button>
        </div>
      </div>
    </div>
  );
}

