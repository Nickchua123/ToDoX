import { useEffect, useRef, useState } from "react";
import { Heart, Search, ShoppingCart, User, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function Header() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMega, setOpenMega] = useState(null);
  const [megaData, setMegaData] = useState({
    female: getStaticMenu("female"),
    male: getStaticMenu("male"),
  });
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
        toast.error("Không tải được danh mục, dùng dữ liệu mặc định.");
      }
    };
    loadCategories();
  }, []);

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
            <Link to="/orders" className="hover:text-brand-primary">Đơn mua</Link>
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
      {groups.map((group) => (
        <div key={group.title}>
          <h3 className="font-semibold mb-2 text-gray-900">{group.title}</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            {group.items.map((item) => (
              <li key={`${group.title}-${item.slug || item.name}`}>
                <Link
                  to={item.slug ? `/category?slug=${item.slug}` : "#"}
                  className="hover:text-brand-primary"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const buildMegaMenu = (categories) => {
  const children = new Map();
  categories.forEach((cat) => {
    if (!cat.parent) return;
    const list = children.get(cat.parent) || [];
    list.push(cat);
    children.set(cat.parent, list);
  });

  const mapRoot = (rootName) => {
    const root = categories.find((cat) => cat.name === rootName);
    if (!root) return [];
    const secondLevel = children.get(root._id) || [];
    return secondLevel.map((group) => ({
      title: group.name,
      items: (children.get(group._id) || []).map((item) => ({
        name: item.name,
        slug: item.slug,
      })),
    }));
  };

  return {
    female: mapRoot("Nữ"),
    male: mapRoot("Nam"),
  };
};

const getStaticMenu = (type) => {
  const preset = {
    female: [
      {
        title: "Phụ kiện nữ",
        items: [
          { name: "Tất nữ" },
          { name: "Túi nữ" },
          { name: "Phụ kiện nữ khác" },
        ],
      },
      {
        title: "Áo nữ",
        items: [
          { name: "Áo khoác nữ" },
          { name: "Áo hoodie - Áo nỉ nữ" },
          { name: "Áo polo nữ" },
          { name: "Áo sơ mi nữ" },
          { name: "Áo thun nữ" },
        ],
      },
      {
        title: "Quần nữ",
        items: [
          { name: "Quần dài nữ" },
          { name: "Quần nỉ nữ" },
          { name: "Quần kaki nữ" },
          { name: "Quần jeans nữ" },
          { name: "Quần âu nữ" },
        ],
      },
      {
        title: "Đồ thể thao nữ",
        items: [
          { name: "Quần thể thao nữ" },
          { name: "Áo polo thể thao nữ" },
          { name: "Bộ thể thao nữ" },
        ],
      },
    ],
    male: [
      {
        title: "Phụ kiện nam",
        items: [
          { name: "Tất nam" },
          { name: "Túi xách nam" },
          { name: "Mũ nam" },
          { name: "Thắt lưng nam" },
        ],
      },
      {
        title: "Áo nam",
        items: [
          { name: "Áo khoác nam" },
          { name: "Áo nỉ nam" },
          { name: "Áo len nam" },
          { name: "Áo sơ mi nam" },
        ],
      },
      {
        title: "Quần nam",
        items: [
          { name: "Quần kaki" },
          { name: "Quần short nam" },
          { name: "Quần jeans nam" },
          { name: "Quần âu nam" },
        ],
      },
      {
        title: "Đồ thể thao nam",
        items: [
          { name: "Quần thể thao nam" },
          { name: "Áo polo thể thao nam" },
          { name: "Áo thun thể thao nam" },
          { name: "Bộ thể thao nam" },
        ],
      },
    ],
  };
  return preset[type] || [];
};
