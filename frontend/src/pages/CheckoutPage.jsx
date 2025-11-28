// src/pages/CheckoutPage.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  fetchCart,
  clearCart as clearCartApi,
} from "@/services/cartService";
import api from "@/lib/axios";
import { prepareCsrfHeaders } from "@/lib/csrf";
import { toast } from "sonner";
import { getGhnFee, getGhnServices } from "@/services/shippingService";
import { validateCoupon } from "@/services/couponService";

const currency = (v) =>
  Number(v || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

const normalizeTimestamp = (value) => {
  if (!value && value !== 0) return null;
  const num = Number(value);
  if (!Number.isNaN(num)) {
    return num > 1e12 ? num : num * 1000;
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const formatLeadTime = (value) => {
  const normalized = normalizeTimestamp(value);
  if (!normalized) return null;
  try {
    return new Date(normalized).toLocaleDateString("vi-VN");
  } catch {
    return null;
  }
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState({ cart: null, subtotal: 0 });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [shippingPackage, setShippingPackage] = useState({
    weight: 0,
    length: 30,
    width: 20,
    height: 10,
  });
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cartRes, addrRes] = await Promise.all([
        fetchCart(),
        api.get("/addresses"),
      ]);
      setCartData(cartRes);
      setAddresses(addrRes.data || []);
      const defaultAddress =
        addrRes.data?.find((addr) => addr.isDefault) || addrRes.data?.[0];
      setSelectedAddress(defaultAddress?._id || "");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Không thể tải dữ liệu checkout.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const items = useMemo(() => cartData.cart?.items || [], [cartData]);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const productPrice = Number(item.product?.price ?? 0);
        const variantDelta = Number(item.variant?.priceDelta ?? 0);
        return sum + (productPrice + variantDelta) * Number(item.quantity || 0);
      }, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (!items.length || !appliedCoupon) return 0;
    const pct = Number(appliedCoupon.discountPercent) || 0;
    return Math.round((subtotal * pct) / 100);
  }, [appliedCoupon, subtotal, items.length]);

  const total = useMemo(
    () => subtotal - discount + shippingFee,
    [subtotal, discount, shippingFee]
  );
  const selectedAddressObj = useMemo(
    () => addresses.find((addr) => addr._id === selectedAddress),
    [addresses, selectedAddress]
  );
  const getServiceLabel = (service) => {
    const map = {
      2: "Nhanh",
      3: "Tiết kiệm",
      4: "Chuẩn",
      5: "Tiết kiệm",
      6: "Đồng giá",
      7: "Quốc tế",
    };
    return (
      map?.[Number(service?.service_type_id)] ||
      service?.short_name ||
      service?.service_name ||
      "Dịch vụ GHN"
    );
  };
  const getExpectedLabel = (service, checked) => {
    const source =
      (checked && selectedService?.expected_delivery_time) ||
      service?.expected_delivery_time ||
      service?.leadtime;
    const label = formatLeadTime(source);
    return label || "Liên hệ";
  };

  const handlePlaceOrder = async () => {
    if (!items.length) {
      toast.error("Giỏ hàng của bạn đang trống.");
      return;
    }
    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }
    let redirected = false;
    try {
      setPlacingOrder(true);
      const headers = await prepareCsrfHeaders();
      const shippingPayload =
        selectedService &&
        selectedAddressObj?.districtId &&
        selectedAddressObj?.wardCode
          ? {
              provider: "ghn",
              selection: {
                serviceId: selectedService.service_id,
                service_id: selectedService.service_id,
                serviceTypeId: selectedService.service_type_id,
                service_type_id: selectedService.service_type_id,
                serviceName:
                  selectedService.short_name || selectedService.service_name,
                serviceCode: selectedService.service_code,
                short_name: selectedService.short_name,
                toDistrictId: selectedAddressObj.districtId,
                toWardCode: selectedAddressObj.wardCode,
                expected_delivery_time:
                  selectedService.expected_delivery_time ||
                  selectedService.leadtime,
                fee: shippingFee,
                receiverPhone: selectedAddressObj.phone,
              },
              package: shippingPackage,
            }
          : null;
      const { data: order } = await api.post(
        "/orders",
        {
          items: items.map((item) => ({
            productId: item.product?._id || item.product,
            quantity: item.quantity,
            variant: item.variant?._id || item.variant,
            options: item.options || {},
          })),
          addressId: selectedAddress,
          notes,
          shippingFee,
          discount,
          ...(appliedCoupon ? { couponCode: appliedCoupon.code } : {}),
          paymentMethod: selectedPayment,
          ...(shippingPayload ? { shipping: shippingPayload } : {}),
        },
        { headers }
      );
      if (selectedPayment === "vnpay") {
        const { data } = await api.post(
          "/payments/vnpay/create",
          { orderId: order?._id },
          { headers }
        );
        if (!data?.paymentUrl) {
          throw new Error("Không nhận được liên kết thanh toán");
        }
        await clearCartApi();
        redirected = true;
        window.location.href = data.paymentUrl;
        return;
      }
      await clearCartApi();
      toast.success("Đặt hàng thành công!");
      navigate("/orders");
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Đặt hàng thất bại.";
      toast.error(message);
    } finally {
      if (!redirected) {
        setPlacingOrder(false);
      }
    }
  };

  const handleApplyCoupon = async () => {
    const trimmed = coupon.trim();
    if (!trimmed) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }
    if (!items.length) {
      toast.error("Giỏ hàng trống");
      return;
    }
    setApplyingCoupon(true);
    try {
      const headers = await prepareCsrfHeaders();
      const data = await validateCoupon(trimmed, { headers });
      if (!data?.code || data.discountPercent == null) {
        throw new Error("Không nhận được dữ liệu mã giảm giá");
      }
      const normalizedCode = String(data.code).trim().toUpperCase();
      setCoupon(normalizedCode);
      setAppliedCoupon({
        code: normalizedCode,
        discountPercent: Number(data.discountPercent) || 0,
      });
      toast.success(`Đã áp dụng mã ${normalizedCode} (-${data.discountPercent}%)`);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Mã giảm giá không hợp lệ";
      toast.error(msg);
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const totalItems = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const estimatePackage = useCallback(() => {
    const quantity = totalItems || 1;
    const weight = Math.max(300, quantity * 400);
    return {
      weight,
      length: 30,
      width: 20,
      height: Math.max(10, Math.round(quantity * 5)),
    };
  }, [totalItems]);

  const fetchShippingQuote = useCallback(
    async (address, preferredServiceId) => {
      if (!address?.districtId || !address?.wardCode) {
        setShippingOptions([]);
        setSelectedService(null);
        setShippingFee(0);
        setShippingError(
          "Địa chỉ chưa có mã quận/huyện hoặc phường/xã. Vui lòng cập nhật địa chỉ."
        );
        return;
      }
      if (!items.length) {
        setShippingOptions([]);
        setSelectedService(null);
        setShippingFee(0);
        return;
      }
      const pkg = estimatePackage();
      setShippingPackage(pkg);
      setShippingLoading(true);
      setShippingError("");
      try {
        const services = await getGhnServices({
          toDistrictId: address.districtId,
        });
        if (!Array.isArray(services) || services.length === 0) {
          setShippingOptions([]);
          setSelectedService(null);
          setShippingFee(0);
          setShippingError("Không có dịch vụ GHN phù hợp tại khu vực này.");
          return;
        }

        // Tính phí cho từng gói để hiển thị đầy đủ
        const feeResults = await Promise.all(
          services.map(async (service) => {
            try {
              const feeRes = await getGhnFee({
                service_type_id: service.service_type_id,
                service_id: service.service_id,
                to_district_id: address.districtId,
                to_ward_code: address.wardCode,
                weight: pkg.weight,
                length: pkg.length,
                width: pkg.width,
                height: pkg.height,
              });
              const feeValue = Number(
                feeRes?.total ??
                  feeRes?.total_fee ??
                  feeRes?.service_fee ??
                  feeRes?.data?.total ??
                  0
              );
              const expectedTime = normalizeTimestamp(
                feeRes?.expected_delivery_time ||
                  feeRes?.leadtime ||
                  service.leadtime
              );
              return {
                serviceId: service.service_id,
                fee: feeValue,
                expectedTime,
              };
            } catch (err) {
              return {
                serviceId: service.service_id,
                error:
                  err?.response?.data?.message ||
                  err?.message ||
                  "Không tính được phí",
              };
            }
          })
        );

        const enriched = services.map((service) => {
          const feeInfo = feeResults.find(
            (f) => String(f.serviceId) === String(service.service_id)
          );
          return {
            ...service,
            _fee: feeInfo?.fee,
            _feeError: feeInfo?.error,
            expected_delivery_time: feeInfo?.expectedTime || service.leadtime,
          };
        });

        setShippingOptions(enriched);

        // Chọn gói ưu tiên có phí, nếu không lấy gói đầu tiên
        const preferred = enriched.find(
          (service) =>
            preferredServiceId &&
            String(service.service_id) === String(preferredServiceId) &&
            typeof service._fee === "number"
        );
        const fallback = enriched.find(
          (service) => typeof service._fee === "number"
        );
        const chosen = preferred || fallback || enriched[0];

        if (chosen && typeof chosen._fee === "number") {
          setShippingFee(chosen._fee);
          const expectedTime = normalizeTimestamp(
            chosen.expected_delivery_time
          );
          setSelectedService({
            ...chosen,
            fee: chosen._fee,
            expected_delivery_time: expectedTime,
          });
          setShippingError("");
        } else {
          setSelectedService(chosen || null);
          setShippingFee(0);
          setShippingError(
            "Không tính được phí cho các gói GHN. Vui lòng thử lại."
          );
        }
      } catch (err) {
        console.error(err);
        setShippingOptions([]);
        setSelectedService(null);
        setShippingFee(0);
        setShippingError(
          err?.response?.data?.message || "Không tính được phí giao hàng."
        );
      } finally {
        setShippingLoading(false);
      }
    },
    [estimatePackage, items.length]
  );

  useEffect(() => {
    if (selectedAddressObj && items.length) {
      fetchShippingQuote(selectedAddressObj);
    } else {
      setShippingOptions([]);
      setSelectedService(null);
      setShippingFee(0);
      setShippingError("");
    }
  }, [selectedAddressObj, items.length, fetchShippingQuote]);

  const handleServiceChange = (serviceId) => {
    if (!selectedAddressObj) return;
    fetchShippingQuote(selectedAddressObj, serviceId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-10 px-6 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white rounded-xl p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-[#0b84a5] mb-6">
              DL Shop
            </h1>

            {loading ? (
              <div className="text-center py-16 text-gray-500">
                Đang tải thông tin thanh toán...
              </div>
            ) : !items.length ? (
              <div className="text-center py-16">
                <div className="text-xl font-semibold text-gray-700">
                  Chưa có sản phẩm để thanh toán
                </div>
                <p className="text-gray-500 mt-1">
                  Hãy quay lại cửa hàng và thêm sản phẩm vào giỏ.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 rounded-md border"
                    type="button"
                  >
                    ← Quay lại
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 rounded-md bg-[#0b84a5] text-white hover:brightness-95"
                    type="button"
                  >
                    Về trang chủ
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-4">
                  Chọn địa chỉ giao hàng
                </h2>
                {addresses.length ? (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr._id}
                        className="flex items-start gap-3 border rounded-lg p-4 cursor-pointer hover:border-sky-400 transition relative"
                      >
                        <input
                          type="radio"
                          name="address"
                          className="mt-1"
                          checked={selectedAddress === addr._id}
                          onChange={() => setSelectedAddress(addr._id)}
                        />
                        <div>
                          <div className="font-medium">
                            {addr.label} • {addr.phone}
                          </div>
                          <div className="text-sm text-gray-600">
                            {addr.line1}
                            {addr.line2 ? `, ${addr.line2}` : ""},{" "}
                            {addr.wardName || addr.ward},{" "}
                            {addr.districtName || addr.district},{" "}
                            {addr.city || addr.provinceName || ""}
                          </div>
                          {addr.isDefault ? (
                            <span className="text-xs text-sky-600">
                              Mặc định
                            </span>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/account/address?edit=${addr._id}`);
                          }}
                          className="absolute top-3 right-3 text-xs text-sky-600 hover:text-sky-700 underline-offset-2 hover:underline"
                        >
                          Sửa
                        </button>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Bạn chưa có địa chỉ nào. Hãy thêm trong phần Tài khoản.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">
                      Phương thức giao hàng
                    </h2>
                    {shippingLoading ? (
                      <div className="p-4 rounded-md border border-dashed text-sm text-gray-500">
                        Đang tính phí vận chuyển...
                      </div>
                    ) : shippingError ? (
                      <div className="p-4 rounded-md border border-rose-200 bg-rose-50 text-rose-700 text-sm">
                        {shippingError}
                      </div>
                    ) : shippingOptions.length ? (
                      <div className="space-y-3">
                        {shippingOptions.map((option) => {
                          const checked =
                            selectedService &&
                            String(selectedService.service_id) ===
                              String(option.service_id);
                          return (
                            <label
                              key={option.service_id}
                              className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer ${
                                checked
                                  ? "border-sky-500 bg-sky-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <input
                                type="radio"
                                name="shipping"
                                checked={checked}
                                onChange={() =>
                                  handleServiceChange(option.service_id)
                                }
                              />
                              <div className="flex-1">
                          <div className="font-medium">
                                {getServiceLabel(option)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Dự kiến:{" "}
                                {getExpectedLabel(option, checked)}
                              </div>
                            </div>
                              <div className="font-semibold text-sm min-w-[90px] text-right">
                                {typeof option._fee === "number"
                                  ? currency(option._fee)
                                  : "~"}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 rounded-md border border-dashed text-sm text-gray-500">
                        Hãy chọn địa chỉ có quận/huyện và phường/xã hợp lệ để
                        tính phí vận chuyển.
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold mb-4">Thanh toán</h2>
                    <div className="border rounded-md divide-y">
                      <label className="flex items-center gap-3 p-4">
                        <input
                          type="radio"
                          name="pay"
                          checked={selectedPayment === "cod"}
                          onChange={() => setSelectedPayment("cod")}
                        />
                        <div className="flex-1">
                          <div className="font-medium">Thu hộ (COD)</div>
                          <div className="text-sm text-gray-500">
                            Thanh toán khi nhận hàng
                          </div>
                        </div>
                        <div className="text-xl">📦</div>
                      </label>

                      <label className="flex items-center gap-3 p-4">
                        <input
                          type="radio"
                          name="pay"
                          checked={selectedPayment === "vnpay"}
                          onChange={() => setSelectedPayment("vnpay")}
                        />
                        <div className="flex-1">
                          <div className="font-medium">VNPAY (QR/Thẻ)</div>
                          <div className="text-sm text-gray-500">
                            Chuyển đến cổng VNPAY để thanh toán an toàn
                          </div>
                        </div>
                        <div className="text-xl">💳</div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">Ghi chú</h2>
                  <textarea
                    className="w-full rounded-md border px-4 py-3"
                    rows={3}
                    placeholder="Ví dụ: giao giờ hành chính..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg">
                  Đơn hàng ({totalItems} sản phẩm)
                </h3>

                <div className="mt-4 space-y-4 max-h-56 overflow-auto pr-2">
                  {items.length ? (
                    items.map((item) => (
                      <div
                        key={item._id || item.id}
                        className="flex items-center gap-3 border rounded-md p-3"
                      >
                        <img
                          src={
                            item.product?.images?.[0] ||
                            item.product?.image ||
                            "/logo.png"
                          }
                          alt={item.product?.name}
                          className="w-14 h-14 rounded-md object-cover bg-gray-100"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {item.product?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.variant?.label
                              ? `Biến thể: ${item.variant.label} • `
                              : ""}
                            SL: {item.quantity}
                          </div>
                        </div>
                        <div className="text-sm w-24 text-right">
                          {currency(
                            (Number(item.product?.price ?? 0) +
                              Number(item.variant?.priceDelta ?? 0)) *
                              Number(item.quantity || 0)
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">
                      Không có sản phẩm nào.
                    </div>
                  )}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleApplyCoupon();
                  }}
                  className="mt-4 flex gap-3"
                >
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 border rounded-md px-3 py-2"
                    disabled={!items.length}
                  />
                  <button
                    className="px-4 py-2 rounded-md bg-sky-600 text-white hover:brightness-90 disabled:opacity-50"
                    disabled={!items.length || applyingCoupon}
                  >
                    {applyingCoupon ? "Đang áp dụng..." : "Áp dụng"}
                  </button>
                </form>
                {appliedCoupon ? (
                  <div className="text-xs text-green-700 mt-1">
                    Đã áp dụng {appliedCoupon.code} (-{appliedCoupon.discountPercent}%)
                  </div>
                ) : null}

                <div className="mt-5 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span>{currency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giảm giá</span>
                    <span className="text-red-600">-{currency(discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span>
                      {shippingFee === 0 ? "-" : currency(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-2 border-t">
                    <span>Tổng cộng</span>
                    <span>{currency(total)}</span>
                  </div>

                  <div className="border-top pt-3 mt-2 border-t flex justify-between items-end">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="text-sky-600 underline"
                    >
                      ‹ Quay lại
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="bg-[#0b84a5] hover:brightness-95 text-white px-6 py-3 rounded-md shadow-md disabled:opacity-50"
                      disabled={!items.length || placingOrder}
                    >
                      {placingOrder ? "Đang xử lý..." : "ĐẶT HÀNG"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
