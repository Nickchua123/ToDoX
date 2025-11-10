// src/layouts/AccountLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import SidebarUser from "@/components/SidebarUser";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AccountLayout() {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Nội dung chính */}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar trái */}
          <aside>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <SidebarUser />
            </div>
          </aside>

          {/* Nội dung động (nested route) */}
          <main>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

