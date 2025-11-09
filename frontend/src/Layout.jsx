import React from "react";
import { Outlet, Link } from "react-router";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 text-sm">
          <Link to="/" className="font-semibold text-lg text-brand-dark">
            ND Shop
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/category" className="hover:text-brand-primary">
              Category
            </Link>
            <Link to="/contact" className="hover:text-brand-primary">
              Contact
            </Link>
            <Link to="/cart" className="hover:text-brand-primary">
              Cart
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
