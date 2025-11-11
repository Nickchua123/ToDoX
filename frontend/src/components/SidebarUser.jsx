import { Link, useLocation } from "react-router-dom";
import { User, CreditCard, MapPin, Lock, Bell, ShieldCheck, Wallet, Ticket, Coins } from "lucide-react";

const items = [
  { to: "/account/profile", label: "Hồ sơ", icon: User },
  { to: "/account/bank", label: "Tài khoản ngân hàng", icon: CreditCard },
  { to: "/account/address", label: "Địa chỉ", icon: MapPin },
  { to: "/account/password", label: "Mật khẩu", icon: Lock },
  { to: "/account/payment", label: "Thanh toán", icon: Wallet },
  { to: "/account/privacy", label: "Quyền riêng tư", icon: ShieldCheck },
  { to: "/account/kyc", label: "Xác thực (KYC)", icon: ShieldCheck },
  { to: "/account/notifications", label: "Thông báo", icon: Bell },
  { to: "/account/vouchers", label: "Ưu đãi", icon: Ticket },
  { to: "/account/xu", label: "Xu", icon: Coins },
];

export default function SidebarUser() {
  const { pathname } = useLocation();
  return (
    <nav className="p-3">
      <ul className="space-y-1">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50 ${
                  active ? "bg-gray-100 text-brand-primary" : "text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
