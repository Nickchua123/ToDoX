import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import {
  Home,
  Search,
  Library as LibraryIcon,
  UserRound,
  LayoutGrid,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const sections = [
  {
    label: "",
    items: [
      { label: "Trang chủ", to: "/", icon: Home },
      { label: "Tìm kiếm", to: "/search", icon: Search, disabled: true },
    ],
  },
  {
    label: "Dự án",
    items: [{ label: "Quản lý dự án", to: "/projects", icon: LibraryIcon }],
  },
  {
    label: "Tài khoản",
    items: [{ label: "Hồ sơ", to: "/profile", icon: UserRound }],
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("sidebar:collapsed") === "true";
    } catch {
      return false;
    }
  });

  // Theme chỉ áp dụng cho Sidebar
  const [sidebarTheme, setSidebarTheme] = useState(() => {
    try {
      return localStorage.getItem("sidebar:theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("sidebar:theme", sidebarTheme);
    } catch {}
  }, [sidebarTheme]);

  const toggleTheme = useCallback(() => {
    setSidebarTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sidebar:collapsed", String(next));
      } catch {}
      return next;
    });
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    navigate("/login");
  }, [navigate]);

  return (
    <aside
      className={cn(
        "hidden md:flex shrink-0 h-screen sticky top-0 border-r relative",
        collapsed ? "md:w-16" : "md:w-64 lg:w-72 xl:w-80",
        sidebarTheme === "dark"
          ? "border-white/5 bg-[#0b1220] text-white/90"
          : "border-black/10 bg-white text-slate-800"
      )}
    >
      <div className="flex flex-col h-full w-full overflow-y-auto overflow-x-hidden">
        {/* Top actions (brand + theme + collapse) */}
        <div
          className={cn(
            "px-3 py-3",
            collapsed ? "flex flex-col items-center gap-2" : "flex items-center justify-between"
          )}
        >
          {/* Brand icon (expand when collapsed) */}
          <button
            onClick={() => {
              if (collapsed) toggleCollapsed();
            }}
            title={collapsed ? "Mở thanh bên" : "ToDoX"}
            aria-label={collapsed ? "Mở thanh bên" : "ToDoX"}
            className={cn(
              "h-9 w-9 rounded-full grid place-items-center",
              collapsed
                ? sidebarTheme === "dark"
                  ? "hover:bg-white/10 cursor-pointer"
                  : "hover:bg-black/5 cursor-pointer"
                : sidebarTheme === "dark"
                ? "bg-white/10 cursor-default"
                : "bg-black/5 cursor-default"
            )}
          >
            <LayoutGrid size={18} />
          </button>

          {!collapsed && <div className="font-semibold">ToDoX</div>}

          {/* Theme + Collapse controls */}
          <div className={cn("gap-2", collapsed ? "flex flex-col items-center" : "flex items-center")}>
            <button
              onClick={toggleTheme}
              title={sidebarTheme === "dark" ? "Chuyển sáng" : "Chuyển tối"}
              className={cn(
                "h-9 w-9 rounded-full grid place-items-center",
                sidebarTheme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5"
              )}
            >
              {sidebarTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {!collapsed && (
              <button
                onClick={toggleCollapsed}
                title={"Thu gọn"}
                className={cn(
                  "h-9 w-9 rounded-full grid place-items-center",
                  sidebarTheme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5"
                )}
              >
                <ChevronLeft size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 px-3 py-2 space-y-5">
          {sections.map((section) => (
            <div key={section.label || "root"}>
              {section.label && !collapsed && (
                <div
                  className={cn(
                    "px-2 mb-2 text-[11px] uppercase tracking-wider",
                    sidebarTheme === "dark" ? "text-white/50" : "text-slate-500"
                  )}
                >
                  {section.label}
                </div>
              )}
              <ul className={cn("space-y-2", collapsed && "flex flex-col items-center gap-3 space-y-0")}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.to;
                  const content = (
                    <div
                      className={cn(
                        "group relative flex items-center rounded-2xl text-sm",
                        collapsed ? "justify-center p-1.5" : "gap-3 px-3 py-2",
                        sidebarTheme === "dark"
                          ? isActive
                            ? "bg-white/10"
                            : "hover:bg-white/5"
                          : isActive
                            ? "bg-black/5"
                            : "hover:bg-black/5",
                        item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      )}
                    >
                      <span
                        className={cn(
                          collapsed
                            ? "h-9 w-9 rounded-full grid place-items-center"
                            : "grid place-items-center",
                        )}
                      >
                        <Icon
                          size={18}
                          className={cn(
                            "shrink-0",
                            sidebarTheme === "dark" ? "text-white/80" : "text-slate-700"
                          )}
                        />
                      </span>
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {collapsed && (
                        <span
                          className={cn(
                            "pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs opacity-0 transition-opacity",
                            sidebarTheme === "dark"
                              ? "bg-black/80 text-white group-hover:opacity-100"
                              : "bg-slate-800 text-white group-hover:opacity-100"
                          )}
                        >
                          {item.label}
                        </span>
                      )}
                    </div>
                  );
                  return (
                    <li key={item.label}>
                      {item.disabled ? (
                        <div>{content}</div>
                      ) : (
                        <Link to={item.to} title={item.label}>
                          {content}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sign out */}
        <div className={cn("px-3 pb-4 pt-2 mt-auto", collapsed && "flex justify-center")}>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 rounded-2xl text-sm",
              collapsed ? "h-10 w-10 justify-center" : "w-full px-3 py-2",
              sidebarTheme === "dark" ? "hover:bg-white/5" : "hover:bg-black/5"
            )}
          >
            <LogOut
              size={18}
              className={cn(sidebarTheme === "dark" ? "text-white/80" : "text-slate-700")}
            />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
