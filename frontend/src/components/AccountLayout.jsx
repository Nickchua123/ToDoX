import React from "react";
import { Outlet, NavLink } from "react-router";
import { User, CreditCard, MapPin, Lock, Bell, FileText, Users } from "lucide-react";

const menu = [
  { to: "profile", label: "Hồ Sơ", icon: User },
  { to: "payment", label: "Ngân Hàng / Thanh Toán", icon: CreditCard },
  { to: "address", label: "Địa Chỉ", icon: MapPin },
  { to: "kyc", label: "Thông Tin Cá Nhân (KYC)", icon: FileText },
  { to: "notifications", label: "Cài Đặt Thông Báo", icon: Bell },
  { to: "privacy", label: "Những Thiết Lập Riêng Tư", icon: Lock },
];

export default function AccountLayout(){
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg flex overflow-hidden">
          <aside className="w-64 border-r">
            <div className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center font-semibold">N</div>
              <div>
                <div className="font-medium">xuangan2703...</div>
                <div className="text-sm text-gray-500">Sửa Hồ Sơ</div>
              </div>
            </div>
            <nav className="px-4 pb-6">
              <ul className="space-y-1">
                {menu.map((m) => {
                  const Icon = m.icon;
                  return (
                    <li key={m.to}>
                      <NavLink
                        to={m.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2 rounded-md text-sm ${
                            isActive ? "bg-primary/10 text-primary font-medium" : "text-gray-700 hover:bg-gray-100"
                          }`
                        }
                      >
                        <Icon className="w-4 h-4" />
                        {m.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <main className="flex-1 p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
