// src/pages/CartPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
} from "@/services/cartService";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

const itemPrice = (item) => {
  const productPrice = Number(item.product?.price ?? item.price ?? 0);
  const variantDelta = Number(item.variant?.priceDelta ?? 0);
  return productPrice + variantDelta;
};

export default function CartPage() {
  const { refreshCart } = useCart();
  const [cartData, setCartData] = useState({ cart: null, subtotal: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await fetchCart();
      setCartData(data);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Không thể tải giỏ hàng. Vui lòng thử lại.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const items = useMemo(() => cartData.cart?.items || [], [cartData]);
  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + itemPrice(item) * Number(item.quantity ?? 0),
        0
      ),
    [items]
  );

  const changeQuantity = async (item, delta) => {
    const itemId = item._id || item.id;
    if (!itemId) return;
    const nextQuantity = Number(item.quantity || 0) + delta;
    try {
      setUpdatingId(itemId);
      if (nextQuantity <= 0) {
        await removeCartItem(itemId);
      } else {
        await updateCartItem(itemId, nextQuantity);
      }
      await Promise.all([loadCart(), refreshCart()]);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Không cập nhật được số lượng.";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (item) => {
    const itemId = item._id || item.id;
    if (!itemId) return;
    try {
      setUpdatingId(itemId);
      await removeCartItem(itemId);
      await Promise.all([loadCart(), refreshCart()]);
      toast.success("Đã xóa sản phẩm khỏi giỏ.");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Không thể xóa sản phẩm này.";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter] text-[#111]">
      <Header />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold mb-8">Giỏ hàng của bạn</h1>

        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Đang tải giỏ hàng...
          </div>
        ) : items.length === 0 ? (
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
                  {items.map((item) => (
                <div
                  key={item._id || item.id}
                  className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="flex items-center space-x-5">
                    <img
                      src={
                        item.product?.images?.[0] ||
                        item.product?.image ||
                        "/logo.png"
                      }
                      alt={item.product?.name}
                      className="w-28 h-28 object-cover rounded-lg"
                    />
                    <div>
                      <h2 className="font-medium text-lg">
                        {item.product?.name || "Sản phẩm"}
                      </h2>
                      {item.variant?.label ? (
                        <p className="text-sm text-gray-500">
                          Phân loại: {item.variant.label}
                        </p>
                      ) : null}
                      <div className="flex items-center mt-3 space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full border-gray-300"
                          onClick={() => changeQuantity(item, -1)}
                          disabled={updatingId === (item._id || item.id)}
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
                          onClick={() => changeQuantity(item, 1)}
                          disabled={updatingId === (item._id || item.id)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                    <div className="flex flex-col items-end">
                      <button
                        onClick={() => removeItem(item)}
                        className="text-[#ff6347] hover:scale-110 transition-all"
                        aria-label="Xóa khỏi giỏ"
                        disabled={updatingId === (item._id || item.id)}
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <p className="text-[#ff6347] font-semibold text-lg mt-2">
                        {formatCurrency(itemPrice(item))}
                      </p>
                    </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xl font-semibold">
                Tổng tiền:{" "}
                <span className="text-[#ff6347]">{formatCurrency(total)}</span>
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

      <Footer />
    </div>
  );
}
