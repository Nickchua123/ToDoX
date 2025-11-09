import { Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const newsList = [
  {
    id: 1,
    title: "4 kiểu áo tối giản được phụ nữ Nhật Bản yêu thích trong mùa thu",
    author: "Nguyễn Anh Dũng",
    date: "18/11/2024",
    image:
      "https://file.hstatic.net/200000280801/article/ao_to_gian_nhat_ban.jpg",
    description:
      "Phụ nữ Nhật Bản mặc đẹp nhưng họ không lên đồ quá cầu kỳ. Những món thời trang có kiểu dáng cơ bản, chuẩn mốt bền vững chính là trọng tâm trong phong cách của họ.",
  },
  {
    id: 2,
    title: "5 món thời trang tối giản được phụ nữ Pháp diện mãi không chán",
    author: "Nguyễn Anh Dũng",
    date: "18/11/2024",
    image:
      "https://file.hstatic.net/200000280801/article/phap_toi_gian.jpg",
    description:
      "Thời trang tối giản nhận được sự yêu thích của nhiều chị em. Các set đồ tối giản giúp người mặc toả sáng với sự tinh tế và sang trọng.",
  },
  {
    id: 3,
    title: "10 cách phối áo thun dài tay và quần jeans trẻ trung",
    author: "Nguyễn Anh Dũng",
    date: "17/11/2024",
    image:
      "https://file.hstatic.net/200000280801/article/phoi_ao_thun.jpg",
    description:
      "Áo thun dài tay và quần jeans luôn là combo an toàn, trẻ trung và năng động trong mọi hoàn cảnh.",
  },
];

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-10 text-[#222]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Cột bên trái - Tin tức */}
        <div className="md:col-span-2 space-y-10">
          {newsList.map((item) => (
            <Card key={item.id} className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[300px] object-cover"
              />
              <CardContent className="p-5">
                <div className="flex items-center text-sm text-gray-500 gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} /> {item.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={16} /> {item.author}
                  </div>
                </div>
                <h2 className="text-lg font-semibold hover:text-[#ff6347] transition-colors mb-2 cursor-pointer">
                  {item.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-8">
            <Button
              variant="outline"
              className="rounded-full text-[#ff6347] border-[#ff6347] hover:bg-[#ff6347] hover:text-white"
            >
              1
            </Button>
            <Button variant="outline" className="rounded-full">
              2
            </Button>
            <Button variant="outline" className="rounded-full">
              3
            </Button>
          </div>
        </div>

        {/* Cột bên phải */}
        <aside className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg border-b pb-2 border-gray-200">
              Danh mục tin tức
            </h3>
            <ul className="space-y-2 mt-3 text-gray-600">
              <li className="hover:text-[#ff6347] cursor-pointer">Trang chủ</li>
              <li className="hover:text-[#ff6347] cursor-pointer">Nữ</li>
              <li className="hover:text-[#ff6347] cursor-pointer">Nam</li>
              <li className="text-[#ff6347] font-medium cursor-pointer">Tin tức</li>
              <li className="hover:text-[#ff6347] cursor-pointer">Liên hệ</li>
              <li className="hover:text-[#ff6347] cursor-pointer">Hệ thống cửa hàng</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg border-b pb-2 border-gray-200">
              Tin nổi bật
            </h3>
            <div className="mt-3 space-y-3">
              {newsList.slice(0, 2).map((news) => (
                <div key={news.id} className="flex gap-3 items-center">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <p className="text-sm hover:text-[#ff6347] cursor-pointer">
                    {news.title}
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
              {["Thời trang", "Sản phẩm mới", "Phong cách", "Nữ tính", "Áo khoác"].map((tag, i) => (
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

      {/* Footer */}
      <footer className="mt-16 border-t pt-6 text-sm text-gray-600">
        <div className="text-center">
          © Bản quyền thuộc về <span className="font-medium">ND Theme</span> | Cung cấp bởi Sapo
        </div>
      </footer>
    </div>
  );
}
