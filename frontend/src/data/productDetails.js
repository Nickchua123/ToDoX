// Cấu hình dữ liệu chi tiết cho từng sản phẩm
// Bổ sung object mới vào export default để tạo trang chi tiết nhanh.

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

const wc = Object.fromEntries(womenCollection.map((w) => [w.id, w]));
const am = Object.fromEntries(accessoriesMale.map((a) => [a.id, a]));
const af = Object.fromEntries((accessoriesFemale || []).map((a) => [a.id, a]));
const mc = Object.fromEntries((menCollection || []).map((m) => [m.id, m]));
const st = Object.fromEntries((suggestionsToday || []).map((s) => [s.id, s]));
const sb = Object.fromEntries((suggestionsBest || []).map((s) => [s.id, s]));

const productDetails = {
  // Ví dụ: chi tiết cho sản phẩm id "1"
  1: {
    id: "1",
    name: wc["1"].name,
    price: wc["1"].price,
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Đầm liền nữ dáng A cổ sơ mi dài tay xếp ly, thiết kế thanh lịch và nữ tính. Chất liệu mềm mại, đứng form, phù hợp công sở và dự tiệc.",
    hero: asset("1.webp"),
    images: [
      asset("1.1.webp"),
      asset("1.2.webp"),
      asset("1.3.webp"),
      asset("1.4.webp"),
    ],
    shipping: commonShipping,
    // Sản phẩm liên quan: dùng bộ sưu tập nữ (id 2-5)
    related: womenCollection
      .filter((w) => ["2", "3", "4", "5"].includes(w.id))
      .map((w) => ({ id: w.id, name: w.name, price: w.price, img: w.img })),
  },
  // Phụ kiện nam: id "6"
  6: {
    id: "6",
    name: am["6"].name,
    price: am["6"].price,
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Túi Unisex Đeo Chéo Nắp Nam Châm với thiết kế đơn giản, hiện đại, phù hợp cho cả nam và nữ. Chất liệu bền bỉ, chống nước; nắp nam châm tiện lợi giúp đóng mở dễ dàng. Dây đeo có thể điều chỉnh, phù hợp nhiều phong cách và hoạt động từ đi chơi, du lịch đến thể thao.",
    hero: asset("6.webp"),
    images: [asset("6.1.webp"), asset("6.2.webp")],
    shipping: commonShipping,
    info: [
      "Túi được làm từ chất liệu vải bền bỉ, chống nước, dễ dàng vệ sinh và duy trì độ bền cao theo thời gian.",
      "Kích thước vừa phải đủ để chứa điện thoại, ví tiền, tai nghe, chìa khóa và các vật dụng cần thiết khác.",
      "Thiết kế đeo chéo giúp rảnh tay khi di chuyển, phù hợp với nhiều dáng người và phong cách sử dụng.",
    ],
    policy: [
      {
        title: "Điều kiện đổi trả",
        lines: [
          "Sản phẩm còn nguyên tem, mác, chưa qua sử dụng và không có dấu hiệu đã giặt/rách/biến dạng.",
          "Yêu cầu đổi trả trong vòng 7 ngày kể từ ngày nhận hàng.",
        ],
      },
      {
        title: "Quy trình",
        lines: [
          "Liên hệ CSKH để đăng ký đổi trả.",
          "Đóng gói sản phẩm theo hướng dẫn và gửi về trung tâm.",
        ],
      },
    ],
    reviews: [
      {
        name: "Hải Nam",
        rating: 5,
        text: "Túi gọn nhẹ, đựng vừa ví + điện thoại, nam châm đóng mở tiện.",
      },
      {
        name: "Minh Châu",
        rating: 4.5,
        text: "Chất liệu chắc chắn, đi mưa nhẹ không sao. Dây đeo êm.",
      },
      {
        name: "Quốc Bảo",
        rating: 4.7,
        text: "Màu đẹp, phối đồ casual rất hợp. Đáng tiền.",
      },
    ],
    // Liên quan: toàn bộ nhóm phụ kiện nam 6..13
    related: accessoriesMale
      .filter((x) =>
        ["6", "7", "8", "9", "10", "11", "12", "13"].includes(x.id)
      )
      .map((x) => ({ id: x.id, name: x.name, price: x.price, img: x.img })),
  },
  // Phụ kiện nam: id "7"
  7: {
    id: "7",
    name: am["7"].name,
    price: am["7"].price,
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Mũ lưỡi trai với thiết kế đơn giản nhưng nổi bật, chất liệu vải cao cấp thoáng khí, thấm hút mồ hôi tốt. Họa tiết thêu sắc nét tạo điểm nhấn, phù hợp từ đi chơi, du lịch đến các hoạt động thể thao.",
    hero: asset("7.webp"),
    images: [
      asset("7.1.webp"),
      asset("7.2.webp"),
      asset("7.3.webp"),
      asset("7.4.webp"),
    ],
    shipping: commonShipping,
    info: [
      "Chất liệu thoáng khí, đội nhẹ đầu, vành mũ giữ form tốt.",
      "Thêu sắc sảo, màu bền; phối được nhiều trang phục.",
      "Đai sau điều chỉnh dễ dàng, phù hợp nhiều kích cỡ đầu.",
    ],
    policy: [
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
    ],
    reviews: [
      {
        name: "Bảo An",
        rating: 4.8,
        text: "Form ôm vừa, thêu đẹp, đội cả ngày không bí.",
      },
      {
        name: "Thái Dương",
        rating: 4.6,
        text: "Màu chuẩn, dễ phối đồ. Đai sau chắc chắn.",
      },
      {
        name: "Linh Phương",
        rating: 4.7,
        text: "Chất vải mát, giặt nhẹ không phai. Ổn áp!",
      },
    ],
    related: accessoriesMale
      .filter((x) =>
        ["6", "7", "8", "9", "10", "11", "12", "13"].includes(x.id)
      )
      .map((x) => ({ id: x.id, name: x.name, price: x.price, img: x.img })),
  },
  // Phụ kiện nam: id "8"
  8: {
    id: "8",
    name: am["8"].name,
    price: am["8"].price,
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: 'Mũ Lưỡi Trai Thêu Space Màu Navy mang lại vẻ ngoài năng động và cá tính. Thiết kế hiện đại với thêu "SPACE" phía trước tạo điểm nhấn, chất vải thoáng khí giúp đội thoải mái cả ngày.',
    hero: asset("8.webp"),
    images: [
      asset("8.1.webp"),
      asset("8.2.webp"),
      asset("8.3.webp"),
      asset("8.4.webp"),
    ],
    shipping: commonShipping,
    info: [
      "Vải cao cấp thấm hút mồ hôi, đội êm và nhẹ đầu.",
      "Tone navy dễ phối đồ: áo thun, áo khoác, quần jean/shorts.",
      "Đai điều chỉnh phía sau phù hợp nhiều kích cỡ đầu.",
    ],
    policy: [
      {
        title: "Điều kiện đổi trả",
        lines: [
          "Còn tem mác, không bẩn/rách, chưa qua sử dụng.",
          "Đổi trong 7 ngày kể từ khi nhận hàng.",
        ],
      },
      {
        title: "Hướng dẫn",
        lines: ["Liên hệ CSKH để được hỗ trợ xử lý đổi/hoàn."],
      },
    ],
    reviews: [
      {
        name: "Ngọc Hà",
        rating: 4.7,
        text: "Màu navy dễ phối, thêu sắc nét. Đội không bị nóng.",
      },
      {
        name: "Trọng Tín",
        rating: 4.6,
        text: "Form mũ chuẩn, đai điều chỉnh mượt. Giá hợp lý.",
      },
      {
        name: "Phúc Lâm",
        rating: 4.8,
        text: "Chất vải ok, đi chơi hay tập luyện đều ổn.",
      },
    ],
    related: accessoriesMale
      .filter((x) =>
        ["6", "7", "8", "9", "10", "11", "12", "13"].includes(x.id)
      )
      .map((x) => ({ id: x.id, name: x.name, price: x.price, img: x.img })),
  },
  // Phụ kiện nam: id "9"
  9: {
    id: "9",
    name: am["9"].name,
    price: am["9"].price,
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Mũ Lưỡi Trai Thêu Space Màu Đỏ mang lại vẻ ngoài trẻ trung, nổi bật. Vải thoáng khí, thêu sắc nét phía trước giúp tăng điểm nhấn cá tính khi phối đồ đi phố, thể thao hay du lịch.",
    hero: asset("9.webp"),
    images: [asset("9.1.webp"), asset("9.2.webp"), asset("9.3.webp")],
    shipping: commonShipping,
    info: [
      "Form mũ chuẩn, đội ôm đầu, không bí; chất vải mềm và bền.",
      "Tông đỏ dễ gây ấn tượng, phối tốt với áo thun/áo khoác.",
      "Đai sau điều chỉnh linh hoạt, phù hợp nhiều cỡ đầu.",
    ],
    policy: [
      {
        title: "Điều kiện đổi trả",
        lines: [
          "Sản phẩm còn tem mác, không bẩn/rách, chưa qua sử dụng.",
          "Đổi trả trong 7 ngày kể từ ngày nhận hàng.",
        ],
      },
      {
        title: "Hướng dẫn",
        lines: ["Liên hệ CSKH để được hỗ trợ đổi/hoàn theo quy trình."],
      },
    ],
    reviews: [
      {
        name: "Hiếu Khánh",
        rating: 4.7,
        text: "Màu đỏ lên hình đẹp, đi event rất nổi bật.",
      },
      {
        name: "Thanh Ngân",
        rating: 4.6,
        text: "Đội thoải mái cả ngày, thêu chữ rõ và bền.",
      },
      {
        name: "Bích Trâm",
        rating: 4.8,
        text: "Phối đồ streetwear quá hợp, chất vải ok.",
      },
    ],
    related: accessoriesMale
      .filter((x) =>
        ["6", "7", "8", "9", "10", "11", "12", "13"].includes(x.id)
      )
      .map((x) => ({ id: x.id, name: x.name, price: x.price, img: x.img })),
  },
  // Phụ kiện nam: id "10"
  10: {
    id: "10",
    name: am["10"].name,
    price: am["10"].price,
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Thắt Lưng Nam Khoá Tự Động Phối Sọc kết hợp sự tiện lợi với phong cách hiện đại. Khoá tự động thao tác nhanh gọn, dây da bền đẹp giúp giữ form quần và hoàn thiện outfit lịch lãm.",
    hero: asset("10.webp"),
    images: [
      asset("10.1.webp"),
      asset("10.2.webp"),
      asset("10.3.webp"),
      asset("10.4.webp"),
    ],
    shipping: commonShipping,
    info: [
      "Dây da bề mặt vân sang trọng, mềm mại, đeo cả ngày không khó chịu.",
      "Khoá tự động kim loại sáng bóng, giữ chặt chỉ với một thao tác.",
      "Phối sọc tinh tế tạo điểm nhấn hiện đại, dễ phối đồ đi làm/đi chơi.",
    ],
    policy: [
      {
        title: "Điều kiện đổi trả",
        lines: [
          "Sản phẩm nguyên tem mác, chưa cắt dây, chưa trầy xước mặt khoá.",
          "Đổi trong 7 ngày kể từ ngày nhận hàng.",
        ],
      },
      {
        title: "Hướng dẫn",
        lines: ["Liên hệ CSKH để nhận hướng dẫn đóng gói an toàn khi đổi trả."],
      },
    ],
    reviews: [
      {
        name: "Đức Thịnh",
        rating: 4.8,
        text: "Khoá tự động tiện cực, bấm phát ăn ngay. Dây da mềm.",
      },
      {
        name: "Anh Khoa",
        rating: 4.6,
        text: "Phối sọc nhìn hiện đại, đeo đi làm rất lịch sự.",
      },
      {
        name: "Trung Hiếu",
        rating: 4.7,
        text: "Mặt khoá chắc, cài nhanh. Size dây cắt vừa theo eo.",
      },
    ],
    related: accessoriesMale
      .filter((x) =>
        ["6", "7", "8", "9", "10", "11", "12", "13"].includes(x.id)
      )
      .map((x) => ({ id: x.id, name: x.name, price: x.price, img: x.img })),
  },
  // Phụ kiện nam: id "11"
  11: {
    id: "11",
    name: am["11"].name,
    price: am["11"].price,
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Thắt Lưng Nam Khoá Tự Động Mặt Kim Loại mang đến vẻ ngoài sang trọng và hiện đại. Khoá tự động chắc chắn, thao tác nhanh; dây da bền đẹp phù hợp nhiều phong cách.",
    hero: asset("11.webp"),
    images: [asset("11.1.webp"), asset("11.2.webp")],
    shipping: commonShipping,
    info: [
      "Dây da vân bền, không nứt gãy; êm và thoải mái khi đeo lâu.",
      "Mặt khoá kim loại hoàn thiện đẹp, bóng mượt và ít trầy xước.",
      "Cơ chế tự động siết vừa vặn, tháo mở nhanh chỉ một thao tác.",
    ],
    policy: [
      {
        title: "Điều kiện đổi trả",
        lines: [
          "Nguyên tem mác, mặt khoá không trầy, dây chưa cắt.",
          "Đổi/hoàn trong 7 ngày kể từ nhận hàng.",
        ],
      },
      {
        title: "Hướng dẫn",
        lines: ["Liên hệ CSKH để được hướng dẫn quy trình đổi trả chi tiết."],
      },
    ],
    reviews: [
      {
        name: "Quang Huy",
        rating: 4.7,
        text: "Khoá auto rất tiện, mặt kim loại đẹp, sáng.",
      },
      {
        name: "Việt Hoàng",
        rating: 4.6,
        text: "Dây mềm, đeo cả ngày không khó chịu. Đáng mua.",
      },
      {
        name: "Hữu Lộc",
        rating: 4.8,
        text: "Cắt dây theo eo dễ, cài mở nhanh, nhìn lịch sự.",
      },
    ],
    related: accessoriesMale
      .filter((x) =>
        ["6", "7", "8", "9", "10", "11", "12", "13"].includes(x.id)
      )
      .map((x) => ({ id: x.id, name: x.name, price: x.price, img: x.img })),
  },
  // Phụ kiện nam: id "12"
  12: {
    id: "12",
    name: am["12"].name,
    price: am["12"].price,
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Thắt Lưng Nam Khoá Tự Động Phối Nhám kết hợp khoá auto tiện lợi với dây da bề mặt nhám mạnh mẽ. Thiết kế lịch lãm, dễ phối cùng sơ mi, vest hoặc outfit thường ngày.",
    hero: asset("12.webp"),
    images: [asset("12.1.webp"), asset("12.2.webp")],
    shipping: commonShipping,
    info: [
      "Bề mặt da nhám hạn chế trầy, giữ vẻ ngoài nam tính và gọn gàng.",
      "Khoá tự động thao tác nhanh, cố định chắc và dễ điều chỉnh.",
      "Độ bền cao, đeo lâu không cấn; phù hợp đi làm/đi sự kiện.",
    ],
    policy: [
      {
        title: "Điều kiện đổi trả",
        lines: [
          "Sản phẩm còn tem mác, mặt khoá không trầy, dây chưa cắt.",
          "Chấp nhận trong 7 ngày kể từ ngày nhận hàng.",
        ],
      },
      {
        title: "Hướng dẫn",
        lines: ["Liên hệ CSKH để được hướng dẫn đóng gói và gửi đổi trả."],
      },
    ],
    reviews: [
      {
        name: "Văn Thái",
        rating: 4.7,
        text: "Da nhám nhìn sang và ít xước. Khoá auto dùng sướng.",
      },
      {
        name: "Hải Yến",
        rating: 4.6,
        text: "Mua tặng bạn trai, phối đồ công sở rất ổn.",
      },
      {
        name: "Hữu Dũng",
        rating: 4.8,
        text: "Cắt dây dễ, đeo cả ngày không bị cộm. Đáng tiền.",
      },
    ],
    related: accessoriesMale
      .filter((x) =>
        ["6", "7", "8", "9", "10", "11", "12", "13"].includes(x.id)
      )
      .map((x) => ({ id: x.id, name: x.name, price: x.price, img: x.img })),
  },
  // Phụ kiện nam: id "13"
  13: {
    id: "13",
    name: am["13"].name,
    price: am["13"].price,
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Thắt Lưng Nam Khoá Cài Kim Loại Viền Vuông với mặt khoá vuông vức hiện đại, dây da bền đẹp. Phù hợp phối đồ công sở lẫn thường ngày, tôn vẻ lịch lãm và gọn gàng.",
    hero: asset("13.webp"),
    images: [
      asset("13.1.webp"),
      asset("13.2.webp"),
      asset("13.3.webp"),
      asset("13.4.webp"),
    ],
    shipping: commonShipping,
    info: [
      "Mặt khoá kim loại tạo hình viền vuông sang trọng, chắc chắn.",
      "Dây da bền, hạn chế xước; giữ form quần tốt cả ngày.",
      "Dễ phối với sơ mi/quần tây hoặc outfit smart-casual.",
    ],
    policy: [
      {
        title: "Điều kiện đổi trả",
        lines: [
          "Còn tem mác, mặt khoá không trầy, dây chưa cắt/chỉnh.",
          "Đổi/hoàn trong 7 ngày kể từ ngày nhận hàng.",
        ],
      },
      {
        title: "Hướng dẫn",
        lines: ["Liên hệ CSKH để nhận hướng dẫn và địa chỉ gửi đổi trả."],
      },
    ],
    reviews: [
      {
        name: "Hoàng Phúc",
        rating: 4.7,
        text: "Mặt khoá vuông nhìn rất đứng, phối vest đẹp.",
      },
      {
        name: "Anh Minh",
        rating: 4.6,
        text: "Dây da dày dặn, cài vào chắc. Màu lên tay sang.",
      },
      {
        name: "Tuấn Kiệt",
        rating: 4.8,
        text: "Form chuẩn, cắt dây vừa eo dễ. Rất đáng mua.",
      },
    ],
    related: accessoriesMale
      .filter((x) =>
        ["6", "7", "8", "9", "10", "11", "12", "13"].includes(x.id)
      )
      .map((x) => ({ id: x.id, name: x.name, price: x.price, img: x.img })),
  },
  // Phụ kiện nữ: id "14"
  14: {
    id: "14",
    name: af["14"]?.name || "Túi Xách Nữ Công Sở",
    price: af["14"]?.price || "1.800.000₫",
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Túi xách nữ công sở kiểu dáng thanh lịch, chất liệu da PU cao cấp, màu thanh nhã dễ phối đồ. Ngăn chứa rộng rãi, phù hợp đi làm, đi họp hay dự tiệc nhẹ.",
    hero: asset("14.webp"),
    images: [
      asset("14.1.webp"),
      asset("14.2.webp"),
      asset("14.3.webp"),
      asset("14.4.webp"),
    ],
    shipping: commonShipping,
    info: [
      "Da PU cao cấp bền đẹp, dễ vệ sinh, ít bám bẩn.",
      "Nhiều ngăn tiện lợi để ví, điện thoại, đồ make-up nhỏ.",
      "Khoá kim loại chắc chắn, quai đeo êm, mang lâu không đau vai.",
    ],
    policy: [
      {
        title: "Điều kiện đổi trả",
        lines: [
          "Sản phẩm còn tem mác, phụ kiện đầy đủ, chưa trầy xước.",
          "Đổi trong 7 ngày kể từ ngày nhận hàng.",
        ],
      },
      {
        title: "Hướng dẫn",
        lines: ["Liên hệ CSKH để nhận hướng dẫn đổi trả chi tiết."],
      },
    ],
    reviews: [
      {
        name: "Khánh Linh",
        rating: 4.8,
        text: "Túi đẹp, ngăn rộng, đi làm để đồ rất gọn gàng.",
      },
      {
        name: "Mai Hương",
        rating: 4.7,
        text: "Màu xinh, da mịn tay, khoá chắc chắn.",
      },
      {
        name: "Thu Hà",
        rating: 4.6,
        text: "Phối đồ công sở hợp, mang cả ngày không mỏi.",
      },
    ],
    // Ưu tiên gợi ý 15 trước, sau đó một số phụ kiện nam
    related: [
      ...(af["15"]
        ? [
            {
              id: "15",
              name: af["15"].name,
              price: af["15"].price,
              img: af["15"].img,
            },
          ]
        : []),
      ...accessoriesMale
        .filter((x) =>
          ["6", "7", "8", "9", "10", "11", "12", "13"].includes(x.id)
        )
        .map((x) => ({ id: x.id, name: x.name, price: x.price, img: x.img })),
    ],
  },
  // Phụ kiện nữ: id "15"
  15: {
    id: "15",
    name: af["15"]?.name || "Túi Xách Nữ Da PU Cao Cấp",
    price: af["15"]?.price || "1.368.000₫",
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Túi xách nữ da PU cao cấp, phom nhỏ gọn tinh tế với dây xích sang trọng. Phù hợp dạo phố và các sự kiện nhẹ, tôn vẻ nữ tính và hiện đại.",
    hero: asset("15.webp"),
    images: [
      asset("15.1.webp"),
      asset("15.2.webp"),
      asset("15.3.webp"),
      asset("15.4.webp"),
      asset("15.5.webp"),
    ],
    shipping: commonShipping,
    info: [
      "Da PU mềm, cứng cáp vừa đủ để giữ phom đẹp.",
      "Dây đeo xích tạo điểm nhấn, dễ phối váy áo.",
      "Ngăn chính gọn gàng, phù hợp đồ essential khi ra ngoài.",
    ],
    policy: [
      {
        title: "Điều kiện đổi trả",
        lines: [
          "Còn tem mác, bề mặt không trầy xước, phụ kiện đầy đủ.",
          "Đổi/hoàn trong 7 ngày kể từ khi nhận hàng.",
        ],
      },
      {
        title: "Hướng dẫn",
        lines: ["Liên hệ CSKH để được hỗ trợ xử lý đổi/hoàn."],
      },
    ],
    reviews: [
      {
        name: "Bích Ngọc",
        rating: 4.7,
        text: "Túi xinh, dây xích nổi bật, mang lên rất sang.",
      },
      {
        name: "Tú Anh",
        rating: 4.6,
        text: "Chất da ok, phối váy đi tiệc hợp.",
      },
      {
        name: "Diệu My",
        rating: 4.8,
        text: "Phom chuẩn, khoá mượt. Đáng mua!",
      },
    ],
    related: [
      ...(af["14"]
        ? [
            {
              id: "14",
              name: af["14"].name,
              price: af["14"].price,
              img: af["14"].img,
            },
          ]
        : []),
      ...accessoriesMale
        .filter((x) =>
          ["6", "7", "8", "9", "10", "11", "12", "13"].includes(x.id)
        )
        .map((x) => ({ id: x.id, name: x.name, price: x.price, img: x.img })),
    ],
  },
  // MEN: id "16"
  16: {
    id: "16",
    name: mc["16"].name,
    price: mc["16"].price,
    status: "Còn hàng",
    sku: "ND0040",
    desc: "Áo len polo nam cộc tay mang lại sự thoải mái và thời trang. Dệt từ sợi mềm, thoáng, phù hợp đi làm hoặc dạo phố.",
    hero: asset("16.webp"),
    images: [
      asset("16.1.webp"),
      asset("16.2.webp"),
      asset("16.3.webp"),
      asset("16.4.webp"),
      asset("16.5.webp"),
    ],
    shipping: commonShipping,
    info: [
      "Chất liệu len pha cotton mềm, thấm hút tốt, dễ chịu cả ngày.",
      "Form regular gọn gàng, cổ polo lịch sự dễ phối đồ.",
      "Phù hợp đi làm, gặp gỡ bạn bè hoặc du lịch.",
    ],
    policy: [
      {
        title: "Điều kiện đổi trả",
        lines: [
          "Còn tem mác, chưa qua sử dụng",
          "Đổi trong 7 ngày kể từ nhận hàng",
        ],
      },
    ],
    reviews: [
      {
        name: "Hữu Long",
        rating: 4.7,
        text: "Áo mát, dệt đẹp, mặc đi làm rất lịch sự.",
      },
      { name: "Ngọc Duy", rating: 4.6, text: "Màu dễ mặc, giặt máy không xù." },
    ],
    related: ["17", "18", "19"].map((id) => ({
      id,
      name: mc[id].name,
      price: mc[id].price,
      img: mc[id].img,
    })),
  },
  // MEN: id "17"
  17: {
    id: "17",
    name: mc["17"].name,
    price: mc["17"].price,
    status: "Còn hàng",
    sku: "ND0030",
    desc: "Áo sơ mi nam cotton dài tay dáng regular 100% cotton mềm mại, thoáng mát, thích hợp mặc cả ngày.",
    hero: asset("17.webp"),
    images: [
      asset("17.1.webp"),
      asset("17.2.webp"),
      asset("17.3.webp"),
      asset("17.4.webp"),
      asset("17.5.webp"),
    ],
    shipping: commonShipping,
    info: [
      "Cotton cao cấp thấm hút mồ hôi tốt.",
      "Form regular vừa vặn, giữ vẻ gọn gàng lịch sự.",
      "Dễ phối với quần âu, chinos hay jeans.",
    ],
    policy: [
      {
        title: "Điều kiện đổi trả",
        lines: [
          "Còn tem mác, chưa qua sử dụng",
          "Đổi trong 7 ngày kể từ nhận hàng",
        ],
      },
    ],
    reviews: [
      {
        name: "Tuấn Anh",
        rating: 4.8,
        text: "Vải mịn và mát, đi làm cả ngày rất ổn.",
      },
      {
        name: "Quốc Huy",
        rating: 4.6,
        text: "Màu xanh nhạt dễ mặc, form đẹp.",
      },
    ],
    related: ["16", "18", "19"].map((id) => ({
      id,
      name: mc[id].name,
      price: mc[id].price,
      img: mc[id].img,
    })),
  },
  // MEN: id "18"
  18: {
    id: "18",
    name: mc["18"].name,
    price: mc["18"].price,
    status: "Còn hàng",
    sku: "ND0021",
    desc: "Áo sơ mi nam dài tay dáng suông form regular, chất vải cotton mềm mại, thoáng, tôn vẻ thanh lịch.",
    hero: asset("18.webp"),
    images: [asset("18.1.webp"), asset("18.2.webp")],
    shipping: commonShipping,
    info: [
      "Dáng suông vừa vặn, không quá ôm, di chuyển thoải mái.",
      "Phù hợp công sở, gặp gỡ bạn bè hay dự tiệc nhẹ.",
    ],
    policy: [
      {
        title: "Điều kiện đổi trả",
        lines: [
          "Còn tem mác, chưa qua sử dụng",
          "Đổi trong 7 ngày kể từ nhận hàng",
        ],
      },
    ],
    reviews: [
      {
        name: "Lâm Phát",
        rating: 4.7,
        text: "Form suông đẹp, may chắc tay, đáng tiền.",
      },
    ],
    related: ["16", "17", "19"].map((id) => ({
      id,
      name: mc[id].name,
      price: mc[id].price,
      img: mc[id].img,
    })),
  },
  // MEN: id "19"
  19: {
    id: "19",
    name: mc["19"].name,
    price: mc["19"].price,
    status: "Còn hàng",
    sku: "XBS",
    desc: "Áo sơ mi nam dài tay dáng suông – phong cách lịch lãm, chất liệu cotton mềm, thấm hút mồ hôi tốt.",
    hero: asset("19.webp"),
    images: [asset("19.1.webp"), asset("19.2.webp")],
    shipping: commonShipping,
    info: [
      "Màu sắc thanh lịch dễ phối, tôn vẻ trang nhã.",
      "Thiết kế không bó sát, thoải mái suốt ngày dài.",
    ],
    policy: [
      {
        title: "Điều kiện đổi trả",
        lines: [
          "Còn tem mác, chưa qua sử dụng",
          "Đổi trong 7 ngày kể từ nhận hàng",
        ],
      },
    ],
    reviews: [
      {
        name: "Gia Bảo",
        rating: 4.7,
        text: "Áo đẹp, chất mát, mặc lên gọn gàng.",
      },
    ],
    related: ["16", "17", "18"].map((id) => ({
      id,
      name: mc[id].name,
      price: mc[id].price,
      img: mc[id].img,
    })),
  },
  // Bổ sung nhanh các id 2-5 (tạm thời chỉ có ảnh hero)
  2: {
    id: "2",
    name: wc["2"].name,
    price: wc["2"].price,
    status: "Còn hàng",
    sku: "ND0091",
    desc: "Váy liền nữ làm từ vải line nhẹ nhàng, thoáng mát, với thiết kế cổ tim thanh lịch và phần eo chun co giãn ôm nhẹ cơ thể, tôn lên dáng vẻ nữ tính. Kiểu dáng sát nách mát mẻ, phù hợp cho mùa hè, dễ dàng phối hợp với các phụ kiện, lý tưởng cho các dịp dạo phố, hẹn hò hoặc đi làm.",
    hero: asset("2.webp"),
    images: [
      asset("2.1.webp"),
      asset("2.2.webp"),
      asset("2.3.webp"),
      asset("2.4.webp"),
    ],
    shipping: commonShipping,
    related: womenCollection
      .filter((w) => ["1", "3", "4", "5"].includes(w.id))
      .map((w) => ({ id: w.id, name: w.name, price: w.price, img: w.img })),
  },
  3: {
    id: "3",
    name: wc["3"].name,
    price: wc["3"].price,
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Áo len gilet nữ cổ tim dệt thừng mang đến phong cách thanh lịch và nữ tính. Chất liệu acrylic mềm nhẹ giúp giữ ấm tốt mà vẫn thoải mái, phù hợp những ngày se lạnh. Thiết kế cổ tim và chi tiết dệt thừng dễ dàng kết hợp với nhiều loại trang phục, từ sơ mi đến đầm, giúp bạn tự tin và nổi bật trong mọi dịp.",
    hero: asset("3.webp"),
    images: [
      asset("3.1.webp"),
      asset("3.2.webp"),
      asset("3.3.wepp.jpg"),
      asset("3.4.webp"),
    ],
    shipping: commonShipping,
    related: womenCollection
      .filter((w) => ["1", "2", "4", "5"].includes(w.id))
      .map((w) => ({ id: w.id, name: w.name, price: w.price, img: w.img })),
  },
  4: {
    id: "4",
    name: wc["4"].name,
    price: wc["4"].price,
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Váy liền nữ dáng A tay lỡ, chất liệu dệt kim dày dặn, co dãn tốt tạo cảm giác thoải mái và tôn dáng. Thiết kế thanh lịch, phù hợp cho nhiều dịp, mang đến sự dễ chịu suốt cả ngày mà vẫn giữ được vẻ nữ tính.",
    hero: asset("4.webp"),
    images: [
      asset("4.1.webp"),
      asset("4.2.webp"),
      asset("4.3.webp"),
      asset("4.4.webp"),
      asset("4.5.webp"),
    ],
    shipping: commonShipping,
    related: womenCollection
      .filter((w) => ["1", "2", "3", "5"].includes(w.id))
      .map((w) => ({ id: w.id, name: w.name, price: w.price, img: w.img })),
  },
  5: {
    id: "5",
    name: wc["5"].name,
    price: wc["5"].price,
    status: "Còn hàng",
    sku: "ND0090",
    desc: "Váy liền chất liệu tweed 100% polyester có lót, thiết kế dáng fit & flare nữ tính, ôm vừa vặn phần trên và xòe nhẹ ở dưới. Cổ vuông thanh lịch kết hợp với hai dây mảnh mang lại vẻ đẹp tinh tế và duyên dáng. Lót mềm mại giúp trang phục thoải mái và không bị xuyên thấu, phù hợp cho các dịp dạo phố, hẹn hò hay đi làm.",
    hero: asset("5.webp"),
    images: [
      asset("5.1.webp"),
      asset("5.2.webp"),
      asset("5.3.webp"),
      asset("5.4.webp"),
      asset("5.5.webp"),
    ],
    shipping: commonShipping,
    related: womenCollection
      .filter((w) => ["1", "2", "3", "4"].includes(w.id))
      .map((w) => ({ id: w.id, name: w.name, price: w.price, img: w.img })),
  },
  20: {
    id: "20",
    name: st["20"]?.name || "Quần Jeans Nam Slim Denim Like Cơ Bản ND006",
    price: st["20"]?.price || "Liên hệ",
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Quần co giãn nhẹ, chất liệu denim like mềm mại, dễ chịu giúp bạn thoải mái vận động cả ngày dài. Được nhuộm màu tươi sáng từ vải mộc trắng, sản phẩm có nhiều màu sắc đa dạng, dễ dàng kết hợp với nhiều phong cách thời trang.",
    hero: asset("20.webp"),
    images: [asset("20.1.webp"), asset("20.2.webp"), asset("20.3.webp")],
    shipping: commonShipping,
    related: ["21", "22", "23"].map((k) => ({
      id: k,
      name: st[k]?.name,
      price: st[k]?.price,
      img: st[k]?.img,
    })),
  },
  21: {
    id: "21",
    name: st["21"]?.name || "Quần Jeans Nam Slim Denim Like Cơ Bản",
    price: st["21"]?.price || "680.000₫",
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Quần co giãn nhẹ, chất liệu denim like mềm mại, thoáng mát, thiết kế ôm nhẹ tạo sự gọn gàng. Dễ phối đồ đi làm, dạo phố hay vận động thể thao.",
    hero: asset("21.webp"),
    images: [
      asset("21.1.webp"),
      asset("21.2.webp"),
      asset("21.3.webp"),
      asset("21.4.webp"),
      asset("21.5.webp"),
    ],
    shipping: commonShipping,
    related: ["20", "22", "23"].map((k) => ({
      id: k,
      name: st[k]?.name,
      price: st[k]?.price,
      img: st[k]?.img,
    })),
  },
  22: {
    id: "22",
    name: st["22"]?.name || "Quần Dài Nữ Dáng Suông",
    price: st["22"]?.price || "680.000₫",
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Quần dài nữ dáng suông chất liệu mềm mát, mang đến cảm giác thoải mái khi mặc. Thiết kế độ rộng vừa phải phù hợp công sở và dạo phố.",
    hero: asset("22.webp"),
    images: [
      asset("22.1.webp"),
      asset("22.2.webp"),
      asset("22.3.webp"),
      asset("22.4.webp"),
      asset("22.5.webp"),
    ],
    shipping: commonShipping,
    related: ["23", "24", "21"].map((k) => ({
      id: k,
      name: st[k]?.name,
      price: st[k]?.price,
      img: st[k]?.img,
    })),
  },
  23: {
    id: "23",
    name: st["23"]?.name || "Quần Jeans Nữ Dáng Crop",
    price: st["23"]?.price || "780.000₫",
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Quần jeans nữ dáng crop tôn dáng, chi tiết cào rách nhẹ tạo điểm nhấn thời trang. Phù hợp sử dụng quanh năm, mang đến vẻ trẻ trung và năng động.",
    hero: asset("23.webp"),
    images: [asset("23.1.webp"), asset("23.2.webp"), asset("23.3.webp")],
    shipping: commonShipping,
    related: ["22", "24", "21"].map((k) => ({
      id: k,
      name: st[k]?.name,
      price: st[k]?.price,
      img: st[k]?.img,
    })),
  },
  24: {
    id: "24",
    name: st["24"]?.name || "Quần Jeans 5 Túi Siêu Co Giãn",
    price: st["24"]?.price || "680.000₫",
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Quần jeans 5 túi siêu co giãn ôm gọn, form dáng đẹp tôn dáng, phù hợp phối nhiều kiểu áo và giày. Chất liệu thoải mái, thích hợp cho phong cách trẻ trung.",
    hero: asset("24.webp"),
    images: [asset("24.1.webp")],
    shipping: commonShipping,
    related: ["23", "21", "22"].map((k) => ({
      id: k,
      name: st[k]?.name,
      price: st[k]?.price,
      img: st[k]?.img,
    })),
  },
  // 28 → 32: Giá tốt
  28: {
    id: "28",
    name: "Áo Len Nữ Cộc Tay Dáng Rộng",
    price: "680.000₫",
    status: "Hết hàng",
    sku: "Đang cập nhật",
    desc: "Áo len nữ cộc tay dáng rộng – lựa chọn hoàn hảo cho ngày giao mùa, chất liệu viscose mềm mại, thoáng khí, dễ phối với nhiều trang phục từ quần jeans đến chân váy.",
    hero: asset("28.webp"),
    images: [
      asset("28.1.webp"),
      asset("28.2.webp"),
      asset("28.3.webp"),
      asset("28.4.webp"),
    ],
    shipping: commonShipping,
    related: [
      {
        id: "29",
        name: "Áo polo nam ND005",
        price: "499.000₫",
        img: asset("29.webp"),
      },
      {
        id: "30",
        name: "Áo dạ len Tết nữ, cổ xẻ V cách điệu, vai chồm",
        price: "468.000₫",
        img: asset("30.webp"),
      },
      {
        id: "31",
        name: "Váy ren nữ cotton dáng babydoll",
        price: "480.000₫",
        img: asset("31.webp"),
      },
    ],
  },
  29: {
    id: "29",
    name: "Áo polo nam ND005",
    price: "499.000₫",
    status: "Còn hàng",
    sku: "ND0050",
    desc: "Áo polo basic cổ bẻ và nẹp cài cúc mang phong cách đơn giản, thanh lịch, dễ phối đồ, phù hợp nhiều hoàn cảnh.",
    hero: asset("29.webp"),
    images: [asset("29.1.webp"), asset("29.2.webp"), asset("29.3.webp")],
    shipping: commonShipping,
    related: [
      {
        id: "28",
        name: "Áo Len Nữ Cộc Tay Dáng Rộng",
        price: "680.000₫",
        img: asset("28.webp"),
      },
      {
        id: "30",
        name: "Áo dạ len Tết nữ, cổ xẻ V cách điệu, vai chồm",
        price: "468.000₫",
        img: asset("30.webp"),
      },
      {
        id: "32",
        name: "Áo Nỉ Nữ Oversize Cắt Bổ Tinh Tế",
        price: "486.000₫",
        img: asset("32.webp"),
      },
    ],
  },
  30: {
    id: "30",
    name: "Áo dạ len Tết nữ, cổ xẻ V cách điệu, vai chồm",
    price: "468.000₫",
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Áo dạ len pha mềm mại, giữ ấm tốt; thiết kế cổ xẻ V tôn dáng, vai chồm duyên dáng, hợp mặc dịp Tết và đi tiệc.",
    hero: asset("30.webp"),
    images: [
      asset("30.1.webp"),
      asset("30.2.webp"),
      asset("30.3.webp"),
      asset("30.4.webp"),
      asset("30.5.webp"),
    ],
    shipping: commonShipping,
    related: [
      {
        id: "28",
        name: "Áo Len Nữ Cộc Tay Dáng Rộng",
        price: "680.000₫",
        img: asset("28.webp"),
      },
      {
        id: "31",
        name: "Váy ren nữ cotton dáng babydoll",
        price: "480.000₫",
        img: asset("31.webp"),
      },
      {
        id: "32",
        name: "Áo Nỉ Nữ Oversize Cắt Bổ Tinh Tế",
        price: "486.000₫",
        img: asset("32.webp"),
      },
    ],
  },
  31: {
    id: "31",
    name: "Váy ren nữ cotton dáng babydoll",
    price: "480.000₫",
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Đầm ren cotton phom rộng, thoáng mát; họa tiết ren thêu nhẹ nhàng, nữ tính, phù hợp dạo phố và gặp gỡ bạn bè.",
    hero: asset("31.webp"),
    images: [
      asset("31.1.webp"),
      asset("31.2.webp"),
      asset("31.3.webp"),
      asset("31.4.webp"),
    ],
    shipping: commonShipping,
    related: [
      {
        id: "28",
        name: "Áo Len Nữ Cộc Tay Dáng Rộng",
        price: "680.000₫",
        img: asset("28.webp"),
      },
      {
        id: "30",
        name: "Áo dạ len Tết nữ, cổ xẻ V cách điệu, vai chồm",
        price: "468.000₫",
        img: asset("30.webp"),
      },
      {
        id: "32",
        name: "Áo Nỉ Nữ Oversize Cắt Bổ Tinh Tế",
        price: "486.000₫",
        img: asset("32.webp"),
      },
    ],
  },
  32: {
    id: "32",
    name: "Áo Nỉ Nữ Oversize Cắt Bổ Tinh Tế",
    price: "486.000₫",
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Áo nỉ oversize thiết kế đơn giản hiện đại, chi tiết cắt bổ tinh tế, dễ phối cho nhiều dịp, phong cách năng động.",
    hero: asset("32.webp"),
    images: [
      asset("32.1.webp"),
      asset("32.2.webp"),
      asset("32.3.webp"),
      asset("32.4.webp"),
      asset("32.5.webp"),
    ],
    shipping: commonShipping,
    related: ["29", "30", "31"].map((k) => ({
      id: k,
      name: sb[k]?.name || `Sản phẩm ${k}`,
      price: sb[k]?.price || "",
      img: sb[k]?.img || asset(`${k}.webp`),
    })),
  },
  25: {
    id: "25",
    name: st["25"]?.name || "Quần Dài Nữ Dáng Suông Chất Liệu Mềm Mát",
    price: st["25"]?.price || "368.000₫",
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Quần dài nữ dáng suông được làm từ chất liệu mềm mại, mát mẻ, mang lại sự thoải mái tối đa. Thiết kế rộng rãi vừa phải, phù hợp cho môi trường văn phòng và các sự kiện trang trọng.",
    hero: asset("25.webp"),
    images: [
      asset("25.1.webp"),
      asset("25.2.webp"),
      asset("25.3.webp"),
      asset("25.4.webp"),
    ],
    shipping: commonShipping,
    related: ["22", "23", "24"].map((k) => ({
      id: k,
      name: st[k]?.name,
      price: st[k]?.price,
      img: st[k]?.img,
    })),
  },
  26: {
    id: "26",
    name: st["26"]?.name || "Quần jeans nam phom slimfit",
    price: st["26"]?.price || "860.000₫",
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Quần jeans nam slimfit với phom ôm nhẹ, thoải mái từ đùi đến ống quần, tôn dáng mà không gò bó. Vải jeans dày dặn, giữ form tốt và dễ phối nhiều trang phục.",
    hero: asset("26.webp"),
    images: [
      asset("26.1.webp"),
      asset("26.2.webp"),
      asset("26.3.webp"),
      asset("26.4.webp"),
      asset("26.5.webp"),
    ],
    shipping: commonShipping,
    related: ["27", "21", "23"].map((k) => ({
      id: k,
      name: st[k]?.name,
      price: st[k]?.price,
      img: st[k]?.img,
    })),
  },
  27: {
    id: "27",
    name: st["27"]?.name || "Quần Jeans Đen Slimfit 5 Túi",
    price: st["27"]?.price || "860.000₫",
    status: "Còn hàng",
    sku: "Đang cập nhật",
    desc: "Quần jeans đen slimfit 5 túi, phom ôm gọn tôn dáng, chất liệu bền bỉ dễ phối đồ. Thiết kế basic phù hợp mọi dịp từ đi làm đến đi chơi.",
    hero: asset("27.webp"),
    images: [asset("27.1.webp"), asset("27.2.webp")],
    shipping: commonShipping,
    related: ["26", "21", "23"].map((k) => ({
      id: k,
      name: st[k]?.name,
      price: st[k]?.price,
      img: st[k]?.img,
    })),
  },
  33: {
    id: "33",
    name: "Ao Khoac Da Lon Nam 2 Lop",
    price: "1.860.000₫",
    status: "Con hang",
    sku: "Dang cap nhat",
    desc: "Ao khoac da lon mem mai, chan bong giu nhiet, thiet ke 2 lop tre trung, de phoi do.",
    hero: asset("33.webp"),
    images: [
      asset("33.1.webp"),
      asset("33.2.webp"),
      asset("33.3.webp"),
      asset("33.4.webp"),
      asset("33.5.webp"),
    ],
    shipping: commonShipping,
    related: [
      {
        id: "34",
        name: "Ao polo nam ND008",
        price: "450.000₫",
        img: asset("34.webp"),
      },
      {
        id: "35",
        name: "Vay lien nu dang dai, phoi mau",
        price: "628.000₫",
        img: asset("35.webp"),
      },
      {
        id: "36",
        name: "Ao Ni Nu Phoi La Co Dang Relax",
        price: "568.000₫",
        img: asset("36.webp"),
      },
    ],
  },
  34: {
    id: "34",
    name: "Ao polo nam ND008",
    price: "450.000₫",
    status: "Con hang",
    sku: "ND008",
    desc: "Ao polo co be, nep cai cuc, vai mem thoang, de phoi jeans/chinos.",
    hero: asset("34.webp"),
    images: [
      asset("34.1.webp"),
      asset("34.2.webp"),
      asset("34.3.webp"),
      asset("34.4.webp"),
      asset("34.5.webp"),
    ],
    shipping: commonShipping,
    related: [
      {
        id: "33",
        name: "Ao Khoac Da Lon Nam 2 Lop",
        price: "1.860.000₫",
        img: asset("33.webp"),
      },
      {
        id: "35",
        name: "Vay lien nu dang dai, phoi mau",
        price: "628.000₫",
        img: asset("35.webp"),
      },
      {
        id: "36",
        name: "Ao Ni Nu Phoi La Co Dang Relax",
        price: "568.000₫",
        img: asset("36.webp"),
      },
    ],
  },
  35: {
    id: "35",
    name: "Vay lien nu dang dai, phoi mau",
    price: "628.000₫",
    status: "Con hang",
    sku: "Dang cap nhat",
    desc: "Vay ni mem, phong rong thoai mai, khoa keo co tien loi, phoi mau tinh te.",
    hero: asset("35.webp"),
    images: [
      asset("35.1.webp"),
      asset("35.2.webp"),
      asset("35.3.webp"),
      asset("35.4.webp"),
    ],
    shipping: commonShipping,
    related: [
      {
        id: "33",
        name: "Ao Khoac Da Lon Nam 2 Lop",
        price: "1.860.000₫",
        img: asset("33.webp"),
      },
      {
        id: "34",
        name: "Ao polo nam ND008",
        price: "450.000₫",
        img: asset("34.webp"),
      },
      {
        id: "36",
        name: "Ao Ni Nu Phoi La Co Dang Relax",
        price: "568.000₫",
        img: asset("36.webp"),
      },
    ],
  },
  36: {
    id: "36",
    name: "Ao Ni Nu Phoi La Co Dang Relax",
    price: "568.000₫",
    status: "Con hang",
    sku: "Dang cap nhat",
    desc: "Ao ni pho i la co, chat lieu am ap thoang khi, de phoi do hang ngay.",
    hero: asset("36.webp"),
    images: [
      asset("36.1.webp"),
      asset("36.2.webp"),
      asset("36.3.webp"),
      asset("36.4.webp"),
    ],
    shipping: commonShipping,
    related: [
      {
        id: "33",
        name: "Ao Khoac Da Lon Nam 2 Lop",
        price: "1.860.000₫",
        img: asset("33.webp"),
      },
      {
        id: "34",
        name: "Ao polo nam ND008",
        price: "450.000₫",
        img: asset("34.webp"),
      },
      {
        id: "35",
        name: "Vay lien nu dang dai, phoi mau",
        price: "628.000₫",
        img: asset("35.webp"),
      },
    ],
  },
};

export default productDetails;
