'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

// 简化的购物车项类型
interface CheckoutItem {
  id: string; // Product ID
  quantity: number;
}

export async function checkout(items: CheckoutItem[]) {
  // 1. 检查登录
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/login'); // 未登录跳去登录
  }

  if (items.length === 0) {
    return { error: 'Cart is empty' };
  }

  // 2. 开启事务
  try {
    const result = await prisma.$transaction(async (tx) => {
      let total = 0;
      const orderItemsData = [];

      // a. 检查库存并计算总价
      for (const item of items) {
        const product = await tx.product.findUnique({
            where: { id: item.id } 
        });

        if (!product) {
          throw new Error(`Product ${item.id} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        const price = Number(product.price);
        total += price * item.quantity;

        // 收集订单项数据，以便稍后统一创建
        orderItemsData.push({
          productId: item.id,
          quantity: item.quantity,
          price: product.price, // 使用数据库中的真实价格
        });

        // b. 扣减库存 (原子递减)
        await tx.product.update({
          where: { id: item.id },
          data: { 
            stock: {
              decrement: item.quantity // 使用 decrement 避免竞态条件
            }
          },
        });
      }

      // c. 查找用户ID
      const user = await tx.user.findUnique({ where: { email: session!.user!.email! } });

      if (!user) {
        throw new Error('User not found');
      }
      
      // d. 创建订单
      const order = await tx.order.create({
        data: {
          userId: user.id,
          total: total,
          status: 'PENDING', // 待支付
          items: {
            create: orderItemsData // 使用正确的价格和数量创建关联
          }
        },
      });
      
      return order.id;
    });

    return { success: true, orderId: result };

  } catch (error) {
    console.error('Checkout failed:', error);
    // 重定向不能在 try/catch 块内直接捕获（如果是 NEXT_REDIRECT 错误），
    // 但这里的 error.message 主要是业务错误。
    // 如果是 redirect() 抛出的错误，它实际上是一个特殊的 Error 类型，应该被向上抛出。
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    return { error: error instanceof Error ? error.message : 'Checkout failed' };
  }
}
