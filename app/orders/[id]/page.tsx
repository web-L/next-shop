import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ArrowLeft,
  Calendar,
  User,
  Mail,
  CreditCard,
} from "lucide-react";
import { PayButton } from "@/components/pay-button";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

// 订单状态配置
const orderStatusConfig = {
  PENDING: {
    label: "待支付",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
  },
  PAID: {
    label: "已支付",
    variant: "default" as const,
    icon: CheckCircle,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  SHIPPED: {
    label: "已发货",
    variant: "default" as const,
    icon: Truck,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
  COMPLETED: {
    label: "已完成",
    variant: "default" as const,
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  CANCELLED: {
    label: "已取消",
    variant: "destructive" as const,
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/20",
  },
};

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  // Next.js 16 中 params 可能是 Promise，需要 await
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    // 确保包含 updatedAt 字段用于显示支付时间
  });

  if (!order) {
    notFound();
  }

  // 检查订单是否属于当前用户
  if (order.user.email !== session.user.email) {
    redirect("/orders");
  }

  const statusConfig = orderStatusConfig[order.status];
  const StatusIcon = statusConfig.icon;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/orders">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            返回订单列表
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">订单详情</h1>
      </div>

      <div className="space-y-6">
        {/* 订单状态卡片 */}
        <Card className={`${statusConfig.bgColor} border-2`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
                <div>
                  <CardTitle className="text-xl">订单状态</CardTitle>
                  <CardDescription>订单号: {order.id.slice(-8).toUpperCase()}</CardDescription>
                </div>
              </div>
              <Badge variant={statusConfig.variant} className="text-base px-4 py-1">
                {statusConfig.label}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* 订单信息 */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                订单信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">下单时间:</span>
                <span className="font-medium">
                  {format(new Date(order.createdAt), "yyyy年MM月dd日 HH:mm", { locale: zhCN })}
                </span>
              </div>
              {order.status !== "PENDING" && order.status !== "CANCELLED" && (
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">支付时间:</span>
                  <span className="font-medium">
                    {/* 使用 updatedAt 作为支付时间（订单状态更新时自动更新） */}
                    {/* 注意：需要运行 npx prisma generate 和迁移来更新 Prisma 客户端 */}
                    {format(
                      new Date(
                        (order as { updatedAt?: Date }).updatedAt || order.createdAt
                      ), 
                      "yyyy年MM月dd日 HH:mm", 
                      { locale: zhCN }
                    )}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">商品数量:</span>
                <span className="font-medium">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} 件
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">订单总额:</span>
                  <span className="text-2xl font-bold text-[#D7001D]">
                    ¥{Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
              {/* 支付按钮 - 仅当订单状态为待支付时显示 */}
              {order.status === "PENDING" && (
                <div className="pt-4 border-t">
                  <PayButton orderId={order.id} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                收货信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">收货人:</span>
                <span className="font-medium">{order.user.name || "未设置"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">邮箱:</span>
                <span className="font-medium">{order.user.email}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 商品列表 */}
        <Card>
          <CardHeader>
            <CardTitle>商品清单</CardTitle>
            <CardDescription>订单包含的商品详情</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <Link href={`/products/${item.product.id}`}>
                      <h3 className="font-medium hover:text-[#D7001D] transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.product.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      数量: {item.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      单价: ¥{Number(item.price).toFixed(2)}
                    </p>
                    <p className="font-semibold mt-1">
                      ¥{(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">合计:</span>
                <span className="text-2xl font-bold text-[#D7001D]">
                  ¥{Number(order.total).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
