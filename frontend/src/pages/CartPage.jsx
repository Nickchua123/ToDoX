// src/pages/CartPage.jsx
import { useEffect, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  getCart,
  increment,
  decrement,
  removeFromCart,
  total as cartTotal,
} from "@/lib/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // --- Refresh Cart ---
  const refresh = () => {
    const items = getCart();
    setCart(items);
    setTotal(cartTotal(items));
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "cart") refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    setTotal(cartTotal(cart));
  }, [cart]);

  const increase = (id) => setCart(increment(id));
  const decrease = (id) => setCart(decrement(id));
  const remove = (id) => setCart(removeFromCart(id));

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50 font-[Inter] text-[#111]">
      {/* Header */}
      <Header />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold mb-8">Giỏ hàng của bạn</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">Giỏ hàng trống.</p>
            <Button
              variant="outline"
              className="border-[#ff6347] text-[#ff6347] hover:bg-[#ff6347]/10 transition-all"
              onClick={() => (window.location.href = "/")}
            >
              Quay lại mua hàng
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="flex items-center space-x-5">
                    <img
                      src={item.image}
                      alt={item.title || item.name}
                      className="w-28 h-28 object-cover rounded-lg"
                    />
                    <div>
                      <h2 className="font-medium text-lg">
                        {item.title || item.name}
                      </h2>
                      <div className="flex items-center mt-3 space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full border-gray-300"
                          onClick={() => decrease(item.id)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-6 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full border-gray-300"
                          onClick={() => increase(item.id)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <button
                      onClick={() => remove(item.id)}
                      className="text-[#ff6347] hover:scale-110 transition-all"
                      aria-label="Xóa khỏi giỏ"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <p className="text-[#ff6347] font-semibold text-lg mt-2">
                      {Number(item.price || 0).toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xl font-semibold">
                Tổng tiền:{" "}
                <span className="text-[#ff6347]">
                  {Number(total || 0).toLocaleString("vi-VN")}₫
                </span>
              </span>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="border-[#ff6347] text-[#ff6347] hover:bg-[#ff6347]/10 transition-all"
                  onClick={() => (window.location.href = "/")}
                >
                  Tiếp tục mua hàng
                </Button>
                <Button
                  className="bg-[#ff6347] hover:bg-[#ff6347]/90 text-white shadow-md transition-all"
                  onClick={() => (window.location.href = "/checkout")}
                >
                  Thanh toán ngay
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
