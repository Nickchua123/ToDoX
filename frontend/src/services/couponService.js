import api from "@/lib/axios";

export const validateCoupon = (code, config = {}) =>
  api
    .post(
      "/coupons/validate",
      { code },
      {
        ...config,
      }
    )
    .then((res) => res.data);
