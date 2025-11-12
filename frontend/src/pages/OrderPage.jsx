import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SidebarUser from "@/components/SidebarUser";
import OrderTabs from "@/components/OrderTabs";
import OrderCard from "@/components/OrderCard";
import { cancelOrder, confirmDelivery, getOrders, requestCancel } from "@/services/orderService";
import { submitReview } from "@/services/reviewService";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function OrderPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [actionOrderId, setActionOrderId] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", body: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchOrders = useCallback(
    async ({ silent = false, ignore } = {}) => {
      if (!silent) setLoading(true);
      try {
        const { items } = await getOrders(status);
        if (ignore?.current) return;
        setOrders(items || []);
      } catch (err) {
        console.error("Không thể tải đơn hàng", err);
        if (ignore?.current) return;
        setOrders([]);
      } finally {
        if (!silent && !ignore?.current) setLoading(false);
      }
    },
    [status]
  );

  useEffect(() => {
    const ignore = { current: false };
    fetchOrders({ ignore });
    return () => {
      ignore.current = true;
    };
  }, [fetchOrders]);

  const handleRepurchase = (order) => {
    const firstItem = order?.items?.[0];
    const product = firstItem?.product;
    const productId = product?._id || product;
    if (!productId) {
      toast.error("Không tìm thấy sản phẩm để mua lại");
      return;
    }
    navigate(`/p/${productId}`);
  };

  const handleCancel = async (order) => {
    if (!order?._id) return;
    const confirmed = window.confirm("Bạn có chắc muốn hủy đơn này?");
    if (!confirmed) return;
    const reason = window.prompt("Lý do hủy (không bắt buộc)")?.trim();
    try {
      setActionOrderId(order._id);
      await cancelOrder(order._id, reason);
      toast.success("Đã hủy đơn hàng");
      await fetchOrders({ silent: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không thể hủy đơn");
    } finally {
      setActionOrderId(null);
    }
  };

  const handleRequestCancel = async (order) => {
    if (!order?._id) return;
    const confirmed = window.confirm("Gửi yêu cầu hủy đến cửa hàng?");
    if (!confirmed) return;
    const reason = window.prompt("Lý do yêu cầu hủy (không bắt buộc)")?.trim();
    try {
      setActionOrderId(order._id);
      await requestCancel(order._id, reason);
      toast.success("Đã gửi yêu cầu hủy");
      await fetchOrders({ silent: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không gửi được yêu cầu");
    } finally {
      setActionOrderId(null);
    }
  };

  const handleConfirmDelivery = async (order) => {
    if (!order?._id) return;
    const confirmed = window.confirm("Xác nhận đã nhận được hàng?");
    if (!confirmed) return;
    try {
      setActionOrderId(order._id);
      await confirmDelivery(order._id);
      toast.success("Cảm ơn bạn đã xác nhận");
      await fetchOrders({ silent: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không xác nhận được đơn");
    } finally {
      setActionOrderId(null);
    }
  };

  const openReviewModal = (order) => {
    if (!order?.items?.length) {
      toast.error("Không tìm thấy sản phẩm để đánh giá");
      return;
    }
    setSelectedOrder(order);
    setReviewForm({ rating: 5, title: "", body: "" });
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedOrder(null);
    setReviewForm({ rating: 5, title: "", body: "" });
  };

  const handleSubmitReview = async (event) => {
    event?.preventDefault?.();
    if (!selectedOrder?.items?.length) return;
    const productRef = selectedOrder.items[0].product;
    const productId = productRef?._id || productRef;
    if (!productId) {
      toast.error("Không xác định được sản phẩm để đánh giá");
      return;
    }
    if (Number(reviewForm.rating) < 1 || Number(reviewForm.rating) > 5) {
      toast.error("Điểm đánh giá phải từ 1 đến 5");
      return;
    }
    try {
      setSubmittingReview(true);
      await submitReview({
        productId,
        rating: Number(reviewForm.rating),
        title: reviewForm.title,
        body: reviewForm.body,
      });
      toast.success("Đã gửi đánh giá, vui lòng chờ duyệt");
      await fetchOrders({ silent: true });
      closeReviewModal();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không gửi được đánh giá");
    } finally {
      setSubmittingReview(false);
    }
  };

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
                    <OrderCard
                      key={order._id}
                      order={order}
                      busyOrderId={actionOrderId}
                      onCancel={handleCancel}
                      onRequestCancel={handleRequestCancel}
                      onConfirmDelivery={handleConfirmDelivery}
                      onReview={openReviewModal}
                      onRepurchase={handleRepurchase}
                    />
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

        <Dialog open={reviewModalOpen} onOpenChange={(open) => { if (!open) closeReviewModal(); }}>
          <DialogContent className="bg-white shadow-2xl border border-gray-100 sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Đánh giá sản phẩm</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <form className="space-y-4 text-sm text-gray-700" onSubmit={handleSubmitReview}>
                <div className="rounded-2xl bg-gray-50/80 p-4 border border-gray-100">
                  <div className="text-xs uppercase tracking-wide text-gray-500">Sản phẩm</div>
                  <div className="mt-1 font-semibold text-brand-dark">
                    {selectedOrder.items[0]?.product?.name || selectedOrder.items[0]?.name || "Sản phẩm"}
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-800">Điểm đánh giá (1-5)</label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-800">Tiêu đề</label>
                  <Input
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Ấn tượng của bạn"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-800">Nội dung</label>
                  <Textarea
                    rows={4}
                    value={reviewForm.body}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, body: e.target.value }))}
                    placeholder="Chia sẻ trải nghiệm sử dụng sản phẩm"
                  />
                </div>
                <DialogFooter className="pt-2">
                  <Button type="button" variant="ghost" onClick={closeReviewModal} className="text-gray-600 hover:text-gray-800">
                    Để sau
                  </Button>
                  <Button type="submit" disabled={submittingReview} className="bg-brand-primary hover:bg-brand-primary/90">
                    {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </main>

      {/* Footer full width */}
      <Footer />
    </>
  );
}

