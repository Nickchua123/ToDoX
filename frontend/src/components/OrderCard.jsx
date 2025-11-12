import { Button } from "@/components/ui/button";

const statusLabels = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Hoàn thành",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn tiền",
};

const statusStyles = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-amber-50 text-amber-700 border-amber-200",
  shipped: "bg-blue-50 text-blue-600 border-blue-200",
  delivered: "bg-green-50 text-green-600 border-green-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  refunded: "bg-purple-50 text-purple-600 border-purple-200",
};

export default function OrderCard({
  order = {},
  onCancel = () => {},
  onRequestCancel = () => {},
  onConfirmDelivery = () => {},
  onReview = () => {},
  onRepurchase = () => {},
  busyOrderId = null,
}) {
  const {
    _id = "#0000",
    status = "pending",
    items = [],
    total,
    cancellationRequested,
  } = order;
  const firstItem = items[0] || {};
  const product = firstItem.product || {};
  const image = product.images?.[0] || firstItem.image || "/logo.png";
  const quantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const statusLabel = statusLabels[status] || status;
  const statusClass = statusStyles[status] || "bg-gray-50 text-gray-700 border-gray-200";

  const isBusy = busyOrderId === _id;

  const actionArea = (() => {
    if (status === "pending") {
      return (
        <Button
          variant="destructive"
          size="sm"
          className="bg-red-500 hover:bg-red-600 disabled:bg-red-400"
          onClick={() => onCancel(order)}
          disabled={isBusy}
        >
          Hủy đơn
        </Button>
      );
    }
    if (status === "processing") {
      if (cancellationRequested) {
        return <span className="text-sm text-amber-600">Đã gửi yêu cầu hủy</span>;
      }
      return (
        <Button
          variant="default"
          size="sm"
          className="bg-amber-500 hover:bg-amber-600 text-white disabled:bg-amber-400"
          onClick={() => onRequestCancel(order)}
          disabled={isBusy}
        >
          Yêu cầu hủy
        </Button>
      );
    }
    if (status === "shipped") {
      return (
        <Button
          variant="secondary"
          size="sm"
          className="bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-emerald-400"
          onClick={() => onConfirmDelivery(order)}
          disabled={isBusy}
        >
          Đã nhận hàng
        </Button>
      );
    }
    if (status === "delivered") {
      return (
        <Button
          size="sm"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-sm disabled:bg-yellow-400"
          onClick={() => onReview(order)}
          disabled={isBusy}
        >
          Đánh giá sản phẩm
        </Button>
      );
    }
    if (status === "cancelled" || status === "refunded") {
      return (
        <Button
          variant="outline"
          size="sm"
          className="text-brand-primary border-brand-primary hover:bg-brand-primary/10"
          onClick={() => onRepurchase(order)}
          disabled={isBusy}
        >
          Mua lại
        </Button>
      );
    }
    return null;
  })();

  return (
    <div className="border rounded-xl p-4 mb-3 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <img src={image} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
        <div>
          <div className="font-semibold text-brand-dark">{product.name || "Sản phẩm"}</div>
          <div className="text-sm text-gray-500">Mã đơn: {_id}</div>
          <div className="text-sm text-gray-500">Số lượng: {quantity}</div>
        </div>
      </div>
      <div className="text-right space-y-2">
        <div className="flex items-center justify-end gap-2">
          <span className={`inline-block px-2 py-0.5 text-xs rounded-full border ${statusClass}`}>
            {statusLabel}
          </span>
          {cancellationRequested && status === "processing" && (
            <span className="text-xs text-amber-600 font-medium">Chờ duyệt hủy</span>
          )}
        </div>
        <div className="font-semibold text-brand-primary">
          {typeof total === "number" ? total.toLocaleString("vi-VN") + "₫" : "—"}
        </div>
        {actionArea && <div className="pt-1">{actionArea}</div>}
      </div>
    </div>
  );
}

