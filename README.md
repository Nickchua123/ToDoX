## Giới thiệu tổng quan đề tài

Đề tài xây dựng một hệ thống thương mại điện tử theo mô hình full-stack, gồm frontend React và backend Node.js/Express. Ứng dụng hỗ trợ các nghiệp vụ: đăng ký/đăng nhập, quản lý danh mục và sản phẩm, giỏ hàng, đặt hàng, thanh toán, vận chuyển và khu vực quản trị. Hệ thống chú trọng bảo mật (JWT access/refresh, CSRF, Turnstile, CSP, chống XSS/NoSQL injection) và triển khai theo mô hình phục vụ chung FE/BE để vận hành thuận tiện.

## Công nghệ sử dụng

- Backend: Node.js, Express, MongoDB (Mongoose), csurf, helmet, express-rate-limit, bcryptjs
- Frontend: React + Vite, Tailwind CSS, Radix UI, axios, sonner

## Cấu trúc thư mục

- backend/: API Express, models, controllers, middleware, routes
- frontend/: React + Vite, components, pages, services, build
- Runtime: Backend serve frontend/dist (khi có build)

## Danh sách thành viên nhóm và phân chia công việc

Thành viên:

- Phạm Thế Dũng - 22810310437
- Phạm Văn Lưu - 22810310430

Phân công:

- Nhóm trưởng(Phạm Thế Dũng)

* Dữ liệu: DB Connection, Seeding
* Bảo vệ: CORS, CSP, XSS Filter, Rate Limit
* Xác thực: CSRF Token Endpoint
* Thiết kế và viết code backend

- Thành viên(Phạm Văn Lưu)

* Dữ liệu: User Schema, Validation
* Bảo vệ: Password Policy, Turnstile
* Xác thực: JWT, Refresh, Access Token, OTP
* Thiết kế và viết code frontend

## Hướng dẫn sử dụng

### 1) Thiết lập môi trường

- Cài Node.js 18+ và npm.
- Tạo file `backend/.env`
- Tạo file `frontend/.env`
 

### 2) Chạy dự án

- Backend:
  - `npm install --prefix backend`
  - `npm run dev --prefix backend`
- Frontend:
  - `npm install --prefix frontend`
  - `npm run dev --prefix frontend`
- Build/serve chung:
  - `npm run build` (root)
  - `npm run start` (root)

### 3) Tài khoản demo

- Admin

  - emailAdmin: dungphamthe333@gmail.com
  - passwordAdmin: AdminStrongPass123!

- User
  - email: dungphamthe363@gmail.com
  - password: StrongPass123!
