import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useNavigate } from "react-router";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/auth/profile", { withCredentials: true });
      setUser(res.data);
    } catch (err) {
      console.error("Không thể tải hồ sơ", err);
      toast.error("Bạn cần đăng nhập trước!");
      navigate("/unauthorized");
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefcff] flex flex-col items-center pt-20">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Thông tin cá nhân</h2>
        <p>
          <strong>Tên:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <div className="mt-6">
          <p>
            <strong>Công việc đang làm:</strong> {user.activeCount}
          </p>
          <p>
            <strong>Đã hoàn thành:</strong> {user.completeCount}
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition"
        >
          Quay lại trang chính
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

