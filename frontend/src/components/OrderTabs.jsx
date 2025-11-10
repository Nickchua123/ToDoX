const tabList = [
  { value: "all", label: "Táº¥t cáº£" },
  { value: "pending", label: "Chá» xÃ¡c nháº­n" },
  { value: "shipping", label: "Váº­n chuyá»ƒn" },
  { value: "delivering", label: "Chá» giao hÃ ng" },
  { value: "completed", label: "HoÃ n thÃ nh" },
  { value: "cancelled", label: "ÄÃ£ há»§y" },
  { value: "refund", label: "Tráº£ hÃ ng/HoÃ n tiá»n" },
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

