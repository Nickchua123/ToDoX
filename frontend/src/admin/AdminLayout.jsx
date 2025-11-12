import { NavLink, Outlet } from "react-router-dom";
import {
  Package,
  Users,
  Tags,
  ShoppingCart,
  LogOut,
  CircleUser,
} from "lucide-react";

const menus = [
  { to: "/admin/products", icon: Package, label: "Sản phẩm" },
  { to: "/admin/users", icon: Users, label: "Người dùng" },
  { to: "/admin/categories", icon: Tags, label: "Danh mục" },
  { to: "/admin/orders", icon: ShoppingCart, label: "Đơn hàng" },
];

// TODO: thay bằng dữ liệu thật từ auth context
const currentUser = {
  name: "Lưu Văn",
  email: "luu@example.com",
  avatar: null, // hoặc URL ảnh
};

export default function AdminLayout({ onLogout }) {
  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2 transition
     ${
       isActive
         ? "bg-white/15 text-white font-medium"
         : "hover:bg-white/10 text-white/90"
     }`;

  const handleLogout = () => {
    if (onLogout) onLogout();
    else console.log("Đăng xuất… (gắn hàm onLogout thực tế vào AdminLayout)");
  };

  return (
    <div className="min-h-screen w-full bg-white text-[#0f172a] flex">
      {/* SIDEBAR: ~1/6 chiều ngang, màu chủ đạo */}
      <aside className="hidden md:flex flex-col basis-1/6 max-w-[280px] min-w-[240px] bg-[#FF6A3D] text-white">
        {/* Logo / tên */}
        <div className="px-5 py-6 text-xl font-semibold tracking-wide">
          ND Admin
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-1">
          {menus.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={linkCls}>
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User + Logout ở đáy */}
        <div className="border-t border-white/20 px-4 py-4">
          <div className="flex items-center gap-3">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover border border-white/30"
              />
            ) : (
              <div className="w-9 h-9 grid place-content-center rounded-full bg-white/20">
                <CircleUser className="w-5 h-5 text-white" />
              </div>
            )}

            <div className="min-w-0 leading-tight">
              <div className="text-sm font-medium truncate">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-white/80 truncate">
                {currentUser.email}
              </div>
            </div>

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
