import User from "../models/User.js";

const parseAdminEmails = () =>
  String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

const getAdminEmailSet = () => new Set(parseAdminEmails());

export const isAdminUser = async (userId) => {
  const adminEmails = getAdminEmailSet();
  if (!userId || adminEmails.size === 0) return false;
  const user = await User.findById(userId).select("email");
  if (!user) return false;
  return adminEmails.has(String(user.email || "").toLowerCase());
};

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Cần đăng nhập" });
    }

    const adminEmails = getAdminEmailSet();
    if (adminEmails.size === 0) {
      return res.status(403).json({ message: "ADMIN_EMAILS chưa được cấu hình" });
    }

    const user = await User.findById(req.userId).select("email name");
    if (!user) {
      return res.status(401).json({ message: "Không tìm thấy người dùng" });
    }

    const email = String(user.email || "").toLowerCase();
    if (!adminEmails.has(email)) {
      return res.status(403).json({ message: "Chỉ admin mới được phép" });
    }

    req.adminUser = user;
    req.isAdmin = true;
    return next();
  } catch (err) {
    return res.status(500).json({ message: "Không xác thực được admin", error: err.message });
  }
};
