// Helper tạo URL ảnh dưới thư mục src/anhNNKB
const asset = (p) => new URL(`../anhNNKB/${p}`, import.meta.url).href;

// Hero banner
export const hero = asset("slider_1.webp");

// Danh mục
export const categories = [
  { label: "Áo Nữ", img: asset("image_cate_1.webp") },
  { label: "Váy", img: asset("image_cate_2.webp") },
  { label: "Áo Nam", img: asset("image_cate_3.webp") },
  { label: "Sơ Mi", img: asset("image_cate_4.webp") },
  { label: "Quần", img: asset("image_cate_5.webp") },
  { label: "Áo Khoác", img: asset("image_cate_6.webp") },
  { label: "Giày Dép", img: asset("image_cate_7.webp") },
  { label: "Phụ Kiện", img: asset("image_cate_8.webp") },
];

// Bộ sưu tập nữ (1 → 5)
export const womenCollection = [
  {
    id: "1",
    name: "Đầm liền nữ dáng A cổ sơ mi dài tay xếp ly",
    img: new URL("../anhNNKB/1.webp", import.meta.url).href,
    price: "868.000₫",
    old: "",
    tag: 0,
  },
  {
    id: "2",
    name: "Váy liền nữ cổ tim sát nách, chun eo",
    img: new URL("../anhNNKB/2.webp", import.meta.url).href,
    price: "368.000₫",
    old: "680.000₫",
    tag: 46,
  },
  {
    id: "3",
    name: "Áo len gilet nữ cổ tim dệt thừng",
    img: new URL("../anhNNKB/3.webp", import.meta.url).href,
    price: "486.000₫",
    old: "686.000₫",
    tag: 29,
  },
  {
    id: "4",
    name: "Váy liền nữ tay lỡ dáng A",
    img: new URL("../anhNNKB/4.webp", import.meta.url).href,
    price: "380.000₫",
    old: "",
    tag: 0,
  },
  {
    id: "5",
    name: "Váy liền nữ cổ vuông hai dây dáng fit & flare có lót",
    img: new URL("../anhNNKB/5.webp", import.meta.url).href,
    price: "268.000₫",
    old: "368.000₫",
    tag: 27,
  },
];

// Bộ sưu tập nam (16 → 19 + 10)
export const menCollection = [
  {
    id: "16",
    name: "Áo len polo nam cộc tay ND004",
    img: new URL("../anhNNKB/16.webp", import.meta.url).href,
    price: "699.000₫",
    old: "899.000₫",
    tag: 22,
  },
  {
    id: "17",
    name: "Áo sơ mi nam cotton dài tay ND003",
    img: new URL("../anhNNKB/17.webp", import.meta.url).href,
    price: "599.000₫",
    old: "799.000₫",
    tag: 25,
  },
  {
    id: "18",
    name: "Áo sơ mi nam dài tay dáng suông regular",
    img: new URL("../anhNNKB/18.webp", import.meta.url).href,
    price: "768.000₫",
    old: "899.000₫",
    tag: 22,
  },
  {
    id: "19",
    name: "Áo sơ mi nam dài tay dáng suông",
    img: new URL("../anhNNKB/19.webp", import.meta.url).href,
    price: "768.000₫",
    old: "",
    tag: 0,
  },
  {
    id: "10",
    name: "Thắt Lưng Nam Khoá Tự Động Phối Sọc",
    img: new URL("../anhNNKB/10.webp", import.meta.url).href,
    price: "Liên hệ",
    old: "",
    tag: 0,
  },
];

// Coupon
export const coupons = [
  {
    badge: "FREE SHIP",
    title: "Miễn phí vận chuyển",
    sub: "Cho đơn hàng đầu tiên",
    img: asset("image_voucher_1.webp"),
  },
  {
    badge: "Giảm giá",
    title: "Giảm 15%",
    sub: "Cho đơn từ 690k",
    img: asset("image_voucher_2.webp"),
  },
  {
    badge: "Giảm",
    title: "Giảm 25%",
    sub: "Cho đơn từ 1.049k",
    img: asset("image_voucher_3.webp"),
  },
  {
    badge: "Mua 1 + 1",
    title: "Ngẫu nhiên",
    sub: "Cho đơn từ 1.069k",
    img: asset("image_voucher_4.webp"),
  },
];

