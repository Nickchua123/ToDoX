import React from "react";

function Toggle({ label, defaultOn = true }) {
  return (
    <div className="flex items-center justify-between py-3 border-b">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-gray-500">MÃ´ táº£ nhá» vá» cÃ i Ä‘áº·t</div>
      </div>
      <div>
        <label className="inline-flex relative items-center cursor-pointer">
          <input
            type="checkbox"
            defaultChecked={defaultOn}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all relative"></div>
        </label>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">CÃ i Ä‘áº·t ThÃ´ng bÃ¡o</h2>

      <div className="bg-white rounded shadow max-w-3xl overflow-hidden">
        <div className="p-6">
          <h3 className="font-medium mb-3">Email thÃ´ng bÃ¡o</h3>
          <Toggle label="Cáº­p nháº­t Ä‘Æ¡n hÃ ng" defaultOn={true} />
          <Toggle label="Khuyáº¿n mÃ£i" defaultOn={false} />
          <Toggle label="Kháº£o sÃ¡t" defaultOn={true} />
        </div>

        <div className="p-6 border-t">
          <h3 className="font-medium mb-3">ThÃ´ng bÃ¡o SMS</h3>
          <Toggle label="Khuyáº¿n mÃ£i SMS" defaultOn={true} />
        </div>
      </div>
    </div>
  );
}

