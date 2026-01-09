import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // 获取分类信息
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  // 获取该分类下的所有产品
  const products = await prisma.product.findMany({
    where: {
      categoryId: id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回链接 */}
        <Link
          href="/categories"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-[#D7001D] mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回分类列表
        </Link>

        {/* 分类标题 */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {category.name}
          </h1>
          <p className="text-lg text-muted-foreground">
            共 {category._count.products} 个产品
          </p>
        </div>

        {/* 产品网格 */}
        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square relative bg-gray-100">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <CardHeader className="p-6">
                  <CardTitle className="text-lg font-semibold line-clamp-1 mb-2">
                    {product.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <div className="text-xl font-bold text-foreground">
                    ¥{Number(product.price).toLocaleString()}
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/products/${product.id}`}>查看详情</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">该分类下暂无产品</p>
          </div>
        )}
      </div>
    </div>
  );
}
