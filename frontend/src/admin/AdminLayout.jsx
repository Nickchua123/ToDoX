import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Tags,
  ShoppingCart,
  LogOut,
  CircleUser,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Newspaper,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const menus = [
  { to: "/admin", icon: LayoutDashboard, label: "Tổng quan" },
  { to: "/admin/products", icon: Package, label: "Sản phẩm" },
  { to: "/admin/users", icon: Users, label: "Người dùng" },
  { to: "/admin/categories", icon: Tags, label: "Danh mục" },
  { to: "/admin/orders", icon: ShoppingCart, label: "Đơn hàng" },
  { to: "/admin/reviews", icon: Tags, label: "Đánh giá" },
  { to: "/admin/banners", icon: Megaphone, label: "Banner" },
  { to: "/admin/news", icon: Newspaper, label: "Tin tức" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const linkCls = ({ isActive }) =>
    `flex items-center rounded-xl px-3 py-2 transition ${collapsed ? "justify-center gap-0" : "gap-3"}
     ${
       isActive
         ? "bg-white/15 text-white font-medium"
         : "hover:bg-white/10 text-white/90"
     }`;

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    }
  };

  const displayName = user?.name || user?.username || "Quản trị viên";
  const displayEmail = user?.email || "admin@example.com";
  const avatar = user?.avatar;

  const sidebarWidth = collapsed ? "basis-[80px] max-w-[80px] min-w-[80px]" : "basis-1/6 max-w-[280px] min-w-[240px]";

  return (
    <div className="min-h-screen w-full bg-white text-[#0f172a] flex">
      {/* SIDEBAR */}
      <aside className={`hidden md:flex flex-col ${sidebarWidth} bg-[#FF6A3D] text-white transition-all duration-300`}>
        <div className="px-4 py-4 flex items-center justify-between">
          {collapsed ? (
            <div className="text-lg font-bold tracking-wide">ND</div>
          ) : (
            <div className="text-xl font-semibold tracking-wide truncate">ND Admin</div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-1">
          {menus.map(({ to, icon, label }) => {
            const IconComponent = icon;
            return (
              <NavLink key={to} to={to} className={linkCls}>
                <IconComponent className="w-4 h-4" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User + Logout ở đáy */}
        <div className="border-t border-white/20 px-3 py-4">
          <div className="flex items-center gap-3">
            {avatar ? (
              <img
                src={avatar}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover border border-white/30"
              />
            ) : (
              <div className="w-9 h-9 grid place-content-center rounded-full bg-white/20">
                <CircleUser className="w-5 h-5 text-white" />
              </div>
            )}

            {!collapsed && (
              <div className="min-w-0 leading-tight">
                <div className="text-sm font-medium truncate">
                  {displayName}
                </div>
                <div className="text-[11px] text-white/80 truncate">
                  {displayEmail}
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="ml-auto p-2 rounded-lg hover:bg-white/15 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN: chiếm phần còn lại */}
      <main className="flex-1 basis-5/6">
        <div className="p-6 md:p-8 space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
