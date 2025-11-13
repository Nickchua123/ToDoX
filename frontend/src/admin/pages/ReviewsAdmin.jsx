import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, Star, EyeOff, Eye, Trash2, Check } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { prepareCsrfHeaders } from "@/lib/csrf";

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "hidden", label: "Đã ẩn" },
];

const RatingStars = ({ value = 0 }) => {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={`w-4 h-4 ${i < value ? "fill-amber-400" : "fill-none text-amber-200"}`} />
      ))}
    </div>
  );
};

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadReviews = async ({ nextStatus = status, nextPage = page } = {}) => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      params.set("limit", PAGE_SIZE);
      params.set("page", nextPage);
      if (nextStatus !== "all") params.set("status", nextStatus);
      const { data } = await api.get(`/reviews/admin/all?${params.toString()}`);
      setReviews(data?.items || []);
      setTotal(data?.total || 0);
      setPage(data?.page || nextPage);
    } catch (err) {
      const message = err?.response?.data?.message || "Không tải được đánh giá";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews({ nextStatus: status, nextPage: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const filteredReviews = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return reviews;
    return reviews.filter((item) => {
      const fields = [item.product?.name, item.user?.name, item.title, item.body];
      return fields.some((field) => String(field || "").toLowerCase().includes(keyword));
    });
  }, [reviews, q]);

  const handleApprove = async (reviewId) => {
    try {
      const headers = await prepareCsrfHeaders();
      await api.patch(`/reviews/${reviewId}/approve`, {}, { headers });
      toast.success("Đã duyệt đánh giá");
      loadReviews({ nextStatus: status, nextPage: page });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không duyệt được đánh giá");
    }
  };

  const handleToggleHide = async (reviewId, hidden) => {
    try {
      const headers = await prepareCsrfHeaders();
      await api.patch(`/reviews/${reviewId}/hide`, { hidden: !hidden }, { headers });
      toast.success(!hidden ? "Đã ẩn đánh giá" : "Đã hiển thị đánh giá");
      loadReviews({ nextStatus: status, nextPage: page });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không cập nhật được đánh giá");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Xóa đánh giá này?")) return;
    try {
      const headers = await prepareCsrfHeaders();
      await api.delete(`/reviews/${reviewId}`, { headers });
      toast.success("Đã xóa đánh giá");
      loadReviews({ nextStatus: status, nextPage: page });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không xóa được đánh giá");
    }
  };

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,.12)] px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-lg font-semibold">Đánh giá sản phẩm</h1>
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm theo sản phẩm, khách hàng..."
                className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 w-72 focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]/40"
              />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => loadReviews({ nextStatus: status, nextPage: 1 })}
              type="button"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw className="w-4 h-4" /> Tải lại
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,.12)]">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-12 text-center text-slate-500">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="px-6 py-12 text-center text-rose-600">{error}</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="px-6 py-3">Sản phẩm</th>
                  <th className="px-6 py-3">Khách hàng</th>
                  <th className="px-6 py-3">Đánh giá</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Ngày</th>
                  <th className="px-6 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{review.product?.name || "—"}</div>
                      {review.title && <div className="text-xs text-slate-500">{review.title}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-800 font-medium">{review.user?.name || "Ẩn danh"}</div>
                      <div className="text-xs text-slate-500">{review.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <RatingStars value={review.rating} />
                      {review.body && <p className="mt-1 text-xs text-slate-600 line-clamp-2">{review.body}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium ${
                          review.hidden
                            ? "bg-slate-100 text-slate-600"
                            : review.approved
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {review.hidden ? "Đã ẩn" : review.approved ? "Đã duyệt" : "Chờ duyệt"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {review.createdAt ? new Date(review.createdAt).toLocaleString("vi-VN") : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {!review.approved && (
                          <button
                            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                            type="button"
                            onClick={() => handleApprove(review._id)}
                            title="Duyệt đánh giá"
                          >
                            <Check className="w-4 h-4 text-emerald-600" />
                          </button>
                        )}
                        <button
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                          type="button"
                          onClick={() => handleToggleHide(review._id, review.hidden)}
                          title={review.hidden ? "Hiển thị lại" : "Ẩn đánh giá"}
                        >
                          {review.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                          type="button"
                          onClick={() => handleDelete(review._id)}
                          title="Xóa đánh giá"
                        >
                          <Trash2 className="w-4 h-4 text-rose-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredReviews.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                      Không có đánh giá.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-sm text-slate-600">
          <span>
            Trang {page}/{totalPages} — Tổng {total} đánh giá
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => page > 1 && loadReviews({ nextStatus: status, nextPage: page - 1 })}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50"
              type="button"
            >
              Trước
            </button>
            <button
              onClick={() => page < totalPages && loadReviews({ nextStatus: status, nextPage: page + 1 })}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50"
              type="button"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
