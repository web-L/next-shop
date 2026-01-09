import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// 强制动态渲染 (如果后续加入搜索/分页)
// export const dynamic = 'force-dynamic'; 

export default async function ProductsPage() {
  // 1. 直接在组件中查询数据库
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">设备产品</h1>
          <p className="text-lg text-muted-foreground">
            浏览我们的PCBA生产设备
          </p>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无产品</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}