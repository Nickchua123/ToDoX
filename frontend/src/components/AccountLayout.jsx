ï»¿import React from "react";
import { Outlet } from "react-router";
import SidebarUser from "@/components/SidebarUser";

export default function AccountLayout() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <SidebarUser />
          </div>
        </aside>
        <main>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

