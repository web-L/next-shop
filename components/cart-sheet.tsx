'use client';

import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import Image from 'next/image';
import { useEffect, useState, useTransition } from 'react';
import { checkout } from '@/lib/actions/checkout';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function CartSheet() {
  const cart = useCartStore();
  const router = useRouter();
  // 处理 Hydration Mismatch: 
  // LocalStorage 的内容在服务端渲染时不存在，会导致客户端和服务端 HTML 不一致。
  // 必须确保只在客户端渲染购物车内容。
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition(); // 用于处理 Server Action 的 loading 状态

  // 处理 Hydration Mismatch: 确保只在客户端渲染购物车内容
  // 这是处理 SSR hydration mismatch 的标准做法
  // 注意：React Compiler 可能会警告在 effect 中同步调用 setState，
  // 但这是处理 hydration mismatch 的标准模式，可以安全忽略
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleCheckout = async () => {
    startTransition(async () => {
      // 1. 调用 Server Action
      const result = await checkout(cart.items.map(item => ({
        id: item.id,
        quantity: item.quantity
      })));

      // 2. 处理结果
      if (result.error) {
        toast.error('结算失败', {
          description: result.error,
        });
        if (result.error.includes('Insufficient stock') || result.error.includes('库存不足')) {
          toast.error('部分商品库存不足，请调整购物车。');
        }
      } else if (result.success) {
        toast.success('订单创建成功！');
        cart.clearCart(); // 清空购物车
        // 3. 跳转到订单详情页
        if (result.orderId) {
          router.push(`/orders/${result.orderId}`);
        }
      }
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative"
          data-cart-button
        >
          <ShoppingCart className="h-4 w-4" />
          {cart.items.length > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[#D7001D] text-xs text-white flex items-center justify-center font-semibold animate-pulse">
              {cart.totalItems()}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-xl">购物车</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col gap-4 py-6 flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg">购物车是空的</p>
              <p className="text-sm text-muted-foreground mt-2">快去挑选心仪的商品吧！</p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 items-start p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                      无图片
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 mb-2">{item.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-[#D7001D]">
                      ¥{(item.price * item.quantity).toFixed(2)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        cart.removeItem(item.id);
                        toast.success('已移除', {
                          description: `${item.name} 已从购物车移除`,
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.items.length > 0 && (
          <SheetFooter className="mt-auto border-t pt-4 space-y-4">
            <div className="w-full space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">合计:</span>
                <span className="text-2xl font-bold text-[#D7001D]">
                  ¥{cart.totalPrice().toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                共 {cart.totalItems()} 件商品
              </div>
              <Button 
                className="w-full bg-[#D7001D] hover:bg-[#B8001A] text-white h-12 text-base font-semibold" 
                onClick={handleCheckout} 
                disabled={isPending || cart.items.length === 0}
              >
                {isPending ? '处理中...' : '去结算'}
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}