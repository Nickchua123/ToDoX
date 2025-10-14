import React from "react";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center">
      <h1 className="text-2xl font-semibold mb-4">Truy cập bị từ chối</h1>
      <p>Bạn cần đăng nhập để xem nội dung này.</p>
      <a
        href="/login"
        className="inline-block px-6 py-3 mt-6 font-medium text-white transition shadow-md bg-primary rounded-2xl hover:bg-primary-dark"
      >
        Đăng nhập ngay
      </a>
    </div>
  );
};

export default Unauthorized;

