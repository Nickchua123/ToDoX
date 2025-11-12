import { useMemo } from "react";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";

// ảnh mẫu: /src/assets/products/...
const asset = (p) =>
  new URL(`../../assets/products/${p}`, import.meta.url).href;

export default function ProductsAdmin() {
  const products = useMemo(
    () => [
      {
        _id: "p1",
        name: "Áo thun ND Basic",
        price: 199000,
        stock: 32,
        img: asset("p1.webp"),
      },
      {
        _id: "p2",
        name: "Quần jean Slim",
        price: 499000,
        stock: 12,
        img: asset("p2.webp"),
      },
      {
        _id: "p3",
        name: "Áo khoác Gió",
        price: 699000,
        stock: 0,
        img: asset("p3.webp"),
      },
    ],
    []
  );

  return (
    <section className="space-y-4">
      {/* thanh tiêu đề + nút tạo mới */}
      <div className="rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,.12)] px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Sản phẩm</h1>
          <button className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-[#FF6A3D] text-white hover:opacity-90">
            <Plus className="w-4 h-4" /> Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* bảng: không viền, chia dòng nhẹ */}
      <div className="rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,.12)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-6 py-3">Ảnh</th>
                <th className="px-6 py-3">Tên</th>
                <th className="px-6 py-3">Giá</th>
                <th className="px-6 py-3">Kho</th>
                <th className="px-6 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    {p.img ? (
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                      />
                    ) : (
                      <div className="w-14 h-14 grid place-content-center border border-slate-200 rounded-lg text-slate-400">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{p.name}</td>
                  <td className="px-6 py-4">{p.price.toLocaleString()}₫</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        p.stock > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {p.stock > 0 ? `${p.stock} còn` : "Hết hàng"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                        title="Sửa"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
                        title="Xoá"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Chưa có sản phẩm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
