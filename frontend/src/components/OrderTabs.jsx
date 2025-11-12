export default function OrderTabs({ current = "all", onChange = () => {} }) {
  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "pending", label: "Chờ xử lý" },
    { id: "shipping", label: "Đang giao" },
    { id: "completed", label: "Hoàn thành" },
    { id: "cancelled", label: "Đã hủy" },
  ];
  return (
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
  );
}

