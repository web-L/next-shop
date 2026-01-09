import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";

// 订单状态配置
const orderStatusConfig = {
  PENDING: {
    label: "待支付",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-yellow-600 dark:text-yellow-400",
  },
  PAID: {
    label: "已支付",
    variant: "default" as const,
    icon: CheckCircle,
    color: "text-blue-600 dark:text-blue-400",
  },
  SHIPPED: {
    label: "已发货",
    variant: "default" as const,
    icon: Truck,
    color: "text-purple-600 dark:text-purple-400",
  },
  COMPLETED: {
    label: "已完成",
    variant: "default" as const,
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
  },
  CANCELLED: {
    label: "已取消",
    variant: "destructive" as const,
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
  },
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const orders = await prisma.order.findMany({
    where: {
      user: { email: session.user.email },
    },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">我的订单</h1>
        <Link href="/account">
          <Button variant="outline">个人中心</Button>
        </Link>
      </div>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">您还没有任何订单</p>
              <Link href="/products" className="mt-4">
                <Button>去购物</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => {
            const statusConfig = orderStatusConfig[order.status];
            const StatusIcon = statusConfig.icon;
            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-base">
                          订单号: {order.id.slice(-8).toUpperCase()}
                    </CardTitle>
                      </div>
                    <CardDescription>
                        下单时间: {new Date(order.createdAt).toLocaleString('zh-CN')}
                    </CardDescription>
                  </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                        <Badge variant={statusConfig.variant}>
                          {statusConfig.label}
                     </Badge>
                  </div>
                      <span className="font-bold text-lg">¥{Number(order.total).toFixed(2)}</span>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-2 border-b last:border-0"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            数量: {item.quantity} × ¥{Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        <span className="font-medium">
                          ¥{(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        查看详情
                      </Button>
                    </Link>
                  </div>
              </CardContent>
            </Card>
            );
          })
        )}
      </div>
    </div>
  );
}