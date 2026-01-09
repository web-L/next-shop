'use client';

import { ShoppingCart } from 'lucide-react';
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

export function CartSheet() {
  const cart = useCartStore();
  // 处理 Hydration Mismatch: 
  // LocalStorage 的内容在服务端渲染时不存在，会导致客户端和服务端 HTML 不一致。
  // 必须确保只在客户端渲染购物车内容。
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, startTransition] = useTransition(); // 用于处理 Server Action 的 loading 状态
  // const router = useRouter(); // 暂时未使用，等实现订单详情页时启用

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
        toast.error(result.error);
        if (result.error.includes('Insufficient stock')) {
          // 可选：提示用户哪个商品没货了
          toast.error('Some items are out of stock. Please adjust your cart.');
        }
      } else if (result.success) {
        toast.success('Order placed successfully!');
        cart.clearCart(); // 清空购物车
        // 3. 跳转到订单成功页 (稍后实现 /orders/[id])
        // router.push(`/orders/${result.orderId}`); 
        // 暂时先刷新或留在此处
      }
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {cart.items.length > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {cart.totalItems()}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col gap-4 py-6 flex-1 overflow-y-auto max-h-[70vh]">
          {cart.items.length === 0 ? (
            <p className="text-muted-foreground text-center">Your cart is empty.</p>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <button onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</div>
                  <button 
                    onClick={() => cart.removeItem(item.id)}
                    className="text-xs text-red-500 hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <SheetFooter className="mt-auto border-t pt-4">
            <div className="w-full space-y-4">
                <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${cart.totalPrice().toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleCheckout} 
                  disabled={isPending || cart.items.length === 0}
                >
                  {isPending ? 'Processing...' : 'Checkout'}
                </Button>
            </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}