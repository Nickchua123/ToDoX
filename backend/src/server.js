import express from "express";
import taskRoute from "./routes/tasksRouters.js";
import authRoute from "./routes/authRouters.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const app = express();

// ===== Middlewares =====
app.use(express.json());
app.use(cookieParser());

// ✅ CORS (chỉ khai báo 1 lần thôi)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // cần để cookie hoạt động
  })
);

// ===== Routes =====
app.use("/api/auth", authRoute);
app.use("/api/tasks", taskRoute);

// ===== Serve frontend when in production =====
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// ===== Start server after connecting DB =====
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại cổng ${PORT}`);
  });
});
