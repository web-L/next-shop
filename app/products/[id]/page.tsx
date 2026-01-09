import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 强制动态渲染，避免 Turbopack 在开发模式下的问题
// 注意：暂时移除 generateStaticParams，因为 Turbopack 在开发模式下可能有问题
// 如果需要静态生成，可以在生产构建时重新启用
export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: ProductPageProps) {
  // Next.js 16 中 params 可能是 Promise，需要 await
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const productData = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!productData) {
    notFound(); // 触发 404 页面
  }

  return (
    <div className="container py-8 max-w-5xl">
        <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
        </Link>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* 左侧：图片 */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border">
          {productData.image ? (
            <Image
              src={productData.image}
              alt={productData.name}
              fill
              className="object-cover"
              priority // 关键图片优先加载
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        {/* 右侧：信息 */}
        <div className="flex flex-col gap-4">
          <div>
             <span className="text-sm text-muted-foreground">{productData.category.name}</span>
             <h1 className="text-3xl font-bold tracking-tight mt-1">{productData.name}</h1>
          </div>
          
          <div className="text-2xl font-bold">
            ${Number(productData.price).toFixed(2)}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {productData.description}
          </p>
          
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <AddToCartButton 
              product={{
                id: productData.id,
                name: productData.name,
                price: Number(productData.price),
                image: productData.image,
              }} 
            />
            {/* 后续添加立即购买等按钮 */}
          </div>

          <div className="mt-8 border-t pt-6 text-sm text-muted-foreground">
             <p>Stock: {productData.stock} units available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
