import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { HeroCarousel } from "@/components/hero-carousel";
import { 
  Zap, 
  Shield, 
  Cpu, 
  HeadphonesIcon,
  Factory,
  Users,
  Award,
  Clock
} from "lucide-react";

export default async function Home() {
  // 获取精选产品（前6个）
  const featuredProducts = await prisma.product.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
    },
  });

  // 获取最新产品（前8个）
  const latestProducts = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
    },
  });

  // 服务领域数据
  const serviceAreas = [
    { name: "方案研发", icon: "💡" },
    { name: "工业工控", icon: "🏭" },
    { name: "智能家居", icon: "🏠" },
    { name: "仪器仪表", icon: "📊" },
    { name: "车物联网", icon: "🚗" },
    { name: "通信电源", icon: "📡" },
    { name: "医疗器械", icon: "⚕️" },
    { name: "汽车电子", icon: "🔧" },
  ];

  return (
    <div className="min-h-screen w-full">
      {/* Hero 区域 - 轮播图 */}
      <section className="relative w-full">
        <HeroCarousel />
      </section>

      {/* 核心优势 - 4卡片 */}
      <section id="advantages" className="py-24 bg-background w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">核心优势</h2>
            <p className="text-lg text-muted-foreground">速度、品质、技术、服务</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-sm p-8 text-center">
              <div className="flex justify-center mb-4">
                <Zap className="size-12 text-[#D7001D]" />
              </div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-semibold mb-2">速度</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-base text-muted-foreground">
                  快速交付能力，多品种小批量快捷生产
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm p-8 text-center">
              <div className="flex justify-center mb-4">
                <Shield className="size-12 text-[#D7001D]" />
              </div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-semibold mb-2">品质</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-base text-muted-foreground">
                  ISO9001和TS16949质量体系认证
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm p-8 text-center">
              <div className="flex justify-center mb-4">
                <Cpu className="size-12 text-[#D7001D]" />
              </div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-semibold mb-2">技术</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-base text-muted-foreground">
                  MES+ERP+IOT智能化管理系统
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm p-8 text-center">
              <div className="flex justify-center mb-4">
                <HeadphonesIcon className="size-12 text-[#D7001D]" />
              </div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-semibold mb-2">服务</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-base text-muted-foreground">
                  24小时专业服务，50+工程技术品质人员
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 精选设备产品 */}
      {featuredProducts.length > 0 && (
        <section className="py-24 bg-muted/30 w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">精选设备</h2>
              <p className="text-lg text-muted-foreground">专业PCBA生产设备</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {featuredProducts.map((product) => (
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
            <div className="text-center mt-12">
              <Button asChild size="lg" variant="outline" className="h-12 px-8 border-[#D7001D] text-[#D7001D] hover:bg-[#D7001D] hover:text-white">
                <Link href="/products">查看全部产品</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* 服务领域 */}
      <section className="py-24 bg-background w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">服务领域</h2>
            <p className="text-lg text-muted-foreground">覆盖多个行业的PCBA一站式服务</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {serviceAreas.map((area, index) => (
              <Card 
                key={index} 
                className="aspect-square flex items-center justify-center border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="text-center space-y-3">
                  <div className="text-4xl">{area.icon}</div>
                  <div className="text-lg font-medium">{area.name}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 制造能力统计 */}
      <section className="py-24 bg-muted/30 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">制造能力</h2>
            <p className="text-lg text-muted-foreground">强大的生产实力保障</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Factory className="size-12 text-[#D7001D]" />
              </div>
              <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">8</div>
              <div className="text-lg text-muted-foreground">全自动SMT贴片生产线</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="size-12 text-[#D7001D]" />
              </div>
              <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">150+</div>
              <div className="text-lg text-muted-foreground">员工</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Award className="size-12 text-[#D7001D]" />
              </div>
              <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">50+</div>
              <div className="text-lg text-muted-foreground">工程技术品质人员</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Clock className="size-12 text-[#D7001D]" />
              </div>
              <div className="text-5xl md:text-6xl font-bold text-foreground mb-2">10+</div>
              <div className="text-lg text-muted-foreground">年行业经验</div>
            </div>
          </div>
        </div>
      </section>

      {/* 公司简介 */}
      <section className="py-24 bg-background w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">关于恒天翊</h2>
              <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                  恒天翊是一家专注多品种小批量PCBA一站式快捷生产的智能化工厂，公司以速度、品质、技术、服务的核心经营理念，自主开发MES+ERP+IOT管理系统实现工业智能化工厂。
                </p>
                <p>
                  为客户提供方案研发、工业工控、智能家居、仪器仪表、车物联网、通信电源、医疗器械、汽车电子等领域PCBA一站式服务。
                </p>
                <p>
                  我们在SMT行业已累积10多年的生产工艺经验，攻克多项SMT工艺难题，不断投入技术研发出一系列提升管理效率和品质的智能化生产管理系统。
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="border-0 shadow-sm p-8">
                <h3 className="text-xl font-semibold mb-4">主要设备</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• JUKI RS1贴片机</li>
                  <li>• 劲拓10温区回流焊</li>
                  <li>• 全自动印刷机</li>
                  <li>• 光学检测AOI</li>
                  <li>• KIC炉温测试仪</li>
                  <li>• X-RAY BGA检测设备</li>
                  <li>• SPI锡膏检测</li>
                  <li>• 日东波峰焊</li>
                </ul>
              </Card>
              <Card className="border-0 shadow-sm p-8">
                <h3 className="text-xl font-semibold mb-4">质量认证</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>• ISO9001质量体系认证</p>
                  <p>• TS16949质量体系认证</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 最新产品 */}
      {latestProducts.length > 0 && (
        <section className="py-24 bg-muted/30 w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">最新设备</h2>
              <p className="text-lg text-muted-foreground">最新上架的PCBA生产设备</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {latestProducts.slice(0, 4).map((product) => (
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
                    <div className="text-xl font-bold text-foreground">
                      ¥{Number(product.price).toLocaleString()}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <Button asChild className="w-full" variant="outline" size="sm">
                      <Link href={`/products/${product.id}`}>查看详情</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 联系询价区域 */}
      <section id="contact" className="py-24 bg-background w-full">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">联系我们</h2>
            <p className="text-lg text-muted-foreground">获取专业PCBA生产服务报价</p>
          </div>
          <Card className="border-0 shadow-sm p-8 md:p-12">
            <div className="space-y-6 text-center">
              <p className="text-lg text-muted-foreground">
                我们提供24小时专业服务，随时为您解答PCBA生产相关问题
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="h-12 px-8 bg-[#D7001D] hover:bg-[#B8001A] text-white border-0">
                  <Link href="/products">查看产品目录</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 border-[#D7001D] text-[#D7001D] hover:bg-[#D7001D] hover:text-white">
                  <Link href="mailto:contact@example.com">发送邮件</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
