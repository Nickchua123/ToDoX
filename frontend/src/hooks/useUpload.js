import { useState } from "react";
import api from "@/lib/axios";
import { prepareCsrfHeaders } from "@/lib/csrf";
import { toast } from "sonner";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export function useUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file) => {
    if (!file) return null;
    try {
      setUploading(true);
      const base64 = await fileToBase64(file);
      const headers = await prepareCsrfHeaders();
      const { data } = await api.post(
        "/uploads",
        { image: base64 },
        { headers }
      );
      toast.success("Đã tải ảnh lên");
      return data?.url;
    } catch (err) {
      const message = err?.response?.data?.message || "Không tải được ảnh";
      toast.error(message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading };
}
