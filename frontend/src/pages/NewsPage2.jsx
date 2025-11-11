import { Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import AnhDung3 from "@/anhNNKB/AnhDung3.webp";
import AnhDung4 from "@/anhNNKB/AnhDung4.jpg";
import AnhDung5 from "@/anhNNKB/AnhDung5.webp";

const newsList2 = [
  {
    id: 4,
    title: "Phong cách mùa lạnh của Jisoo rất ngọt ngào nhờ 4 mẫu áo",
    author: "Nguyễn Anh Dũng",
    date: "18/11/2024",
    image: AnhDung3,
    description:
      "Jisoo gây ấn tượng với style ngọt ngào, nữ tính. Từ hè sang đông, cô thường ưu ái các mẫu áo giúp tổng thể vừa ấm áp vừa thanh lịch.",
  },
  {
    id: 5,
    title: "10 cách phối áo thun dài tay và quần jeans trẻ trung",
    author: "Nguyễn Anh Dũng",
    date: "18/11/2024",
    image: AnhDung4,
    description:
      "Áo thun dài tay kết hợp quần jeans là công thức hack tuổi hiệu quả. Dễ mặc, năng động và phù hợp nhiều hoàn cảnh.",
  },
  {
    id: 6,
    title: "5 món thời trang công sở trẻ trung cần có trong mùa lạnh",
    author: "Nguyễn Anh Dũng",
    date: "18/11/2024",
    image: AnhDung5,
    description:
      "Trang phục công sở vẫn trẻ trung nếu phối khéo. Một vài item chủ chốt sẽ giúp nâng cấp diện mạo mà vẫn giữ sự chỉn chu.",
  },
];

export default function NewsPage2() {
  return (
    <>
      {newsList2.map((item) => (
        <Card
          key={item.id}
          className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
        >
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
    </>
  );
}
