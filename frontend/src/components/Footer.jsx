export default function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
        <div>
		  <div className="text-lg font-bold text-brand-dark">DL Shop</div>
          <p className="text-gray-600 mt-3">Công ty ND Theme – Hệ thống cửa hàng thời trang.</p>
        </div>
        <div>
          <div className="font-semibold mb-3">Về chúng tôi</div>
          <ul className="space-y-2 text-gray-600">
            <li>Giới thiệu</li>
            <li>Liên hệ</li>
            <li>Hệ thống cửa hàng</li>
            <li>Sản phẩm</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Dịch vụ khách hàng</div>
          <ul className="space-y-2 text-gray-600">
            <li>Kiểm tra đơn hàng</li>
            <li>Chính sách vận chuyển</li>
            <li>Đổi trả</li>
            <li>Bảo mật</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Kết nối</div>
          <div className="flex gap-2">
            <a className="px-3 py-2 rounded-lg bg-gray-100">Facebook</a>
            <a className="px-3 py-2 rounded-lg bg-gray-100">Instagram</a>
            <a className="px-3 py-2 rounded-lg bg-gray-100">TikTok</a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 py-4 border-t">© ND Theme – Cung cấp bởi Sapo</div>
    </footer>
  );
}

