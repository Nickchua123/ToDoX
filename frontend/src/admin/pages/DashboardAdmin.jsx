import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  ShoppingBag,
  Users,
  Package,
  Wallet2,
  Clock,
  Activity,
  AlertTriangle,
} from "lucide-react";

const statusLabels = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Hoàn thành",
  cancelled: "Đã hủy",
  refunded: "Hoàn tiền",
};

const formatCurrency = (value) =>
  typeof value === "number" ? value.toLocaleString("vi-VN") + "₫" : "—";

const Sparkline = ({ data = [], color = "#2563eb" }) => {
  if (!data.length) {
    return <div className="text-sm text-slate-400">Chưa có dữ liệu</div>;
  }
  const max = Math.max(...data, 1);
  const points = data
    .map((value, idx) => {
      const x = data.length === 1 ? 100 : (idx / (data.length - 1)) * 100;
      const y = 100 - (value / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" className="w-full h-24">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
};

export default function DashboardAdmin() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/admin/summary");
        setSummary(data);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Không tải được dữ liệu tổng quan");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const cards = useMemo(() => {
    if (!summary) return [];
    return [
      {
        title: "Tổng doanh thu",
        value: formatCurrency(summary.totals?.revenue),
        icon: Wallet2,
      },
      {
        title: "Đơn hàng",
        value: summary.totals?.orders?.toLocaleString("vi-VN") || "0",
        icon: ShoppingBag,
      },
      {
        title: "Khách hàng",
        value: summary.totals?.users?.toLocaleString("vi-VN") || "0",
        icon: Users,
      },
      {
        title: "Sản phẩm",
        value: summary.totals?.products?.toLocaleString("vi-VN") || "0",
        icon: Package,
      },
    ];
  }, [summary]);

  const trendLabels = summary?.trends?.labels || [];
  const trendRevenue = summary?.trends?.revenue || [];
  const trendOrders = summary?.trends?.orders || [];
  const tasks = summary?.tasks || {};
  const taskItems = [
    {
      label: "Đơn chờ xử lý",
      value: tasks.pendingOrders || 0,
      desc: "Cần duyệt hoặc chuẩn bị hàng",
      icon: ShoppingBag,
    },
    {
      label: "Đánh giá chờ duyệt",
      value: tasks.pendingReviews || 0,
      desc: "Khách hàng đang chờ phản hồi",
      icon: Activity,
    },
    {
      label: "Sản phẩm sắp hết",
      value: tasks.lowStockProducts || 0,
      desc: "Tồn kho <= 10",
      icon: AlertTriangle,
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Tổng quan</h1>
        <p className="text-sm text-slate-500">Theo dõi nhanh tình hình kinh doanh</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-100 bg-white p-4 animate-pulse h-28"
              />
            ))
          : cards.map((card) => {
              const { title, value, icon } = card;
              const Icon = icon;
              return (
                <div key={title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{title}</p>
                      <p className="text-2xl font-semibold text-slate-900 mt-2">{value}</p>
                    </div>
                    <div className="rounded-full bg-slate-100 p-3">
                      <Icon className="w-5 h-5 text-slate-500" />
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Doanh thu 7 ngày</h2>
              <p className="text-sm text-slate-500">{trendLabels[0]} – {trendLabels[trendLabels.length - 1]}</p>
            </div>
          </div>
          {loading ? (
            <div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
          ) : (
            <div>
              <Sparkline data={trendRevenue} color="#FF6A3D" />
              <div className="mt-6">
                <p className="text-sm font-medium text-slate-700 mb-2">Đơn hàng</p>
                <Sparkline data={trendOrders} color="#0EA5E9" />
              </div>
              <div className="mt-3 flex justify-between text-sm text-slate-500">
                {trendLabels.map((label) => (
                  <span key={label}>{label.slice(5)}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Việc cần làm</h2>
          </div>
          <div className="space-y-3">
            {taskItems.map(({ label, value, desc, icon }) => {
              const IconComponent = icon;
              return (
              <div key={label} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-slate-100 p-2">
                    <IconComponent className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </div>
                <span className="text-lg font-semibold text-slate-900">{value}</span>
              </div>
              );
            })}
         </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Trạng thái đơn hàng</h2>
          </div>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-10 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(summary?.statusCounts || {})
                .sort((a, b) => (b[1] || 0) - (a[1] || 0))
                .map(([key, count]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">{statusLabels[key] || key}</p>
                    </div>
                    <span className="text-sm text-slate-600">{count}</span>
                  </div>
                ))}
              {(!summary?.statusCounts || Object.keys(summary.statusCounts).length === 0) && (
                <p className="text-sm text-slate-500">Chưa có dữ liệu.</p>
              )}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Đơn hàng gần đây</h2>
          </div>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : summary?.recentOrders?.length ? (
            <div className="space-y-3">
              {summary.recentOrders.map((order) => (
                <div key={order._id} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">#{order._id}</p>
                      <p className="text-xs text-slate-500">
                        {order.user?.name || "Khách"} • {order.user?.email || "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{formatCurrency(order.total)}</p>
                      <p className="text-xs text-slate-500 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    {statusLabels[order.status] || order.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Không có đơn hàng nào.</p>
          )}
        </div>
      </div>
    </section>
  );
}
