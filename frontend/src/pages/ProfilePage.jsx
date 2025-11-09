import React from "react";

export default function ProfilePage(){
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Hồ Sơ Của Tôi</h2>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-28 text-gray-600">Tên đăng nhập</label>
              <div className="text-gray-800 font-medium">xuangan27030108</div>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-28 text-gray-600">Tên</label>
              <input className="flex-1 border rounded px-3 py-2" defaultValue="Vũ Thị Tuyết" />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-28 text-gray-600">Email</label>
              <div className="flex-1">xu*********@gmail.com <button className="text-sm text-primary ml-3">Thay Đổi</button></div>
            </div>

            <div className="flex items-start gap-4">
              <label className="w-28 text-gray-600">Giới tính</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2"><input type="radio" name="g" defaultChecked/> Nữ</label>
                <label className="flex items-center gap-2"><input type="radio" name="g" /> Nam</label>
                <label className="flex items-center gap-2"><input type="radio" name="g" /> Khác</label>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-28 text-gray-600">Ngày sinh</label>
              <div className="flex-1">**/**/1982 <button className="text-sm text-primary ml-3">Thay Đổi</button></div>
            </div>

            <div className="pt-2">
              <button className="bg-primary text-white px-5 py-2 rounded shadow">Lưu</button>
            </div>
          </div>
        </div>

        <aside className="col-span-4">
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-green-700 text-white flex items-center justify-center font-bold text-xl">N</div>
              <div>
                <div className="font-medium">Vũ Thị Tuyết</div>
                <div className="text-sm text-gray-500">(+84) 379 976 689</div>
              </div>
            </div>
            <div>
              <input type="file" className="hidden" id="avatar" />
              <label htmlFor="avatar" className="inline-block border px-4 py-2 rounded cursor-pointer">Chọn Ảnh</label>
              <p className="text-xs text-gray-400 mt-1">Dung lượng tối đa 1MB. Định dạng: JPEG, PNG.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
