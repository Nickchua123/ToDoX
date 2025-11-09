import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <Tabs value={current} onValueChange={onChange}>
      <TabsList className="flex justify-between bg-white shadow-sm border rounded-lg w-full">
        {tabList.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex-1 py-3 text-sm font-medium hover:text-[#ff6347] data-[state=active]:text-[#ff6347] data-[state=active]:border-b-2 data-[state=active]:border-[#ff6347]"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
