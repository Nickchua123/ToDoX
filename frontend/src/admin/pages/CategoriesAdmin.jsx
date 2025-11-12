import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  FolderTree,
  Image as ImageIcon,
} from "lucide-react";
const asset = (p) =>
  new URL(`../../assets/categories/${p}`, import.meta.url).href;

export default function CategoriesAdmin() {
  const all = useMemo(
    () => [
      {
        _id: "c1",
        name: "Áo",
        slug: "ao",
        image: asset("shirt.webp"),
        parent: null,
      },
      {
        _id: "c2",
        name: "Quần",
        slug: "quan",
        image: asset("pants.webp"),
        parent: null,
      },
      {
        _id: "c3",
        name: "Áo thun",
        slug: "ao-thun",
        image: asset("tshirt.webp"),
        parent: "c1",
      },
      {
        _id: "c4",
        name: "Áo khoác",
        slug: "ao-khoac",
        image: asset("jacket.webp"),
        parent: "c1",
      },
      {
        _id: "c5",
        name: "Jean",
        slug: "jean",
        image: asset("jean.webp"),
        parent: "c2",
      },
    ],
    []
  );
  const [q, setQ] = useState("");
  const [parentFilter, setParentFilter] = useState("all");
  const findParent = (id) => all.find((c) => c._id === id)?.name ?? "—";

  const filtered = useMemo(
    () =>
      all.filter((c) => {
        const okQ =
          q.trim() === "" ||
          [c.name, c.slug].some((v) =>
            v.toLowerCase().includes(q.toLowerCase())
          );
        const okP =
          parentFilter === "all"
            ? true
            : parentFilter === "root"
            ? !c.parent
            : !!c.parent;
        return okQ && okP;
      }),
    [all, q, parentFilter]
  );

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,.12)] px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-lg font-semibold">Danh mục</h1>
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm tên hoặc slug…"
                className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 w-64 focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]/40"
              />
            </div>
            <select
              value={parentFilter}
              onChange={(e) => setParentFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200"
            >
              <option value="all">Tất cả</option>
              <option value="root">Chỉ danh mục gốc</option>
              <option value="hasParent">Chỉ danh mục con</option>
            </select>
            <button className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-[#FF6A3D] text-white hover:opacity-90">
              <Plus className="w-4 h-4" /> Thêm danh mục
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(15,23,42,.12)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-6 py-3">Ảnh</th>
                <th className="px-6 py-3">Tên</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Danh mục cha</th>
                <th className="px-6 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                      />
                    ) : (
                      <div className="w-14 h-14 grid place-content-center border border-slate-200 rounded-lg text-slate-400">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{c.name}</td>
                  <td className="px-6 py-4 text-slate-600">{c.slug}</td>
                  <td className="px-6 py-4">
                    {c.parent ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-sky-50 text-sky-700">
                        <FolderTree className="w-3 h-3" />{" "}
                        {findParent(c.parent)}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-lg bg-slate-100">
                        —
                      </span>
                    )}
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
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Không có danh mục.
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
