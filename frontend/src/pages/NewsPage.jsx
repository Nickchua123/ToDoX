import { Outlet, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import AnhDung from "@/anhNNKB/AnhDung.png";
import AnhDung1 from "@/anhNNKB/AnhDung1.webp";
import AnhDung2 from "@/anhNNKB/AnhDung2.webp";
import AnhDung3 from "@/anhNNKB/AnhDung3.webp";

const hotNews = [
  {
    id: "n1",
    title: "4 món đồ họa tiết đáng sắm để phong cách trẻ trung hơn",
    image: AnhDung,
  },
  {
    id: "n2",
    title: "5 món thời trang tối giản được phụ nữ Pháp diện mãi không chán",
    image: AnhDung1,
  },
  {
    id: "n3",
    title: "4 kiểu áo tối giản được phụ nữ Nhật Bản yêu thích trong mùa thu",
    image: AnhDung2,
  },
  {
    id: "n4",
    title: "Phong cách mùa lạnh của Jisoo rất ngọt ngào nhờ 4 mẫu áo",
    image: AnhDung3,
  },
];

export default function NewsPage() {
  return (
    <>
      <Header />

      {/* Nội dung trang tin tức */}
      <div className="container mx-auto px-4 py-10 text-[#222]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Cột trái: nội dung trang con (NewsPage1 / NewsPage2) */}
          <div className="md:col-span-2 space-y-10">
            <Outlet />
            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-2">
              <NavLink to="/news" end>
                {({ isActive }) => (
                  <Button
                    variant="outline"
                    className={`rounded-full ${
                      isActive
                        ? "bg-[#ff6347] text-white border-[#ff6347]"
                        : "text-[#ff6347] border-[#ff6347] hover:bg-[#ff6347] hover:text-white"
                    }`}
                  >
                    1
                  </Button>
                )}
              </NavLink>
              <NavLink to="/news/2">
                {({ isActive }) => (
                  <Button
                    variant="outline"
                    className={`rounded-full ${
                      isActive
                        ? "bg-[#ff6347] text-white border-[#ff6347]"
                        : "hover:bg-[#ff6347] hover:text-white"
                    }`}
                  >
                    2
                  </Button>
                )}
              </NavLink>
            </div>
          </div>

          {/* Cột phải: Sidebar */}
          <aside className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg border-b pb-2 border-gray-200">
                Danh mục tin tức
              </h3>
              <ul className="space-y-2 mt-3 text-gray-600">
                <li className="hover:text-[#ff6347] cursor-pointer">
                  Trang chủ
                </li>
                <li className="hover:text-[#ff6347] cursor-pointer">Nữ</li>
                <li className="hover:text-[#ff6347] cursor-pointer">Nam</li>
                <li className="text-[#ff6347] font-medium cursor-pointer">
                  Tin tức
                </li>
                <li className="hover:text-[#ff6347] cursor-pointer">Liên hệ</li>

                <li className="hover:text-[#ff6347] cursor-pointer">
                  Kiểm tra đơn hàng
                </li>
                <li className="hover:text-[#ff6347] cursor-pointer">
                  Chi tiết sản phẩm
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg border-b pb-2 border-gray-200">
                Tin nổi bật
              </h3>
              <div className="mt-3 space-y-3">
                {hotNews.map((n) => (
                  <div key={n.id} className="flex gap-3 items-center">
                    <img
                      src={n.image}
                      alt={n.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <p className="text-sm hover:text-[#ff6347] cursor-pointer">
                      {n.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg border-b pb-2 border-gray-200">
                Từ khóa phổ biến
              </h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  "Thời Trang",
                  "Sản Phẩm Mới",
                  "Phong Cách",
                  "Phụ Kiện",
                  "Mặc Đẹp",
                  "Giá Rẻ",
                  "Chất Lượng Tốt",
                  "Xu Hướng",
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-[#ff6347] hover:text-white transition"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}
