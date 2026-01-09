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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { User, Package, Mail, Calendar } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          items: {
            include: { product: true },
          },
        },
      },
    },
  });

  if (!user) redirect("/login");

  // 统计订单状态
  const orderStats = {
    total: user.orders.length,
    pending: user.orders.filter((o) => o.status === "PENDING").length,
    paid: user.orders.filter((o) => o.status === "PAID").length,
    shipped: user.orders.filter((o) => o.status === "SHIPPED").length,
    completed: user.orders.filter((o) => o.status === "COMPLETED").length,
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">个人中心</h1>
        <LogoutButton variant="outline" className="gap-2" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 用户信息卡片 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              个人信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>邮箱</span>
              </div>
              <p className="font-medium">{user.email}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>姓名</span>
              </div>
              <p className="font-medium">{user.name || "未设置"}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>注册时间</span>
              </div>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString("zh-CN")}
              </p>
            </div>
            <div className="pt-2">
              <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                {user.role === "ADMIN" ? "管理员" : "普通用户"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* 订单统计卡片 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              订单统计
            </CardTitle>
            <CardDescription>您的订单概况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">总订单数</p>
                <p className="text-2xl font-bold">{orderStats.total}</p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                <p className="text-sm text-muted-foreground mb-1">待支付</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {orderStats.pending}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <p className="text-sm text-muted-foreground mb-1">已支付</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {orderStats.paid}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                <p className="text-sm text-muted-foreground mb-1">已完成</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {orderStats.completed}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/orders">
                <Button variant="outline" className="w-full">
                  查看所有订单
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 最近订单 */}
      {user.orders.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>最近订单</CardTitle>
            <CardDescription>您最近的订单记录</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">
                      订单号: {order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString("zh-CN")} ·{" "}
                      {order.items.length} 件商品
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold">¥{Number(order.total).toFixed(2)}</span>
                    <Badge
                      variant={
                        order.status === "PENDING"
                          ? "secondary"
                          : order.status === "CANCELLED"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {order.status === "PENDING"
                        ? "待支付"
                        : order.status === "PAID"
                        ? "已支付"
                        : order.status === "SHIPPED"
                        ? "已发货"
                        : order.status === "COMPLETED"
                        ? "已完成"
                        : "已取消"}
                    </Badge>
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        查看
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
