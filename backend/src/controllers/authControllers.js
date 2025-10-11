import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed });
    res.status(201).json({ message: "Đăng ký thành công", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    // console.log("🟡 FE gửi:", req.body); // kiểm tra dữ liệu FE gửi lên

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log("🟢 User trong DB:", user); // kiểm tra user tìm thấy trong DB

    if (!user) return res.status(400).json({ message: "Tài khoản không tồn tại" });

    const valid = await bcrypt.compare(password, user.password);
    // console.log("🔵 Kết quả so sánh bcrypt:", valid); // kiểm tra so sánh hash

    if (!valid) return res.status(401).json({ message: "Sai mật khẩu" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Đăng nhập thành công", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống", error: err.message });
  }
};


export const profile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    res.status(200).json(user);
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Đã đăng xuất" });
};
