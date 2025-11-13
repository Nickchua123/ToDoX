import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Clock,
  Receipt,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  X,
  MapPin,
  User,
  PhoneCall,
  Package,
  CreditCard,
  Wallet,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { prepareCsrfHeaders } from "@/lib/csrf";

const PAGE_SIZE = 10;

const statusMeta = {
  pending: { label: "Chờ xác nhận", className: "bg-amber-50 text-amber-700", Icon: Clock },
  processing: { label: "Đang xử lý", className: "bg-sky-50 text-sky-700", Icon: Receipt },
  shipped: { label: "Đang giao", className: "bg-indigo-50 text-indigo-700", Icon: Truck },
  delivered: { label: "Hoàn thành", className: "bg-emerald-50 text-emerald-700", Icon: CheckCircle2 },
  cancelled: { label: "Đã hủy", className: "bg-rose-50 text-rose-700", Icon: XCircle },
  refunded: { label: "Hoàn tiền", className: "bg-slate-100 text-slate-700", Icon: RotateCcw },
};

const StatusBadge = ({ value }) => {
  const meta = statusMeta[value] || statusMeta.pending;
  const Icon = meta.Icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${meta.className}`}>
      <Icon className="w-3 h-3" /> {meta.label || value}
    </span>
  );
};

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [drawerOrderId, setDrawerOrderId] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async ({ page: nextPage = page, nextStatus = status } = {}) => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      params.set("limit", PAGE_SIZE);
      params.set("page", nextPage);
      if (nextStatus !== "all") params.set("status", nextStatus);
      const { data } = await api.get(`/orders?${params.toString()}`);
      setOrders(data?.items || []);
      setTotal(data?.total || 0);
      setPage(data?.page || nextPage);
    } catch (err) {
      const message = err?.response?.data?.message || "Không tải được đơn hàng";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders({ page: 1, nextStatus: status });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  const filteredOrders = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return orders;
    return orders.filter((o) => {
      const fields = [o._id, o.user?.name, o.user?.email];
      return fields.some((field) => String(field || "").toLowerCase().includes(keyword));
    });
  }, [orders, q]);

  const formatCurrency = (value) => {
    if (typeof value !== "number") return "—";
    return value.toLocaleString("vi-VN") + "₫";
  };

  const paymentMeta = {
    cod: { label: "Thanh toán khi nhận", Icon: Wallet },
    vnpay: { label: "VNPay", Icon: CreditCard },
    momo: { label: "MoMo", Icon: Smartphone },
  };

  const getPaymentMeta = (method) => {
    const key = typeof method === "string" ? method.toLowerCase() : "cod";
    return paymentMeta[key] || paymentMeta.cod;
  };

  const renderPaymentInfo = (order) => {
    const meta = getPaymentMeta(order?.paymentMethod);
    const Icon = meta.Icon;
    const statusLabel = order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán";
    const statusColor = order?.isPaid ? "text-emerald-600" : "text-rose-600";
    return (
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center rounded-xl bg-slate-100 p-2">
          <Icon className="w-5 h-5 text-slate-500" />
        </span>
        <div className="flex flex-col">
          <span className="text-sm text-slate-700">{meta.label}</span>
          <span className={`text-xs ${statusColor}`}>{statusLabel}</span>
        </div>
      </div>
    );
  };

  const openDrawer = async (orderId) => {
    setDrawerOrderId(orderId);
    setDetailLoading(true);
    setOrderDetail(null);
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      setOrderDetail(data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không lấy được chi tiết đơn hàng");
      setDrawerOrderId(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDrawer = () => {
    if (updatingStatus) return;
    setDrawerOrderId(null);
    setOrderDetail(null);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!orderDetail?._id || !newStatus || newStatus === orderDetail.status) return;
    try {
      setUpdatingStatus(true);
      const headers = await prepareCsrfHeaders();
      await api.patch(`/orders/${orderDetail._id}/status`, { status: newStatus }, { headers });
      toast.success("Đã cập nhật trạng thái đơn hàng");
      setOrderDetail((prev) => (prev ? { ...prev, status: newStatus } : prev));
      fetchOrders({ page: 1, nextStatus: status });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không cập nhật được trạng thái");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,.12)] px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-lg font-semibold">Đơn hàng</h1>
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm mã đơn, tên hoặc email…"
                className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 w-72 focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]/40"
              />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200"
            >
              <option value="all">Tất cả trạng thái</option>
              {Object.keys(statusMeta).map((s) => (
                <option key={s} value={s}>
                  {statusMeta[s].label}
                </option>
              ))}
            </select>
            <button
              onClick={() => fetchOrders({ page: 1, nextStatus: status })}
              type="button"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw className="w-4 h-4" /> Tải lại
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,.12)]">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-12 text-center text-slate-500">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="px-6 py-12 text-center text-rose-600">{error}</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="px-6 py-3">Mã đơn</th>
                  <th className="px-6 py-3">Khách hàng</th>
                  <th className="px-6 py-3">Số sản phẩm</th>
                  <th className="px-6 py-3">Thanh toán</th>
                  <th className="px-6 py-3">Tổng tiền</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Ngày tạo</th>
                  <th className="px-6 py-3 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-medium">{o._id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{o.user?.name || "(Ẩn danh)"}</span>
                        <span className="text-xs text-slate-500">{o.user?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{o.items?.length || 0}</td>
                    <td className="px-6 py-4">{renderPaymentInfo(o)}</td>
                    <td className="px-6 py-4">{formatCurrency(o.total)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge value={o.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString("vi-VN") : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                          type="button"
                          onClick={() => openDrawer(o._id)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                      Không có đơn hàng.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-sm text-slate-600">
          <span>
            Trang {page}/{totalPages} — Tổng {total} đơn hàng
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => page > 1 && fetchOrders({ page: page - 1, nextStatus: status })}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50"
              type="button"
            >
              Trước
            </button>
            <button
              onClick={() => page < totalPages && fetchOrders({ page: page + 1, nextStatus: status })}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50"
              type="button"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {drawerOrderId && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={closeDrawer} />
          <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <p className="text-sm text-slate-500">Mã đơn</p>
                <p className="text-lg font-semibold text-slate-900">{orderDetail?._id || drawerOrderId}</p>
              </div>
              <button onClick={closeDrawer} className="p-2 rounded-lg hover:bg-slate-100" type="button">
                <X className="w-5 h-5" />
              </button>
            </div>
            {detailLoading ? (
              <div className="px-6 py-12 text-center text-slate-500">Đang tải chi tiết đơn hàng...</div>
            ) : orderDetail ? (
              <div className="px-6 py-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 p-4">
                    <h3 className="text-sm font-semibold text-slate-600 mb-3">Thông tin khách hàng</h3>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{orderDetail.user?.name || "(Ẩn danh)"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-slate-400" />
                        <span>{orderDetail.address?.phone || "—"}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                        <span>
                          {orderDetail.address?.street || ""}
                          {orderDetail.address?.ward ? `, ${orderDetail.address.ward}` : ""}
                          {orderDetail.address?.district ? `, ${orderDetail.address.district}` : ""}
                          {orderDetail.address?.province ? `, ${orderDetail.address.province}` : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-600">Trạng thái</h3>
                        <div className="mt-2">
                          <StatusBadge value={orderDetail.status} />
                        </div>
                      </div>
                      <select
                        value={orderDetail.status}
                        onChange={(e) => handleStatusUpdate(e.target.value)}
                        disabled={updatingStatus}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                      >
                        {Object.keys(statusMeta).map((s) => (
                          <option key={s} value={s}>
                            {statusMeta[s].label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-4 text-sm text-slate-600 space-y-1">
                      <p>Ngày tạo: {orderDetail.createdAt ? new Date(orderDetail.createdAt).toLocaleString("vi-VN") : "—"}</p>
                      {orderDetail.updatedAt && <p>Ngày cập nhật: {new Date(orderDetail.updatedAt).toLocaleString("vi-VN")}</p>}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-4">
                    <h3 className="text-sm font-semibold text-slate-600 mb-3">Thanh toán</h3>
                    <div className="space-y-2 text-sm text-slate-700">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-slate-400" />
                        <span>{getPaymentMeta(orderDetail.paymentMethod).label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        <span className={orderDetail.isPaid ? "text-emerald-600" : "text-rose-600"}>
                          {orderDetail.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                        </span>
                      </div>
                      {orderDetail.paymentRef ? (
                        <div className="text-xs text-slate-500">
                          Mã giao dịch: <span className="font-mono text-slate-700">{orderDetail.paymentRef}</span>
                        </div>
                      ) : null}
                      {orderDetail.paidAt ? (
                        <div className="text-xs text-slate-500">
                          Ngày thanh toán: {new Date(orderDetail.paidAt).toLocaleString("vi-VN")}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 p-4">
                  <h3 className="text-sm font-semibold text-slate-600 mb-3">Sản phẩm</h3>
                  <div className="space-y-3">
                    {orderDetail.items?.map((item, idx) => (
                      <div key={`${item.product}-${idx}`} className="flex gap-3 text-sm text-slate-700">
                        <div className="rounded-xl bg-slate-100 p-2">
                          <Package className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{item.name || item.product?.name}</div>
                          <div className="text-xs text-slate-500">SL: {item.quantity}</div>
                        </div>
                        <div className="text-right font-medium">{formatCurrency(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-700 space-y-1">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span>{formatCurrency(orderDetail.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí vận chuyển</span>
                      <span>{formatCurrency(orderDetail.shippingFee)}</span>
                    </div>
                    {orderDetail.discount ? (
                      <div className="flex justify-between text-emerald-600">
                        <span>Giảm giá</span>
                        <span>-{formatCurrency(orderDetail.discount)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between font-semibold text-slate-900 text-base">
                      <span>Tổng cộng</span>
                      <span>{formatCurrency(orderDetail.total)}</span>
                    </div>
                  </div>
                </div>

                {orderDetail.notes ? (
                  <div className="rounded-2xl border border-slate-100 p-4 bg-slate-50">
                    <h3 className="text-sm font-semibold text-slate-600 mb-2">Ghi chú</h3>
                    <p className="text-sm text-slate-700 whitespace-pre-line">{orderDetail.notes}</p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="px-6 py-12 text-center text-slate-500">Không tìm thấy thông tin đơn hàng</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
