import { Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import AnhDung from "@/anhNNKB/AnhDung.png";
import AnhDung1 from "@/anhNNKB/AnhDung1.webp";
import AnhDung2 from "@/anhNNKB/AnhDung2.webp";

const newsList1 = [
  {
    id: 1,
    title: "4 món đồ họa tiết đáng sắm để phong cách trẻ trung hơn",
    author: "Nguyễn Anh Dũng",
    date: "18/11/2024",
    image: AnhDung,
    description:
      "Thời trang mùa lạnh không nên chỉ giới hạn với những món đồ trơn màu. Khi bổ sung các item họa tiết, phong cách của chị em sẽ trở nên đa dạng và trẻ trung hơn.",
  },
  {
    id: 2,
    title: "5 món thời trang tối giản được phụ nữ Pháp diện mãi không chán",
    author: "Nguyễn Anh Dũng",
    date: "18/11/2024",
    image: AnhDung1,
    description:
      "Thời trang tối giản được yêu thích vì tinh tế và sang trọng. Những set đồ tối giản dễ áp dụng và giúp người mặc luôn gọn gàng, thanh lịch.",
  },
  {
    id: 3,
    title: "4 kiểu áo tối giản được phụ nữ Nhật Bản yêu thích trong mùa thu",
    author: "Nguyễn Anh Dũng",
    date: "18/11/2024",
    image: AnhDung2,
    description:
      "Phụ nữ Nhật chuộng các dáng áo cơ bản, bền mốt theo thời gian. Đây là trọng tâm trong phong cách tối giản, thanh lịch của họ.",
  },
];

export default function NewsPage1() {
  return (
    <>
      {newsList1.map((item) => (
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
