export default function OrderTabs({
  current = "all",
  onChange = () => {},
  onCancel,
  onRefund,
}) {
  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "pending", label: "Chờ xử lý" },
    { id: "shipping", label: "Đang giao" },
    { id: "completed", label: "Hoàn thành" },
    { id: "cancelled", label: "Đã hủy" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Các tab bên trái */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              current === t.id
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Nút hành động bên phải */}
      <div className="flex gap-2">
        {current === "pending" && (
          <button
            onClick={onCancel}
            className="px-4 py-1.5 rounded-full text-sm bg-red-500 text-white hover:bg-red-600 transition"
          >
            Hủy đơn
          </button>
        )}
        {current === "completed" && (
          <button
            onClick={onRefund}
            className="px-4 py-1.5 rounded-full text-sm bg-yellow-500 text-white hover:bg-yellow-600 transition"
          >
            Hoàn tiền
          </button>
        )}
      </div>
    </div>
  );
}
