import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function StoreRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-gray-500">
        Đang tải...
      </div>
    );
  }

  if (user?.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
