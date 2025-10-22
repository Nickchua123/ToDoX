// backend/src/middleware/auth.js
import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies?.access_token || req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Bạn cần đăng nhập" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};


