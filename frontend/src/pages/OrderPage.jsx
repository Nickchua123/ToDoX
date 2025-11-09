import { useEffect, useState } from "react";
import SidebarUser from "@/components/SidebarUser";
import OrderTabs from "@/components/OrderTabs";
import OrderCard from "@/components/OrderCard";
import { getOrders } from "@/services/orderService";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("all");

  useEffect(() => {
    getOrders(status).then(setOrders);
  }, [status]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 border-r">
        <SidebarUser />
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <OrderTabs current={status} onChange={setStatus} />
        <div className="mt-4">
          {orders.length > 0 ? (
            orders.map((order) => <OrderCard key={order._id} order={order} />)
          ) : (
            <div className="text-center text-gray-500 mt-12">
              <p>Chưa có đơn hàng</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
