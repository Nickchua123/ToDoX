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
* Xác thực: JWT, Refresh Token, OTP
* Thiết kế và viết code frontend

## Hướng dẫn sử dụng

### 1) Thiết lập môi trường

- Cài Node.js 18+ và npm.
- Tạo file `backend/.env`
  MONGODB_CONNECTIONSTRING=mongodb+srv://dungphamthe363_db_user:mgaVQH1BntGD3QOv@cluster0.iqd32x3.mongodb.net/?appName=Cluster0
  PORT=5001
  NODE_ENV=development
  JWT_SECRET=79c561ff37f17cea1a45135ac63b27e18b9769f38a36fc96771937ee34b8fd9c4c7fb04036a9d5e755e989961226777268d9b0f2e12e83f80f265e6e07767a21
  REFRESH_JWT_SECRET=675ab5326e0f31ede730f35fc180851e8ae2df230a3ac7d5c1c8bc3e2d45be74d9883f97b07e906bcabbb5856157ea60ace49220b5cb5ceef14b8ba55e6e1177
  TURNSTILE_SECRET_KEY=0x4AAAAAAB6q1ERjpXuNVYN-JUXYy11yAaQ
  FRONTEND_URL=http://localhost:5173
  RESEND_API_KEY=re_FpNxbKwa_QJ3ZWZU27DcJiTQnN1GtXgjx
  RESEND_FROM="Dung Dev <support@thedung.name.vn>"
  CORS_ORIGINS=https://thedung.name.vn
  ACCESS_TOKEN_TTL=15m
  REFRESH_TOKEN_TTL=7d
  ADMIN_EMAILS=dungphamthe333@gmail.com
  CLOUDINARY_CLOUD_NAME=dtgfrvf70
  CLOUDINARY_API_KEY=624616533795947
  CLOUDINARY_API_SECRET=eW3K77ZcI0fNiZ9z_Q6lY3m7TYw
  VNPAY_TMN_CODE=JJZBFJFQ
  VNPAY_HASH_SECRET=J4MX3W7B1DVP529EDJPBC1VNI9Q590U0
  VNPAY_BASE_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
  VNPAY_RETURN_URL=http://localhost:5173/payment-result
  GHN_API_BASE=https://dev-online-gateway.ghn.vn/shiip/public-api
  GHN_TOKEN=41a585b2-c05d-11f0-a51e-f64be07fcf0a
  GHN_SHOP_ID=198109
  GHN_FROM_NAME=DungLuu
  GHN_FROM_PHONE=0862197540
  GHN_FROM_ADDRESS=235 Hoàng Quốc Việt, Cổ Nhuế, Bắc Từ Liêm, Hà Nội, Vietnam
  GHN_FROM_DISTRICT_ID=1482
  GHN_FROM_WARD_CODE=11001  
  ACCOUNT_DELETE_DELAY_DAYS=7
  ACCOUNT_DELETE_JOB_INTERVAL_MINUTES=60

- Tạo file `frontend/.env`
  VITE_API_BASE_URL=http://localhost:5001/api
  VITE_TURNSTILE_SITE_KEY=0x4AAAAAAB6q1CZoebWflS-L

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
