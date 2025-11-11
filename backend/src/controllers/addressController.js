import mongoose from "mongoose";
import Address from "../models/Address.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.userId }).sort({ isDefault: -1, updatedAt: -1 });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng láº¥y Ä‘Æ°á»£c Ä‘á»‹a chá»‰", error: err.message });
  }
};

export const createAddress = async (req, res) => {
  try {
    const { label, line1, line2, city, district, ward, phone, isDefault } = req.body || {};
    if (!line1 || !city || !district || !ward || !phone) {
      return res.status(400).json({ message: "Thiáº¿u thÃ´ng tin Ä‘á»‹a chá»‰" });
    }
    if (isDefault) {
      await Address.updateMany({ user: req.userId, isDefault: true }, { isDefault: false });
    }
    const address = await Address.create({
      user: req.userId,
      label: label || "NhÃ ",
      line1,
      line2,
      city,
      district,
      ward,
      phone,
      isDefault: Boolean(isDefault),
    });
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng táº¡o Ä‘Æ°á»£c Ä‘á»‹a chá»‰", error: err.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "ID khÃ´ng há»£p lá»‡" });
    const update = { ...req.body };
    if (update.isDefault) {
      await Address.updateMany({ user: req.userId, isDefault: true }, { isDefault: false });
    }
    const address = await Address.findOneAndUpdate({ _id: id, user: req.userId }, update, { new: true });
    if (!address) return res.status(404).json({ message: "KhÃ´ng tÃ¬m tháº¥y Ä‘á»‹a chá»‰" });
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng cáº­p nháº­t Ä‘Æ°á»£c Ä‘á»‹a chá»‰", error: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "ID khÃ´ng há»£p lá»‡" });
    const removed = await Address.findOneAndDelete({ _id: id, user: req.userId });
    if (!removed) return res.status(404).json({ message: "KhÃ´ng tÃ¬m tháº¥y Ä‘á»‹a chá»‰" });
    res.json({ message: "ÄÃ£ xÃ³a Ä‘á»‹a chá»‰" });
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng xÃ³a Ä‘Æ°á»£c Ä‘á»‹a chá»‰", error: err.message });
  }
};

