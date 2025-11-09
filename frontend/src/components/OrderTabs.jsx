const tabList = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "shipping", label: "Vận chuyển" },
  { value: "delivering", label: "Chờ giao hàng" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "refund", label: "Trả hàng/Hoàn tiền" },
];

export default function OrderTabs({ current, onChange }) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-8 text-sm font-medium text-gray-600">
        {tabList.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`relative pb-3 transition-all hover:text-[#ff6347] ${
              current === tab.value
                ? "text-[#ff6347] font-semibold after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#ff6347] after:rounded-full"
                : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
