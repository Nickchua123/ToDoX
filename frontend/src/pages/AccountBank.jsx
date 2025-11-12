import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default function AccountBank() {
  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800">
        Ngân hàng liên kết
      </h2>
      <p className="text-gray-500 mt-1">
        Quản lý tài khoản ngân hàng để thanh toán.
      </p>

      <div className="mt-8 text-gray-600">
        <p>Hiện tại bạn chưa liên kết tài khoản ngân hàng nào.</p>
        <button
          type="button"
          className="mt-4 px-5 py-2.5 rounded-full bg-[#ff6347] text-white font-medium hover:bg-[#e5553d] transition"
        >
          + Thêm ngân hàng
        </button>
      </div>
    </>
  );
}

