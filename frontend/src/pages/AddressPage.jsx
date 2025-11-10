import React from "react";

const DemoAddress = {
  name: "VÅ© Thá»‹ Tuyáº¿t",
  phone: "(+84) 379 976 689",
  detail: "Cáº§u Cá»‘ng ThÃ³c - xÃ³m 1, XÃ£ Thá»¥y TrÃ¬nh, Huyá»‡n ThÃ¡i Thá»¥y, ThÃ¡i BÃ¬nh"
};

export default function AddressPage(){
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Äá»‹a chá»‰ cá»§a tÃ´i</h2>

      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">{DemoAddress.name} <span className="text-gray-400 text-sm">{DemoAddress.phone}</span></div>
            <div className="text-gray-600 mt-2">{DemoAddress.detail}</div>
            <div className="mt-3">
              <span className="inline-block px-2 py-1 text-sm border rounded text-primary border-primary">Máº·c Ä‘á»‹nh</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button className="text-sm text-primary">Cáº­p nháº­t</button>
            <button className="text-sm text-red-500">XÃ³a</button>
            <button className="bg-gray-100 px-3 py-2 rounded text-sm">Thiáº¿t láº­p máº·c Ä‘á»‹nh</button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button className="bg-primary text-white px-4 py-2 rounded">+ ThÃªm Ä‘á»‹a chá»‰ má»›i</button>
      </div>
    </div>
  );
}

