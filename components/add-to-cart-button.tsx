"use client"; // 必须是客户端组件才能使用 Store

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { toast } from "sonner";

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

  const handleAddToCart = () => {
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
  };

  return (
    <Button size="lg" className="flex-1 bg-[#D7001D] hover:bg-[#B8001A] text-white" onClick={handleAddToCart}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      加入购物车
    </Button>
  );
}
