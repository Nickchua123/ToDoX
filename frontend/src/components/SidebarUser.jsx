ï»¿import { useState } from "react";
import { NavLink } from "react-router";
import { Bell, User2, ClipboardList, Ticket, Coins, ChevronDown } from "lucide-react";

const menu = [
  { icon: <Bell className="w-4 h-4 text-[#ff6347]" />, label: "ThÃ´ng bÃ¡o", link: "/account/notifications" },
  {
    icon: <User2 className="w-4 h-4 text-[#0070f3]" />,
    label: "TÃ i khoáº£n cá»§a tÃ´i",
    children: [
      { label: "Há»“ sÆ¡", link: "/account/profile" },
      { label: "NgÃ¢n hÃ ng", link: "/account/bank" },
      { label: "Äá»‹a chá»‰", link: "/account/address" },
      { label: "Äá»•i máº­t kháº©u", link: "/account/password" },
      { label: "CÃ i Ä‘áº·t thÃ´ng bÃ¡o", link: "/account/notifications" },
      { label: "RiÃªng tÆ°", link: "/account/privacy" },
    ],
  },
  { icon: <ClipboardList className="w-4 h-4 text-[#ff6347]" />, label: "ÄÆ¡n mua", link: "/orders" },
  { icon: <Ticket className="w-4 h-4 text-[#ff9800]" />, label: "Kho voucher", link: "/account/vouchers" },
  { icon: <Coins className="w-4 h-4 text-[#f9a825]" />, label: "Shopee Xu", link: "/account/xu" },
];

export default function SidebarUser() {
  const [openAccount, setOpenAccount] = useState(true);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm px-6 py-5 text-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#0c4a60] text-white flex items-center justify-center font-semibold text-lg">
            N
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">xuangan2703...</p>
            <button className="text-xs text-gray-400 hover:text-[#ff6347]">Sá»­a há»“ sÆ¡</button>
          </div>
        </div>
        <div className="space-y-1 text-xs text-gray-500">
          <p>11.11 Sale khá»§ng nháº¥t nÄƒm</p>
          <p className="text-[#ff6347] font-semibold">New</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3 text-sm">
        {menu.map((item, index) => (
          <div key={index}>
            {item.children ? (
              <>
                <button
                  onClick={() => setOpenAccount((v) => !v)}
                  className="flex items-center justify-between w-full text-gray-700 hover:text-[#ff6347] transition-all"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openAccount ? "rotate-180 text-[#ff6347]" : ""}`}
                  />
                </button>
                {openAccount && (
                  <div className="pl-9 mt-3 space-y-2 text-gray-600">
                    {item.children.map((sub, idx) => (
                      <NavLink
                        key={idx}
                        to={sub.link}
                        className={({ isActive }) =>
                          `block transition-all hover:text-[#ff6347] ${isActive ? "text-[#ff6347] font-semibold" : ""}`
                        }
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `flex items-center gap-3 transition-all ${
                    isActive ? "text-[#ff6347] font-semibold" : "text-gray-700 hover:text-[#ff6347]"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

