"use client"; // 必须是客户端组件才能使用 Store

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { toast } from "sonner";
import { useRef } from "react";
import { useAddToCartAnimation } from "@/hooks/use-add-to-cart-animation";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number | string; // 允许字符串形式
    image: string | null;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { triggerAnimation } = useAddToCartAnimation();

  const handleAddToCart = () => {
    if (!buttonRef.current) return;

    // 查找购物车图标元素
    const cartButton = document.querySelector('[data-cart-button]') as HTMLElement;
    
    if (cartButton) {
      // 触发抛物动画
      triggerAnimation(buttonRef.current, cartButton, {
        onComplete: () => {
          // 动画完成后添加到购物车
          addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image || undefined,
            quantity: 1,
          });
          
          toast.success("已添加到购物车", {
            description: `${product.name} 已添加到您的购物车。`,
          });
        },
      });
    } else {
      // 如果找不到购物车按钮，直接添加
      addItem({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image || undefined,
        quantity: 1,
      });
      
      toast.success("已添加到购物车", {
        description: `${product.name} 已添加到您的购物车。`,
      });
    }
  };

  return (
    <Button 
      ref={buttonRef}
      size="lg" 
      className="flex-1 bg-[#D7001D] hover:bg-[#B8001A] text-white transition-all active:scale-95" 
      onClick={handleAddToCart}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      加入购物车
    </Button>
  );
}
