import React from "react";
import { Outlet, useLocation } from "react-router";
import Sidebar from "@/components/Sidebar";

export default function Layout() {
  const location = useLocation();
  const hideOnPaths = [
    "/login",
    "/register",
    "/forgot",
    "/reset",
    "/verify",
    "/unauthorized",
  ];
  const shouldHideSidebar = hideOnPaths.some((p) => location.pathname.startsWith(p));
  return (
    <div className="min-h-screen w-full bg-[#fefcff] flex overflow-x-hidden">
      {/* Sidebar (desktop) */}
      {!shouldHideSidebar && <Sidebar />}

      {/* Main content area */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
