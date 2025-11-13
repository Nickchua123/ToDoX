import { useCallback, useEffect, useMemo, useState } from "react";
import { BellRing, Package, Megaphone, Info, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notificationService";

const PAGE_SIZE = 10;

const typeMeta = {
  order: {
    icon: Package,
    badge: "bg-orange-100 text-orange-700",
  },
  promotion: {
    icon: Megaphone,
    badge: "bg-pink-100 text-pink-700",
  },
  system: {
    icon: Info,
    badge: "bg-slate-100 text-slate-600",
  },
};

const STATUS_LABELS = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
  refunded: "Hoàn tiền",
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

const formatDate = (value) => {
  if (!value) return "";
  try {
    return dateFormatter.format(new Date(value));
  } catch {
    return value;
  }
};

const NotificationItem = ({ notification, onMarkRead }) => {
  const meta = typeMeta[notification.type] || typeMeta.system;
  const Icon = meta.icon;
  const isUnread = !notification.isRead;
  const orderId = notification.data?.orderId;
  const status = notification.data?.status;

  return (
    <li className={`flex gap-4 px-5 py-4 ${isUnread ? "bg-orange-50/60" : ""}`}>
      <div className="mt-1">
        <div className={`rounded-2xl p-3 ${meta.badge}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-medium text-slate-900">{notification.title}</p>
            {notification.message && <p className="text-sm text-slate-600">{notification.message}</p>}
          </div>
          {isUnread && (
            <button
              type="button"
              onClick={() => onMarkRead(notification._id)}
              className="text-sm font-medium text-brand-primary hover:underline"
            >
              Đánh dấu đã đọc
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span>{formatDate(notification.createdAt)}</span>
          {orderId ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-slate-600">
              <Package className="w-3 h-3" />
              Đơn #{String(orderId).slice(-6)}
            </span>
          ) : null}
          {status ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-slate-600">
              {STATUS_LABELS[status] || status}
            </span>
          ) : null}
        </div>
        {orderId ? (
          <Link to="/orders" className="mt-3 inline-flex text-sm font-medium text-brand-primary hover:underline">
            Xem đơn hàng
          </Link>
        ) : null}
      </div>
    </li>
  );
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  const loadNotifications = useCallback(
    async ({ page: nextPage = page, unreadOnly: nextUnread = unreadOnly } = {}) => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchNotifications({
          page: nextPage,
          limit: PAGE_SIZE,
          unreadOnly: nextUnread,
        });
        setNotifications(data?.items || []);
        setTotal(data?.total || 0);
        setPage(data?.page || nextPage);
        setUnreadCount(data?.unreadCount || 0);
      } catch (err) {
        const message = err?.response?.data?.message || "Không tải được thông báo";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [page, unreadOnly]
  );

  useEffect(() => {
    loadNotifications({ page, unreadOnly });
  }, [loadNotifications, page, unreadOnly]);

  const handleMarkRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      await loadNotifications({ page, unreadOnly });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không cập nhật được thông báo");
    }
  };

  const handleMarkAll = async () => {
    try {
      if (unreadCount === 0) return;
      await markAllNotificationsRead();
      await loadNotifications({ page: 1, unreadOnly });
      toast.success("Đã đánh dấu tất cả là đã đọc");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không cập nhật được thông báo");
    }
  };

  const noData = !loading && notifications.length === 0;

  return (
    <section className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Thông báo</h1>
          <p className="text-sm text-slate-500">Theo dõi cập nhật đơn hàng và ưu đãi mới nhất.</p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAll}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            Đánh dấu tất cả ({unreadCount})
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            setUnreadOnly(false);
            setPage(1);
          }}
          className={`rounded-2xl px-4 py-2 text-sm font-medium border ${
            !unreadOnly ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 text-slate-600"
          }`}
        >
          Tất cả
        </button>
        <button
          type="button"
          onClick={() => {
            setUnreadOnly(true);
            setPage(1);
          }}
          className={`rounded-2xl px-4 py-2 text-sm font-medium border ${
            unreadOnly ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 text-slate-600"
          }`}
        >
          Chưa đọc ({unreadCount})
        </button>
      </div>

      <div className="rounded-3xl bg-white shadow-[0_20px_50px_-25px_rgba(15,23,42,0.3)]">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Đang tải thông báo...</div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-rose-500">{error}</div>
        ) : noData ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center text-slate-500">
            <BellRing className="w-10 h-10 text-slate-400" />
            <p>Hiện chưa có thông báo nào.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {notifications.map((notification) => (
              <NotificationItem key={notification._id} notification={notification} onMarkRead={handleMarkRead} />
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Trang {page}/{totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => page > 1 && setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
              className="rounded-xl border border-slate-200 px-4 py-2 disabled:opacity-50"
            >
              Trước
            </button>
            <button
              type="button"
              onClick={() => page < totalPages && setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
              className="rounded-xl border border-slate-200 px-4 py-2 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
