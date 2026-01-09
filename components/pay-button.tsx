"use client";

import { useTransition } from "react";
import { payOrder } from "@/lib/actions/payment";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function PayButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handlePay = () => {
    startTransition(async () => {
      const result = await payOrder(orderId);
      if (result.success) {
        toast.success("支付成功！", {
          description: "您的订单已成功支付。",
        });
        // 刷新页面以显示最新状态
        router.refresh();
      } else {
        toast.error("支付失败", {
          description: result.error || "请稍后重试",
        });
      }
    });
  };

  return (
    <Button 
      className="w-full bg-[#D7001D] hover:bg-[#B8001A] text-white" 
      size="lg" 
      onClick={handlePay} 
      disabled={isPending}
    >
      {isPending ? (
        "支付处理中..."
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          立即支付
        </>
      )}
    </Button>
  );
}
