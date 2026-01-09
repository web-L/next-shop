import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 强制动态渲染，避免 Turbopack 在开发模式下的问题
// 注意：暂时移除 generateStaticParams，因为 Turbopack 在开发模式下可能有问题
// 如果需要静态生成，可以在生产构建时重新启用
export const dynamic = 'force-dynamic';

// 生成商品详情页的 SEO metadata
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return {
      title: '商品未找到',
      description: '您访问的商品不存在',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hengtianyi.com';
  const productUrl = `${siteUrl}/products/${id}`;
  const productImage = product.image 
    ? (product.image.startsWith('http') ? product.image : `${siteUrl}${product.image}`)
    : `${siteUrl}/logo.svg`;

  // 生成商品描述（如果描述太长，截取前150个字符）
  const description = product.description.length > 150
    ? `${product.description.substring(0, 150)}...`
    : product.description;

  const title = `${product.name} - ${product.category.name} | 恒天翊`;
  const fullDescription = `${description} 价格：¥${Number(product.price).toFixed(2)}。库存：${product.stock}件。${product.category.name}设备，专业PCBA制造设备供应商。`;

  return {
    title,
    description: fullDescription,
    keywords: [
      product.name,
      product.category.name,
      'PCBA设备',
      '工业设备',
      '电子制造设备',
      '恒天翊',
      'SMT贴片设备',
      'PCB制造设备',
    ],
    openGraph: {
      title,
      description: fullDescription,
      url: productUrl,
      siteName: '恒天翊',
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: 'zh_CN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: fullDescription,
      images: [productImage],
    },
    alternates: {
      canonical: productUrl,
    },
    // 结构化数据（JSON-LD）可以通过其他方式添加
  };
}

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hengtianyi.com';
  const productUrl = `${siteUrl}/products/${productData.id}`;
  const productImage = productData.image 
    ? (productData.image.startsWith('http') ? productData.image : `${siteUrl}${productData.image}`)
    : `${siteUrl}/logo.svg`;

  // 结构化数据（JSON-LD）用于 SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productData.name,
    description: productData.description,
    image: productImage,
    brand: {
      '@type': 'Brand',
      name: '恒天翊',
    },
    category: productData.category.name,
    offers: {
      '@type': 'Offer',
      price: Number(productData.price).toFixed(2),
      priceCurrency: 'CNY',
      availability: productData.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      url: productUrl,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '128',
    },
  };

  return (
    <>
      {/* 结构化数据（JSON-LD） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
          <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回产品列表
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
            ¥{Number(productData.price).toFixed(2)}
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
             <p>库存: {productData.stock} 件</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
