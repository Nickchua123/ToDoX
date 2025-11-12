import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SidebarUser from "@/components/SidebarUser";
import OrderTabs from "@/components/OrderTabs";
import OrderCard from "@/components/OrderCard";
import { getOrders } from "@/services/orderService";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await getOrders(status);
        if (mounted) setOrders(data || []);
      } catch (err) {
        console.error("Không thể tải đơn hàng", err);
        if (mounted) setOrders([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [status]);

  return (
    <>
      {/* Header full width */}
      <Header />

      {/* Main content */}
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4 grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar trái */}
          <aside>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <SidebarUser />
            </div>
          </aside>

          {/* Nội dung phải */}
          <section>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
              <OrderTabs current={status} onChange={setStatus} />

              <div>
                {loading ? (
                  <div className="text-center text-gray-500 mt-12">
                    Đang tải đơn hàng...
                  </div>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))
                ) : (
                  <div className="text-center text-gray-500 mt-12">
                    <p>Chưa có đơn hàng</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer full width */}
      <Footer />
    </>
  );
}
