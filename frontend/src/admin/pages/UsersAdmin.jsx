import { useMemo, useState } from "react";
import {
  Search,
  ShieldCheck,
  Shield,
  Ban,
  CheckCircle2,
  MoreVertical,
} from "lucide-react";
const asset = (p) => new URL(`../../assets/users/${p}`, import.meta.url).href;

const Pill = ({ className = "", children }) => (
  <span
    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${className}`}
  >
    {children}
  </span>
);
const Role = ({ role }) =>
  role === "admin" ? (
    <Pill className="bg-amber-50 text-amber-700">
      <ShieldCheck className="w-3 h-3" /> Admin
    </Pill>
  ) : (
    <Pill className="bg-sky-50 text-sky-700">
      <Shield className="w-3 h-3" /> User
    </Pill>
  );
const Active = ({ active }) =>
  active ? (
    <Pill className="bg-emerald-50 text-emerald-700">
      <CheckCircle2 className="w-3 h-3" /> Hoạt động
    </Pill>
  ) : (
    <Pill className="bg-rose-50 text-rose-700">
      <Ban className="w-3 h-3" /> Bị khóa
    </Pill>
  );

function mock() {
  return [
    {
      _id: "u1",
      name: "Nguyễn An",
      email: "an@example.com",
      role: "admin",
      active: true,
      avatar: asset("u1.webp"),
      orders: 12,
    },
    {
      _id: "u2",
      name: "Trần Bình",
      email: "binh@example.com",
      role: "user",
      active: true,
      avatar: asset("u2.webp"),
      orders: 3,
    },
    {
      _id: "u3",
      name: "Lê Chi",
      email: "chi@example.com",
      role: "user",
      active: false,
      avatar: asset("u3.webp"),
      orders: 0,
    },
    {
      _id: "u4",
      name: "Phạm Dũng",
      email: "dung@example.com",
      role: "user",
      active: true,
      avatar: asset("u4.webp"),
      orders: 5,
    },
    {
      _id: "u5",
      name: "Hoàng Em",
      email: "em@example.com",
      role: "admin",
      active: true,
      avatar: asset("u5.webp"),
      orders: 19,
    },
  ];
}

export default function UsersAdmin() {
  const all = useMemo(mock, []);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return all.filter((u) => {
      const okQ =
        q.trim() === "" ||
        [u.name, u.email].some((v) =>
          v.toLowerCase().includes(q.toLowerCase())
        );
      const okRole = role === "all" || u.role === role;
      const okStatus =
        status === "all" || (status === "active" ? u.active : !u.active);
      return okQ && okRole && okStatus;
    });
  }, [all, q, role, status]);

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,.12)] px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-lg font-semibold">Người dùng</h1>
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm tên hoặc email…"
                className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 w-64 focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]/40"
              />
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200"
            >
              <option value="all">Mọi trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="blocked">Bị khóa</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,.12)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-6 py-3">Người dùng</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Vai trò</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Đơn hàng</th>
                <th className="px-6 py-3 text-right">Tùy chọn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div className="font-medium">{u.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <Role role={u.role} />
                  </td>
                  <td className="px-6 py-4">
                    <Active active={u.active} />
                  </td>
                  <td className="px-6 py-4">{u.orders}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end">
                      <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Không có người dùng.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
