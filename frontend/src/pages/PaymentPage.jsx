import React from "react";

export default function PaymentPage(){
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Tháº» TÃ­n Dá»¥ng/Ghi Ná»£ & TÃ i Khoáº£n NgÃ¢n HÃ ng</h2>
      <div className="space-y-8">
        <section className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Tháº» TÃ­n Dá»¥ng/Ghi Ná»£</h3>
            <button className="bg-primary text-white px-4 py-2 rounded">+ ThÃªm Tháº» Má»›i</button>
          </div>
          <div className="text-center text-gray-400 py-8">Báº¡n chÆ°a liÃªn káº¿t tháº».</div>
        </section>

        <section className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">TÃ i Khoáº£n NgÃ¢n HÃ ng Cá»§a TÃ´i</h3>
            <button className="bg-primary text-white px-4 py-2 rounded">+ ThÃªm NgÃ¢n HÃ ng LiÃªn Káº¿t</button>
          </div>
          <div className="text-center text-gray-400 py-8">Báº¡n chÆ°a cÃ³ tÃ i khoáº£n ngÃ¢n hÃ ng.</div>
        </section>
      </div>
    </div>
  );
}

