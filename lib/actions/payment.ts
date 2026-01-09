// lib/actions/payment.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function payOrder(orderId: string) {
  // 1. 检查用户登录状态
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  // 2. 检查订单是否存在且属于当前用户
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  if (!order) {
    return { success: false, error: "订单不存在" };
  }

  if (order.user.email !== session.user.email) {
    return { success: false, error: "无权操作此订单" };
  }

  // 3. 检查订单状态
  if (order.status !== "PENDING") {
    return { 
      success: false, 
      error: order.status === "PAID" 
        ? "订单已支付" 
        : "订单状态不允许支付" 
    };
  }

  // 4. 模拟支付延迟（模拟真实支付流程）
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 5. 更新订单状态为已支付
  // updatedAt 会自动更新，不需要手动设置
  await prisma.order.update({
    where: { id: orderId },
    data: { 
      status: "PAID",
    },
  });

  // 6. 重新验证相关页面
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
  revalidatePath("/account");
  
  return { success: true };
}
