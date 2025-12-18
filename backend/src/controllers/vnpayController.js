import { randomUUID } from "crypto";
import { VNPay, ProductCode, VnpLocale, dateFormat } from "vnpay";
import Order from "../models/Order.js";

// ==================== CẤU HÌNH & HỖ TRỢ ====================

const SECURE_HASH_TYPE = "SHA512";

const ensureConfig = () => {
  const {
    VNPAY_TMN_CODE,
    VNPAY_HASH_SECRET,
    VNPAY_BASE_URL,
    VNPAY_RETURN_URL,
  } = process.env;

  if (
    !VNPAY_TMN_CODE?.trim() ||
    !VNPAY_HASH_SECRET?.trim() ||
    !VNPAY_BASE_URL?.trim() ||
    !VNPAY_RETURN_URL?.trim()
  ) {
    throw new Error("Thiếu cấu hình VNPAY trong file .env");
  }

  return {
    VNPAY_TMN_CODE,
    VNPAY_HASH_SECRET,
    VNPAY_BASE_URL,
    VNPAY_RETURN_URL,
  };
};

const maskSecret = (value = "") => {
  if (!value) return "<empty>";
  if (value.length <= 8) return `${value.slice(0, 2)}***${value.slice(-2)}`;
  return `${value.slice(0, 4)}***${value.slice(-4)} (len=${value.length})`;
};

const logDebug = (...args) => {
  const enabled =
    String(process.env.VNPAY_DEBUG || "").toLowerCase() === "true";
  if (!enabled) return;
  console.log("[VNPAY]", ...args);
};

const formatDate = (date = new Date()) =>
  date.toISOString().replace(/[-:T]/g, "").slice(0, 14);

const normalizeIp = (ip = "") => {
  if (!ip) return "127.0.0.1";
  const trimmed = ip.trim();
  if (trimmed === "::1") return "127.0.0.1";
  if (trimmed.startsWith("::ffff:")) {
    const maybeIpv4 = trimmed.slice("::ffff:".length);
    if (maybeIpv4 === "127.0.0.1") return "127.0.0.1";
  }
  return trimmed;
};

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const first = forwarded.split(",").map((s) => s.trim())[0];
    return normalizeIp(first);
  }
  const raw =
    req.ip ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    "127.0.0.1";
  return normalizeIp(raw);
};

// Tạo txnRef duy nhất
const generateTxnRef = (orderId) => `${orderId}-${randomUUID()}`;

const createVnpayClient = () => {
  const { VNPAY_TMN_CODE, VNPAY_HASH_SECRET, VNPAY_BASE_URL } = ensureConfig();
  const parsed = new URL(VNPAY_BASE_URL);
  const paymentEndpoint =
    parsed.pathname.replace(/^\/+/, "") || "paymentv2/vpcpay.html";
  return new VNPay({
    tmnCode: VNPAY_TMN_CODE,
    secureSecret: VNPAY_HASH_SECRET,
    vnpayHost: `${parsed.protocol}//${parsed.host}`,
    hashAlgorithm: SECURE_HASH_TYPE,
    testMode: process.env.NODE_ENV !== "production",
    endpoints: {
      paymentEndpoint,
    },
  });
};

// ==================== TẠO LINK THANH TOÁN ====================

