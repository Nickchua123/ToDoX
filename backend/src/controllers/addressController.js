import mongoose from "mongoose";
import Address from "../models/Address.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.userId }).sort({
      isDefault: -1,
      updatedAt: -1,
    });
    res.json(addresses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không lấy được địa chỉ", error: err.message });
  }
};

export const createAddress = async (req, res) => {
  try {
    const {
      label,
      line1,
      line2,
      city,
      district,
      ward,
      phone,
      isDefault,
      provinceId,
      districtId,
      wardCode,
      provinceName,
      districtName,
      wardName,
    } = req.body || {};
    if (!line1 || !city || !district || !ward || !phone) {
      return res.status(400).json({ message: "Thiếu thông tin địa chỉ" });
    }
    if (isDefault) {
      await Address.updateMany(
        { user: req.userId, isDefault: true },
        { isDefault: false }
      );
    }
    const address = await Address.create({
      user: req.userId,
      label: label || "Nhà riêng",
      line1,
      line2,
      city,
      district,
      ward,
      phone,
      isDefault: Boolean(isDefault),
      provinceId,
      districtId,
      wardCode,
      provinceName,
      districtName,
      wardName,
    });
    res.status(201).json(address);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không tạo được địa chỉ", error: err.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "ID không hợp lệ" });
    const update = { ...req.body };
    if (update.isDefault) {
      await Address.updateMany(
        { user: req.userId, isDefault: true },
        { isDefault: false }
      );
    }
    const address = await Address.findOneAndUpdate(
      { _id: id, user: req.userId },
      update,
      { new: true }
    );
    if (!address)
      return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
    res.json(address);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không cập nhật được địa chỉ", error: err.message });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "ID không hợp lệ" });

    const address = await Address.findOne({ _id: id, user: req.userId });
    if (!address)
      return res.status(404).json({ message: "Không tìm thấy địa chỉ" });

    await Address.updateMany(
      { user: req.userId, isDefault: true },
      { isDefault: false }
    );

    address.isDefault = true;
    await address.save();

    res.json({ message: "Đã đặt làm địa chỉ mặc định", address });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không đặt được địa chỉ mặc định", error: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "ID không hợp lệ" });
    const removed = await Address.findOneAndDelete({
      _id: id,
      user: req.userId,
    });
    if (!removed)
      return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
    res.json({ message: "Đã xóa địa chỉ" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không xóa được địa chỉ", error: err.message });
  }
};
