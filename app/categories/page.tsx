import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default async function CategoriesPage() {
  // 获取所有分类及其产品数量
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  // 获取每个分类下的产品（用于展示）
  const categoriesWithProducts = await Promise.all(
    categories.map(async (category) => {
      const products = await prisma.product.findMany({
        where: {
          categoryId: category.id,
        },
        take: 4, // 每个分类显示4个产品
        orderBy: {
          createdAt: 'desc',
        },
      });
      return {
        ...category,
        products,
      };
    })
  );

  return (
    <div className="w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">设备分类</h1>
          <p className="text-lg text-muted-foreground">
            浏览我们的产品分类，找到您需要的PCBA生产设备
          </p>
        </div>

        {categoriesWithProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无分类数据</p>
          </div>
        ) : (
          <div className="space-y-12">
            {categoriesWithProducts.map((category) => (
              <div key={category.id} className="space-y-6">
                {/* 分类标题 */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      共 {category._count.products} 个产品
                    </p>
                  </div>
                  <Button asChild variant="outline" className="border-[#D7001D] text-[#D7001D] hover:bg-[#D7001D] hover:text-white">
                    <Link href={`/categories/${category.id}`}>查看全部</Link>
                  </Button>
                </div>

                {/* 产品网格 */}
                {category.products.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {category.products.map((product) => (
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
                  <div className="text-center py-8 text-muted-foreground">
                    该分类下暂无产品
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
