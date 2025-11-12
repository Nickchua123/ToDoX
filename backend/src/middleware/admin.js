import User from "../models/User.js";

const parseAdminEmails = () =>
  String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

const getAdminEmailSet = () => new Set(parseAdminEmails());
const allowedRoles = new Set(["admin", "staff"]);

export const isAdminUser = async (userId) => {
  if (!userId) return false;
  const adminEmails = getAdminEmailSet();
  const user = await User.findById(userId).select("email role");
  if (!user) return false;
  if (allowedRoles.has(user.role)) return true;
  if (adminEmails.size > 0) {
    return adminEmails.has(String(user.email || "").toLowerCase());
  }
  return false;
};

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Cần đăng nhập" });
    }

    const adminEmails = getAdminEmailSet();

    const user = await User.findById(req.userId).select("email name role");
    if (!user) {
      return res.status(401).json({ message: "Không tìm thấy người dùng" });
    }

    const email = String(user.email || "").toLowerCase();
    if (!allowedRoles.has(user.role) && !(adminEmails.size > 0 && adminEmails.has(email))) {
      return res.status(403).json({ message: "Chỉ admin mới được phép" });
    }

    req.adminUser = user;
    req.isAdmin = true;
    return next();
  } catch (err) {
    return res.status(500).json({ message: "Không xác thực được admin", error: err.message });
  }
};
