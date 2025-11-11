import Payment from "../models/Payment.js";

export const listPayments = async (req, res) => {
  try {
    const { status, method, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (method) query.method = method;
    const perPage = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * perPage;
    const [items, total] = await Promise.all([
      Payment.find(query).sort({ createdAt: -1 }).skip(skip).limit(perPage),
      Payment.countDocuments(query),
    ]);
    res.json({ total, page: Number(page) || 1, items });
  } catch (err) {
    res.status(500).json({ message: "Không lấy được thanh toán", error: err.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { method, provider, status = "pending", reference, amount } = req.body || {};
    if (!method || amount == null) {
      return res.status(400).json({ message: "Thiếu method hoặc amount" });
    }
    const payment = await Payment.create({ method, provider, status, reference, amount });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: "Không tạo được thanh toán", error: err.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) return res.status(404).json({ message: "Không tìm thấy thanh toán" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: "Không cập nhật được thanh toán", error: err.message });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: "Không tìm thấy thanh toán" });
    res.json({ message: "Đã xóa thanh toán" });
  } catch (err) {
    res.status(500).json({ message: "Không xóa được thanh toán", error: err.message });
  }
};
