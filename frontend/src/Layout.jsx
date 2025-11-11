import React from "react";
import { Outlet } from "react-router-dom";


export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