// Sản phẩm (8 mục) dùng cùng ProductCard.jsx
const productImages = [
  "sp3-2-c140d0a9-b56c-4166-8f5b-3da0c917eba6.webp",
  "sp8-2-b6da4946-d566-436c-bb78-02b179755959.webp",
  "sp15.webp",
  "sp10-2.webp",
  "sp5-2-974b486e-7887-4720-a7ba-180d4f4b85ce.webp",
  "sp6.webp",
  "sp7-4-0c5388ec-d407-4278-8d74-5bbe41ee9356.webp",
  "sp8-2-b6da4946-d566-436c-bb78-02b179755959.webp",
];

export const products = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: [
    "Áo khoác dệt 2 lớp",
    "Áo polo nam ND008",
    "Váy liền dài phối màu",
    "Áo nữ relax",
    "Áo len cộc tay",
    "Áo gilet cổ tim",
    "Quần jeans crop",
    "Quần suông nữ",
  ][i],
  price: [
    "1.860.000₫",
    "450.000₫",
    "628.000₫",
    "568.000₫",
    "680.000₫",
    "486.000₫",
    "780.000₫",
    "680.000₫",
  ][i],
  old: [
    "2.080.000₫",
    "600.000₫",
    "680.000₫",
    "656.000₫",
    "",
    "686.000₫",
    "",
    "860.000₫",
  ][i],
  tag: [7, 25, 28, 17, 0, 29, 0, 21][i],
  img: asset(productImages[i]),
}));

// Tin tức
export const news = [
  {
    title: "SẢN PHẨM RA MẮT: Bộ sưu tập Thu Đông 2024",
    date: "18/11/2024",
    author: "Nguyễn Anh Dũng",
    img: asset("img_blog_home.webp"),
  },
  {
    title: "5 món tối giản phong cách Pháp",
    date: "18/11/2024",
    author: "Nguyễn Anh Dũng",
    img: asset("img_product_banner_1.webp"),
    small: true,
  },
  {
    title: "4 kiểu áo tối giản Nhật Bản",
    date: "18/11/2024",
    author: "Nguyễn Anh Dũng",
    img: asset("img_product_banner_2.webp"),
    small: true,
  },
];

// Gallery (ảnh IG)
export const gallery = [
  asset("Screenshot 2025-11-08 112209.png"),
  asset("Screenshot 2025-11-08 112315.png"),
  asset("Screenshot 2025-11-08 112321.png"),
  asset("Screenshot 2025-11-08 112328.png"),
  asset("Screenshot 2025-11-08 112337.png"),
  asset("Screenshot 2025-11-08 112346.png"),
  asset("Screenshot 2025-11-08 112352.png"),
  asset("Screenshot 2025-11-08 112400.png"),
];

// Ưu đãi đặc biệt (4 mục: 33 → 36)
export const specialDeals = [
  {
    id: "33",
    name: "Áo Khoác Da Lộn Nam 2 Lớp",
    price: "1.860.000₫",
    old: "2.000.000₫",
    tag: 7,
    img: asset("33.webp"),
  },
  {
    id: "34",
    name: "Áo polo nam phối màu ND008",
    price: "450.000₫",
    old: "600.000₫",
    tag: 25,
    img: asset("34.webp"),
  },
  {
    id: "35",
    name: "Váy liền nữ dáng dài, phối màu",
    price: "628.000₫",
    old: "868.000₫",
    tag: 28,
    img: asset("35.webp"),
  },
  {
    id: "36",
    name: "Áo Nỉ Nữ Phối Lá Cổ Dáng Relax",
    price: "568.000₫",
    old: "686.000₫",
    tag: 17,
    img: asset("36.webp"),
  },
];

// Gợi ý hôm nay (8 mục: 20 → 27)
export const suggestionsToday = [
  {
    id: "20",
    name: "Quần Jeans Nam Slim Denim Like Cơ Bản ND006",
    price: "Liên hệ",
    old: "",
    tag: 0,
    img: asset("20.webp"),
  },
  {
    id: "21",
    name: "Quần Jeans Nam Slim Denim Like Cơ Bản",
    price: "680.000₫",
    old: "860.000₫",
    tag: 21,
    img: asset("21.webp"),
  },
  {
    id: "22",
    name: "Quần Dài Nữ Dáng Suông",
    price: "680.000₫",
    old: "860.000₫",
    tag: 21,
    img: asset("22.webp"),
  },
  {
    id: "23",
    name: "Quần Jeans Nữ Dáng Crop",
    price: "780.000₫",
    old: "",
    tag: 0,
    img: asset("23.webp"),
  },
  {
    id: "24",
    name: "Quần Jeans 5 Túi Siêu Co Giãn",
    price: "680.000₫",
    old: "",
    tag: 0,
    img: asset("24.webp"),
  },
  {
    id: "25",
    name: "Quần Dài Nữ Dáng Suông Chất Liệu Mềm Mát",
    price: "368.000₫",
    old: "680.000₫",
    tag: 46,
    img: asset("25.webp"),
  },
  {
    id: "26",
    name: "Quần jeans nam phom slimfit",
    price: "860.000₫",
    old: "",
    tag: 0,
    img: asset("26.webp"),
  },
  {
    id: "27",
    name: "Quần Jeans Đen Slimfit 5 Túi",
    price: "860.000₫",
    old: "",
    tag: 0,
    img: asset("27.webp"),
  },
];

