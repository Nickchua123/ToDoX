import { useEffect, useRef, useState } from "react";
import { Heart, Search, ShoppingCart, User, ChevronDown, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { toast } from "sonner";
import { fetchNotifications, NOTIFICATIONS_EVENT } from "@/services/notificationService";

export default function Header() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMega, setOpenMega] = useState(null);
  const [megaData, setMegaData] = useState({
    female: [],
    male: [],
  });
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMega(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await api.get("/categories?limit=200");
        const tree = buildMegaMenu(data || []);
        setMegaData(tree);
      } catch (err) {
        console.error(err);
        toast.error("Không tải được danh mục từ hệ thống.");
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    let active = true;
    let intervalId;

    const loadUnread = async () => {
      if (!user) {
        if (active) setUnreadNotifications(0);
        return;
      }
      try {
        const data = await fetchNotifications({ page: 1, limit: 1 });
        if (active) setUnreadNotifications(data?.unreadCount || 0);
      } catch (err) {
        console.warn("Không tải được số thông báo chưa đọc", err);
        if (active) setUnreadNotifications(0);
      }
    };

    const handleSync = () => {
      loadUnread();
    };

    loadUnread();
    window.addEventListener(NOTIFICATIONS_EVENT, handleSync);
    if (user) {
      intervalId = setInterval(loadUnread, 60000);
    }

    return () => {
      active = false;
      window.removeEventListener(NOTIFICATIONS_EVENT, handleSync);
      if (intervalId) clearInterval(intervalId);
    };
  }, [user?._id]);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="bg-brand-primary text-white text-center py-1 text-xs">
        CHÀO ĐÓN BỘ SƯU TẬP THU ĐÔNG 2024
      </div>

      <div className="max-w-6xl mx-auto px-4 relative" ref={navRef}>
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-brand-dark hover:text-brand-primary transition">
            ND Style
          </Link>

          {/* Menu */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-brand-primary">Trang chủ</Link>
            <MegaMenuTrigger
              label="Nữ"
              menuKey="female"
              isOpen={openMega === "female"}
              onOpen={setOpenMega}
            />
            <MegaMenuTrigger
              label="Nam"
              menuKey="male"
              isOpen={openMega === "male"}
              onOpen={setOpenMega}
            />
            <Link to="/news" className="hover:text-brand-primary">Tin tức</Link>
            <Link to="/contact" className="hover:text-brand-primary">Liên hệ</Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-2">
            {/* Ô tìm kiếm */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100">
              <Search className="w-4 h-4 text-gray-500" />
              <input className="bg-transparent text-sm outline-none w-48" placeholder="Tìm kiếm..." />
            </div>

            {/* Yêu thích */}
            <Link to="/favorites" className="p-2 rounded-xl hover:bg-gray-100 inline-flex items-center justify-center" title="Yêu thích">
              <Heart className="w-5 h-5" />
            </Link>

            {/* Thông báo */}
            <Link
              to="/account/notifications"
              className="p-2 rounded-xl hover:bg-gray-100 relative inline-flex items-center justify-center"
              title="Thông báo"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 rounded-full bg-indigo-600 text-white text-[10px] px-1.5 py-0.5">
                  {unreadNotifications > 9 ? "9+" : unreadNotifications}
                </span>
              )}
            </Link>

            {/* Giỏ hàng */}
            <Link to="/cart" className="p-2 rounded-xl hover:bg-gray-100 relative inline-flex items-center justify-center" title="Giỏ hàng">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-brand-primary text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Tài khoản */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name || "Tài khoản"}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-gray-100 bg-white shadow-lg p-2 text-sm">
                    <Link
                      to="/account/profile"
                      className="block px-3 py-2 rounded-xl hover:bg-gray-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      Tài khoản của tôi
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-3 py-2 rounded-xl hover:bg-gray-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      Đơn mua
                    </Link>
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 rounded-xl text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-xl bg-brand-primary text-xs font-medium text-white hover:bg-[#e5553d] transition"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
        {openMega && (
          <MegaMenuPanel
            groups={megaData[openMega] || []}
            onClose={() => setOpenMega(null)}
          />
        )}
      </div>
    </header>
  );
}

const MegaMenuTrigger = ({ label, menuKey, isOpen, onOpen }) => (
  <button
    type="button"
    className={`flex items-center gap-1 hover:text-brand-primary transition ${isOpen ? "text-brand-primary" : ""}`}
    onMouseEnter={() => onOpen(menuKey)}
    onFocus={() => onOpen(menuKey)}
    onClick={() => onOpen(isOpen ? null : menuKey)}
  >
    {label}
    <ChevronDown className="w-4 h-4" />
  </button>
);

const MegaMenuPanel = ({ groups, onClose }) => {
  if (!groups || groups.length === 0) return null;
  return (
    <div
      onMouseLeave={onClose}
      className="absolute left-1/2 top-full z-40 -translate-x-1/2 mt-3 w-[720px] rounded-3xl border border-gray-100 bg-white shadow-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6"
    >
      {groups.map((group) => {
        const parentSlug = group.slug || group.id;
        return (
          <div key={group.id || group.slug || group.title}>
            {parentSlug ? (
              <Link
                to={`/category?slug=${parentSlug}`}
                className="font-semibold mb-2 text-gray-900 inline-flex items-center gap-1 hover:text-brand-primary transition"
                onClick={onClose}
              >
                {group.title}
                <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
              </Link>
            ) : (
              <h3 className="font-semibold mb-2 text-gray-900">{group.title}</h3>
            )}
            <ul className="space-y-1 text-sm text-gray-600">
              {group.items.map((item) => {
                const childSlug = item.slug || item.id;
                return (
                  <li key={`${group.title}-${childSlug || item.name}`}>
                    {childSlug ? (
                      <Link
                        to={`/category?slug=${childSlug}`}
                        className="hover:text-brand-primary"
                        onClick={onClose}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <span className="text-gray-600">{item.name}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

const buildMegaMenu = (categories) => {
  const children = new Map();
  const toKey = (value) => {
    if (!value) return null;
    return typeof value === "string" ? value : value.toString();
  };

  categories.forEach((cat) => {
    const parentKey = toKey(cat.parent);
    if (!parentKey) return;
    const list = children.get(parentKey) || [];
    list.push(cat);
    children.set(parentKey, list);
  });

  const mapRoot = (rootName) => {
    const root = categories.find((cat) => cat.name === rootName);
    const rootKey = toKey(root?._id);
    if (!rootKey) return [];
    const secondLevel = children.get(rootKey) || [];
    return secondLevel.map((group) => {
      const groupKey = toKey(group._id);
      return {
        title: group.name,
        slug: group.slug,
        id: groupKey,
        items: (children.get(groupKey) || []).map((item) => ({
          name: item.name,
          slug: item.slug,
          id: toKey(item._id),
        })),
      };
    });
  };

  return {
    female: mapRoot("Nữ"),
    male: mapRoot("Nam"),
  };
};
