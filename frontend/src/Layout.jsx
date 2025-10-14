import React from "react";
import { Outlet, useLocation } from "react-router";
import Sidebar from "@/components/Sidebar";
import { PomodoroProvider } from "@/components/pomodoro/PomodoroContext";
import PomodoroBar from "@/components/pomodoro/PomodoroBar";

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
