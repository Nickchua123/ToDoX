import bcrypt from "bcryptjs";
import User from "../models/User.js";

const isStrongPassword = (pwd) => {
  const s = String(pwd || "");
  if (s.length < 12) return false;
  return /[A-Z]/.test(s) && /\d/.test(s) && /[^A-Za-z0-9]/.test(s);
};

export const seedAdminUser = async () => {
  const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const name = String(process.env.ADMIN_NAME || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !name || !password) {
    return;
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`[ADMIN:seed] User ${email} already exists, skipping.`);
      return;
    }

    if (!isStrongPassword(password)) {
      console.error(
        "[ADMIN:seed] ADMIN_PASSWORD phải dài >= 12 ký tự, có chữ hoa, số và ký tự đặc biệt."
      );
      return;
    }

    const hashed = await bcrypt.hash(String(password), 10);
    await User.create({
      name,
      email,
      password: hashed,
    });

    console.log(
      `[ADMIN:seed] Đã tạo admin mặc định cho ${email}. Hãy thêm email này vào ADMIN_EMAILS để bật quyền admin.`
    );
  } catch (err) {
    console.error("[ADMIN:seed] Không thể tạo admin mặc định:", err);
  }
};
