// Generated product details based on mock collections
const asset = (p) => new URL(`../anhNNKB/${p}`, import.meta.url).href;
import {
  womenCollection,
  accessoriesMale,
  accessoriesFemale,
  menCollection,
  suggestionsToday,
  suggestionsBest,
} from "./mock.js";

const commonShipping = [
  { title: "Giao hàng toàn quốc", sub: "Thanh toán (COD) khi nhận hàng" },
  { title: "Miễn phí giao hàng", sub: "Theo chính sách" },
  { title: "Đổi trả trong 7 ngày", sub: "Kể từ ngày mua" },
  { title: "Hỗ trợ 24/7", sub: "Theo chính sách" },
];

const samplePolicy = [
  {
    title: "Điều kiện đổi trả",
    lines: [
      "Sản phẩm còn tem mác, chưa qua sử dụng, không bẩn/rách.",
      "Yêu cầu trong 7 ngày kể từ ngày nhận hàng.",
    ],
  },
  {
    title: "Hướng dẫn",
    lines: ["Liên hệ CSKH để nhận hướng dẫn đóng gói và gửi đổi."],
  },
];

const sampleReviews = [
  { name: "Minh Châu", rating: 4.6, text: "Form đẹp, chất liệu thoáng mát." },
  { name: "Hải Nam", rating: 4.8, text: "Đúng mô tả, đáng tiền." },
];

function makeDetail(item, group) {
  const id = String(item.id);
  return {
    id,
    name: item.name,
    price: item.price,
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc:
      "Thiết kế thanh lịch, phù hợp đi làm và dạo phố. Chất liệu mềm mại, thoáng mát.",
    hero: item.img,
    images: [asset(`${id}.1.webp`), asset(`${id}.2.webp`), asset(`${id}.3.webp`)].filter(
      Boolean
    ),
    shipping: commonShipping,
    info: [
      "Chất liệu bền, thoáng.",
      "Form dễ mặc, tôn dáng.",
      "Phối được nhiều phong cách.",
    ],
    policy: samplePolicy,
    reviews: sampleReviews,
    related: (group || [])
      .filter((x) => String(x.id) !== id)
      .slice(0, 6)
      .map((x) => ({ id: x.id, name: x.name, price: x.price, img: x.img })),
  };
}

const productDetails = {};
[
  womenCollection,
  accessoriesMale,
  accessoriesFemale || [],
  menCollection || [],
  suggestionsToday || [],
  suggestionsBest || [],
].forEach((group) => {
  group.forEach((item) => {
    productDetails[String(item.id)] = makeDetail(item, group);
  });
});

export default productDetails;

