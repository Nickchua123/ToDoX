Giới Thiệu

ToDoX: Ứng dụng quản lý công việc theo dự án, chia sẻ theo quyền, có Pomodoro và realtime.

Tính năng:
Đăng ký xác thực email (OTP), đăng nhập, quên/đặt lại mật khẩu.
Dự án: tạo/đổi tên/xóa; mô tả/ghi chú; chia sẻ theo quyền (editor/viewer).
Công việc: thêm/sửa/trạng thái; phân theo dự án; thống kê Pomodoro.
Realtime (SSE): tự cập nhật danh sách task khi có thành viên khác thao tác.
Bảo mật: CSRF cookie, Helmet (CSP), rate limit, xss-clean, express-mongo-sanitize, JWT cookie.

Công Nghệ

Backend: Node.js, Express, MongoDB (Mongoose), csurf, helmet, rate-limit, nodemailer.
Frontend: React + Vite, Tailwind, Radix UI, lucide-react, sonner, axios.
Realtime: Server-Sent Events (SSE).

API Ghi chú

- Địa chỉ người dùng hỗ trợ endpoint `PUT /api/addresses/:id/default` để đặt địa chỉ mặc định cho tài khoản hiện tại.
- Đánh giá sản phẩm: người dùng chỉ có thể đánh giá khi đơn hàng đã ở trạng thái `delivered`. Admin có endpoints `/api/reviews/admin/all`, `/api/reviews/:id/approve`, `/api/reviews/:id/hide` để duyệt/ẩn đánh giá.

Cấu Trúc Thư Mục

backend/: API Express, model, controller, middleware, router.
frontend/: React + Vite, components, pages, lib, build.
Runtime:
Backend serve frontend/dist (kể cả khi NODE_ENV=development nếu tồn tại dist).

Yêu Cầu Môi Trường

Node.js 18+ (khuyên dùng 20+), npm.
Tài khoản MongoDB Atlas.
SMTP (nếu dùng email OTP/đặt lại mật khẩu): Gmail App Password hoặc SMTP khác.

Admin Mặc Định

Để tự tạo một tài khoản admin khi server khởi động, thêm các biến sau vào `backend/.env`:

- `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD` (mật khẩu phải ≥12 ký tự, có chữ hoa, số và ký tự đặc biệt).
- Sau khi tài khoản được seed, thêm email đó vào `ADMIN_EMAILS` để middleware `requireAdmin` nhận diện quyền admin.

Đặt hàng yêu cầu cung cấp `addressId` (địa chỉ nhận hàng) khi gọi `POST /api/orders`.
