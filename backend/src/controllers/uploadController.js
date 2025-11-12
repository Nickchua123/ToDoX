import cloudinary from "../utils/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    const { image, folder = "todox" } = req.body || {};
    if (!image) {
      return res.status(400).json({ message: "Thiếu dữ liệu ảnh" });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder,
      resource_type: "auto",
    });

    return res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("[Upload] error:", err);
    return res.status(500).json({ message: "Không tải lên được ảnh" });
  }
};
