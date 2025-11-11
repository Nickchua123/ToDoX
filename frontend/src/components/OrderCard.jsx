export default function OrderCard({ order = {} }) {
  const { _id = "#0000", status = "pending", items = [], total } = order;
  return (
    <div className="border rounded-xl p-4 mb-3 flex items-start justify-between">
      <div>
        <div className="text-sm text-gray-500">Mã đơn</div>
        <div className="font-semibold text-brand-dark">{_id}</div>
        <div className="mt-1 text-sm text-gray-600">Số sản phẩm: {items.length}</div>
      </div>
      <div className="text-right">
        <span
          className={`inline-block px-2 py-0.5 text-xs rounded-full border ${
            status === "completed"
              ? "bg-green-50 text-green-600 border-green-200"
              : status === "shipping"
              ? "bg-blue-50 text-blue-600 border-blue-200"
              : status === "cancelled"
              ? "bg-gray-100 text-gray-600 border-gray-200"
              : "bg-yellow-50 text-yellow-700 border-yellow-200"
          }`}
        >
          {status}
        </span>
        <div className="mt-2 font-semibold text-brand-primary">
          {total ?? "—"}
        </div>
      </div>
    </div>
  );
}
