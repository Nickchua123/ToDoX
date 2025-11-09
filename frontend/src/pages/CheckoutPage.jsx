import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getCart, total as cartTotal, increment, decrement, removeFromCart } from "@/lib/cart";

const currency = (v) => Number(v || 0).toLocaleString("vi-VN") + "₫";

export default function CheckoutPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const refresh = () => {
    const data = getCart();
    setItems(data);
    setTotal(cartTotal(data));
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const onStorage = (e) => { if (e.key === "cart") refresh(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const inc = (id) => setItems(increment(id));
  const dec = (id) => setItems(decrement(id));
  const del = (id) => setItems(removeFromCart(id));

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-6">Thanh toán</h1>

        {items.length === 0 ? (
          <p className="text-gray-500">Giỏ hàng trống. Hãy thêm sản phẩm trước khi thanh toán.</p>) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between border rounded-md p-4">
                  <div className="flex items-center gap-4">
                    <img src={it.image} alt={it.title || it.name} className="w-16 h-16 rounded object-cover" />
                    <div>
                      <div className="font-medium">{it.title || it.name}</div>
                      <div className="text-sm text-gray-500">{currency(it.price)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => dec(it.id)}>-</Button>
                    <span className="w-6 text-center">{it.quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => inc(it.id)}>+</Button>
                    <Button variant="outline" onClick={() => del(it.id)} className="ml-3">Xóa</Button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="bg-gray-50 rounded-md p-4">
              <div className="flex justify-between mb-2"><span>Tạm tính</span><span>{currency(total)}</span></div>
              <div className="flex justify-between mb-2"><span>Phí vận chuyển</span><span>-</span></div>
              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Tổng</span><span className="text-[#ff6347]">{currency(total)}</span>
              </div>
              <Button className="w-full mt-4 bg-[#ff6347] hover:bg-[#ff6347]/90 text-white">Đặt hàng</Button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