export const createVnpayPayment = async (req, res) => {
  try {
    const { orderId, bankCode } = req.body || {};
    if (!orderId) {
      return res.status(400).json({ message: "Thiếu orderId" });
    }

    const order = await Order.findOne({ _id: orderId, user: req.userId });
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra tổng tiền
    const total = Math.round(Number(order.total));
    if (!Number.isFinite(total) || total <= 0) {
      return res.status(400).json({ message: "Tổng tiền không hợp lệ" });
    }

    const {
      VNPAY_TMN_CODE,
      VNPAY_HASH_SECRET,
      VNPAY_BASE_URL,
      VNPAY_RETURN_URL,
    } = ensureConfig();
    logDebug("env", {
      tmnCode: VNPAY_TMN_CODE,
      baseUrl: VNPAY_BASE_URL,
      returnUrl: VNPAY_RETURN_URL,
      hashSecret: maskSecret(VNPAY_HASH_SECRET),
    });

    const vnpayClient = createVnpayClient();

    // Ngăn tạo nhiều link thanh toán
    if (order.paymentRef) {
      return res
        .status(409)
        .json({ message: "Đơn hàng đã có giao dịch thanh toán" });
    }

    const txnRef = generateTxnRef(order._id);

    const params = {
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `Thanh toan don hang ${order._id}`,
      vnp_OrderType: ProductCode.Other,
      vnp_Amount: total,
      vnp_ReturnUrl: `${VNPAY_RETURN_URL}?orderId=${order._id}`,
      vnp_IpAddr: getClientIp(req),
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date(), "yyyyMMddHHmmss"),
    };

    // Chỉ thêm bankCode nếu có giá trị hợp lệ
    const trimmedBankCode = typeof bankCode === "string" ? bankCode.trim() : "";
    if (trimmedBankCode) {
      params.vnp_BankCode = trimmedBankCode;
    }

    const paymentUrl = vnpayClient.buildPaymentUrl(params);
    logDebug("create payload", params);

    // Lưu tạm thông tin thanh toán
    order.paymentMethod = "vnpay";
    order.paymentRef = txnRef;
    await order.save();

    logDebug("create url", paymentUrl);

    res.json({
      paymentUrl,
      transactionRef: txnRef,
    });
  } catch (err) {
    console.error("[VNPAY:create] Lỗi:", err);
    res.status(500).json({ message: "Không tạo được liên kết thanh toán" });
  }
};

// ==================== XÁC THỰC KẾT QUẢ TRẢ VỀ ====================

export const verifyVnpayReturn = async (req, res) => {
  try {
    const { VNPAY_HASH_SECRET } = ensureConfig();
    logDebug("verify env hash", maskSecret(VNPAY_HASH_SECRET));

    const vnpayClient = createVnpayClient();
    const { orderId: injectedOrderId, ...vnPayQuery } = req.query;
    const verification = vnpayClient.verifyReturnUrl(vnPayQuery, {
      withHash: true,
    });
    logDebug("verify result", verification);

    if (!verification.isVerified) {
      return res.status(400).json({
        isValid: false,
        message: verification.message || "Chữ ký không hợp lệ",
        details: verification,
      });
    }

    const txnRef = verification.vnp_TxnRef;
    const orderId = injectedOrderId || txnRef?.split("-")[0];
    if (!orderId) {
      return res.status(400).json({ message: "Không xác định được đơn hàng" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Nếu đã thanh toán rồi → không xử lý lại
    if (order.isPaid) {
      return res.json({
        isValid: true,
        success: true,
        orderId: order._id,
        message: "Đơn hàng đã được thanh toán trước đó",
      });
    }

    const responseCode = verification.vnp_ResponseCode;
    const transactionStatus = verification.vnp_ResponseCode;
    const success = Boolean(verification.isSuccess);

    if (success) {
      // Cập nhật nguyên tử để tránh race condition
      const result = await Order.updateOne(
        { _id: orderId, isPaid: false },
        {
          $set: {
            isPaid: true,
            paymentMethod: "vnpay",
            paymentRef: txnRef,
            paidAt: new Date(),
            status: order.status === "pending" ? "processing" : order.status,
          },
        }
      );

      if (result.modifiedCount === 0) {
        return res.json({
          isValid: true,
          success: false,
          message: "Đơn hàng đã được xử lý trước đó",
        });
      }
    }

    res.json({
      isValid: true,
      success,
      orderId,
      amount: verification.vnp_Amount,
      responseCode,
      message: success ? "Thanh toán thành công" : "Thanh toán thất bại",
    });
  } catch (err) {
    console.error("[VNPAY:return] Lỗi:", err);
    res.status(500).json({ message: "Không xác thực được giao dịch" });
  }
};
