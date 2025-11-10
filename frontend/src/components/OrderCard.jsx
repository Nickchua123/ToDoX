import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OrderCard({ order }) {
  return (
    <Card className="rounded-xl border shadow-sm mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-sm text-gray-700">{order.shopName}</p>
            <div className="flex gap-3 mt-3">
              <img src={order.image} alt="" className="w-20 h-20 object-cover rounded-md" />
              <div>
                <p className="font-medium text-sm">{order.productName}</p>
                <p className="text-gray-500 text-xs">PhÃ¢n loáº¡i: {order.variant}</p>
                <p className="text-gray-500 text-xs">x{order.quantity}</p>
              </div>
            </div>
          </div>
          <p className="text-[#ff6347] font-semibold">{order.status === "completed" ? "HOÃ€N THÃ€NH" : order.status.toUpperCase()}</p>
        </div>
        <div className="flex justify-end items-center gap-4 mt-3">
          <span className="text-sm">ThÃ nh tiá»n: <b className="text-[#ff6347]">{order.total.toLocaleString()}â‚«</b></span>
          <Button variant="outline" size="sm" className="border-[#ff6347] text-[#ff6347] hover:bg-[#ff6347] hover:text-white transition-all">
            Mua Láº¡i
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

