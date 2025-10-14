import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Sidebar from "@/components/Sidebar";
import { PomodoroProvider } from "@/components/pomodoro/PomodoroContext";
import PomodoroBar from "@/components/pomodoro/PomodoroBar";
import api from "@/lib/axios";

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
  // Auth guard: for protected pages, verify session; 401 will be redirected by axios interceptor
  useEffect(() => {
    if (!shouldHideSidebar) {
      api.get("/auth/profile").catch(() => {});
    }
  }, [shouldHideSidebar, location.pathname]);
  return (
    <PomodoroProvider>
      <div className="min-h-screen w-full bg-[#fefcff] flex overflow-x-hidden">
        {!shouldHideSidebar && <Sidebar />}
        <div className="flex-1">
          <Outlet />
        </div>
        {!shouldHideSidebar && <PomodoroBar />}
      </div>
    </PomodoroProvider>
  );
}
