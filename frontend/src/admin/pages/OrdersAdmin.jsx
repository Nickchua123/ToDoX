import { useMemo, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Receipt,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

const Status = ({ s }) => {
  const styles = {
    pending: "bg-[#FF6A3D]/10 text-[#FF6A3D]",
    processing: "bg-sky-50 text-sky-700",
    shipped: "bg-indigo-50 text-indigo-700",
    delivered: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-rose-50 text-rose-700",
    refunded: "bg-slate-100 text-slate-700",
  };
  const Icon =
    {
      pending: Clock,
      processing: Receipt,
      shipped: Truck,
      delivered: CheckCircle2,
      cancelled: XCircle,
      refunded: RotateCcw,
    }[s] || Receipt;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${styles[s]}`}
    >
      <Icon className="w-3 h-3" /> {s}
    </span>
  );
};

function mock() {
  const t = Date.now();
  return [
    {
      _id: "ORD-240001",
      user: { name: "Nguyễn An", email: "an@example.com" },
      items: 3,
      total: 1499000,
      status: "pending",
      createdAt: new Date(t - 1 * 864e5),
    },
    {
      _id: "ORD-240002",
      user: { name: "Trần Bình", email: "binh@example.com" },
      items: 1,
      total: 499000,
      status: "processing",
      createdAt: new Date(t - 2 * 864e5),
    },
    {
      _id: "ORD-240003",
      user: { name: "Lê Chi", email: "chi@example.com" },
      items: 2,
      total: 899000,
      status: "shipped",
      createdAt: new Date(t - 5 * 864e5),
    },
    {
      _id: "ORD-240004",
      user: { name: "Phạm Dũng", email: "dung@example.com" },
      items: 5,
      total: 2399000,
      status: "delivered",
      createdAt: new Date(t - 8 * 864e5),
    },
    {
      _id: "ORD-240005",
      user: { name: "Hoàng Em", email: "em@example.com" },
      items: 1,
      total: 199000,
      status: "cancelled",
      createdAt: new Date(t - 12 * 864e5),
    },
  ];
}

export default function OrdersAdmin() {
  const all = useMemo(mock, []);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [range, setRange] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    const end = new Date();
    const start =
      range === "last7"
        ? new Date(end.getTime() - 7 * 864e5)
        : range === "last30"
        ? new Date(end.getTime() - 30 * 864e5)
        : null;
    return all.filter((o) => {
      const okQ =
        q.trim() === "" ||
        [o._id, o.user.name, o.user.email].some((v) =>
          v.toLowerCase().includes(q.toLowerCase())
        );
      const okS = status === "all" || o.status === status;
      const okD = !start || (o.createdAt >= start && o.createdAt <= end);
      return okQ && okS && okD;
    });
  }, [all, q, status, range]);

  const total = filtered.length,
    totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

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
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Tìm ID / tên / email…"
                className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 w-72 focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]/40"
              />
            </div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200"
            >
              <option value="all">Tất cả trạng thái</option>
              {[
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "refunded",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={range}
              onChange={(e) => {
                setRange(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200"
            >
              <option value="all">Mọi thời gian</option>
              <option value="last7">7 ngày gần đây</option>
              <option value="last30">30 ngày gần đây</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,.12)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-6 py-3">Mã đơn</th>
                <th className="px-6 py-3">Khách hàng</th>
                <th className="px-6 py-3">Số SP</th>
                <th className="px-6 py-3">Tổng tiền</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Ngày tạo</th>
                <th className="px-6 py-3 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {current.map((o) => (
                <tr key={o._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-medium">{o._id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span>{o.user.name}</span>
                      <span className="text-xs text-slate-500">
                        {o.user.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{o.items}</td>
                  <td className="px-6 py-4">{o.total.toLocaleString()}₫</td>
                  <td className="px-6 py-4">
                    <Status s={o.status} />
                  </td>
                  <td className="px-6 py-4">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <button className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50">
                        Xem
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {current.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Không có đơn hàng.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Trang {page}/{Math.max(1, Math.ceil(total / 5))} • {total} đơn hàng
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 disabled:opacity-50"
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                setPage((p) =>
                  Math.min(Math.max(1, Math.ceil(total / 5)), p + 1)
                )
              }
              className="px-3 py-1.5 rounded-xl border border-slate-200 disabled:opacity-50"
              disabled={page >= Math.max(1, Math.ceil(total / 5))}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
