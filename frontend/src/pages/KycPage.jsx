import React from "react";

export default function KycPage(){
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">ThÃ´ng tin cÃ¡ nhÃ¢n (KYC)</h2>

      <div className="bg-white p-6 rounded shadow max-w-2xl">
        <p className="text-gray-600 mb-6">Báº¡n vui lÃ²ng nháº­p chÃ­nh xÃ¡c thÃ´ng tin CCCD Ä‘á»ƒ Ä‘Æ¡n hÃ ng Ä‘Æ°á»£c thÃ´ng quan theo quy Ä‘á»‹nh. ThÃ´ng tin sáº½ Ä‘Æ°á»£c báº£o máº­t.</p>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="w-36 text-gray-600">Há» vÃ  tÃªn</label>
            <input className="flex-1 border rounded px-3 py-2" placeholder="Há» vÃ  tÃªn Ä‘áº§y Ä‘á»§ trÃªn CCCD" />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-36 text-gray-600">Sá»‘ CCCD</label>
            <input className="flex-1 border rounded px-3 py-2" placeholder="Sá»‘ Ä‘á»‹nh danh cÃ¡ nhÃ¢n trÃªn CCCD" />
          </div>

          <div className="flex items-start gap-4">
            <label className="w-36 text-gray-600">Äá»‹a chá»‰</label>
            <textarea className="flex-1 border rounded px-3 py-2" rows="3" placeholder="Äá»‹a chá»‰ NÆ¡i thÆ°á»ng trÃº trÃªn CCCD"></textarea>
          </div>

          <div className="text-right">
            <button className="bg-primary text-white px-4 py-2 rounded opacity-90">XÃ¡c Nháº­n</button>
          </div>
        </div>
      </div>
    </div>
  );
}