// Gợi ý hôm nay - tab Giá tốt
export const suggestionsBest = [
  {
    name: "Áo Len Nữ Cộc Tay Dáng Rộng",
    price: "680.000₫",
    old: "",
    tag: 0,
    img: asset("28.webp"),
  },
  {
    id: "3",
    name: "Áo Len Gilet Nữ Cổ Tim Dệt Thừng",
    price: "486.000₫",
    old: "686.000₫",
    tag: 29,
    img: asset("3.webp"),
  },
  {
    name: "Áo polo nam ND005",
    price: "499.000₫",
    old: "699.000₫",
    tag: 29,
    img: asset("29.webp"),
  },
  {
    id: "18",
    name: "Áo sơ mi nam dài tay dáng suông form regular",
    price: "699.000₫",
    old: "899.000₫",
    tag: 22,
    img: asset("18.webp"),
  },
  {
    id: "5",
    name: "Váy liền nữ cổ vuông hai dây dáng fit & flare có lót trong",
    price: "268.000₫",
    old: "368.000₫",
    tag: 27,
    img: asset("5.webp"),
  },
  {
    name: "Áo dạ len Tết nữ, cổ xẻ V cách điệu, vai chồm",
    price: "468.000₫",
    old: "628.000₫",
    tag: 25,
    img: asset("30.webp"),
  },
  {
    name: "Váy ren nữ cotton dáng babydoll",
    price: "480.000₫",
    old: "",
    tag: 0,
    img: asset("31.webp"),
  },
  {
    name: "Áo Nỉ Nữ Oversize Cắt Bổ Tinh Tế",
    price: "486.000₫",
    old: "868.000₫",
    tag: 44,
    img: asset("32.webp"),
  },
];

// Phụ kiện: dùng 8 ảnh sản phẩm
export const accessoriesMale = [
  {
    id: "6",
    name: "Túi Unisex Đeo Chéo Nắp Nam Châm",
    price: "868.000₫",
    old: "",
    tag: 0,
    img: asset("6.webp"),
  },
  {
    id: "7",
    name: "Mũ Lưỡi Trai Thêu Space Màu Đỏ",
    price: "138.000₫",
    old: "",
    tag: 0,
    img: asset("7.webp"),
  },
  {
    id: "8",
    name: "Mũ Lưỡi Trai Thêu Space Màu Navy",
    price: "138.000₫",
    old: "",
    tag: 0,
    img: asset("8.webp"),
  },
  {
    id: "9",
    name: "Mũ Lưỡi Trai Thêu chữ P",
    price: "268.000₫",
    old: "",
    tag: 0,
    img: asset("9.webp"),
  },
  {
    id: "10",
    name: "Thắt Lưng Nam Khoá Tự Động Phối Sọc",
    price: "Liên hệ",
    old: "",
    tag: 0,
    img: asset("10.webp"),
  },
  {
    id: "11",
    name: "Thắt Lưng Nam Khoá Tự Động Mặt Kim Loại",
    price: "480.000₫",
    old: "",
    tag: 0,
    img: asset("11.webp"),
  },
  {
    id: "12",
    name: "Thắt Lưng Nam Khoá Tự Động Phối Nhám",
    price: "680.000₫",
    old: "",
    tag: 0,
    img: asset("12.webp"),
  },
  {
    id: "13",
    name: "Thắt Lưng Nam Khoá Cài Kim Loại Viền Vuông",
    price: "368.000₫",
    old: "",
    tag: 0,
    img: asset("13.webp"),
  },
];

// Phụ kiện nữ
export const accessoriesFemale = [
  {
    id: "14",
    name: "Túi Xách Nữ Công Sở",
    price: "1.800.000₫",
    old: "",
    tag: 0,
    img: asset("14.webp"),
  },
  {
    id: "15",
    name: "Túi Xách Nữ Da PU Cao Cấp",
    price: "1.368.000₫",
    old: "",
    tag: 0,
    img: asset("15.webp"),
  },
];
