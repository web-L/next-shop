import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Layers, 
  Zap, 
  Shield, 
  Factory,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function PCBPage() {
  const pcbTypes = [
    {
      title: "PCB打样",
      layers: "1~14层",
      material: "FR-4 TG150/TG170",
      features: [
        "可8小时加急，当日下单，当日发货",
        "全国包邮为您节省高额运费"
      ]
    },
    {
      title: "PCB小批量",
      layers: "≥50 pcs",
      material: "FR-4 TG150/TG170",
      features: [
        "直通率达99%以上，5㎡内仅需3天发货",
        "10平米以上费用全部9折优惠"
      ]
    },
    {
      title: "高精密PCB板",
      layers: "线宽线距≥3/3mil",
      material: "过孔≥0.15mm",
      features: [
        "可做阻焊桥，过孔塞油工艺",
        "有阻抗要求，电金手指，线路精密等"
      ]
    },
    {
      title: "软硬结合板",
      layers: "1~8层",
      material: "压延铜/电解铜",
      features: [
        "原材料生益，台鸿等品牌质量有保证",
        "可做软硬结合、FPC多层板、排线等"
      ]
    },
    {
      title: "铜基板",
      layers: "厚铜板/裸铜板",
      material: "导热系数2-3W",
      features: [
        "热电分离工艺，100%电脑开短路测试",
        "散热性能高，用于散热器，电源等"
      ]
    },
    {
      title: "铝基板",
      layers: "铝基板/混压铝基板",
      material: "导热系数1-3W",
      features: [
        "铝板+高导热绝缘材料，高导热性能",
        "可做8层混压铝基板"
      ]
    }
  ];

  const specialProcesses = [
    { number: "01", name: "阻抗板" },
    { number: "02", name: "特殊油墨" },
    { number: "03", name: "盲埋孔" },
    { number: "04", name: "超长、超薄板" },
    { number: "05", name: "沉头孔" },
    { number: "06", name: "OSP工艺" },
    { number: "07", name: "厚铜板裸铜板" },
    { number: "08", name: "高频高速HDI" },
  ];

  const productionSteps = [
    { step: "第一步", name: "客户资料审核" },
    { step: "第二步", name: "销售报价" },
    { step: "第三步", name: "工程资料制作" },
    { step: "第四步", name: "开料、钻孔" },
    { step: "第五步", name: "图形转移" },
    { step: "第六步", name: "电镀、蚀刻" },
    { step: "第七步", name: "阻焊、文字" },
    { step: "第八步", name: "表面处理" },
    { step: "第九步", name: "成型" },
    { step: "第十步", name: "检测" },
    { step: "第十一步", name: "出货" },
    { step: "第十二步", name: "服务" },
  ];

  return (
    <div className="w-full">
      {/* Hero 区域 */}
      <section className="w-full bg-gradient-to-b from-[#D7001D]/5 to-background py-16 md:py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              PCB制作
            </h1>
            <div className="space-y-2 text-lg md:text-xl text-muted-foreground">
              <p>从打样到批量 · 2-30层板加工 · MES+APIS精益生产管理</p>
              <p>IATF16949、UL认证 · FPC挠性板 · 铜基/铝基板</p>
            </div>
          </div>
        </div>
      </section>

      {/* PCB种类和服务 */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">PCB种类和服务</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              提供多样化PCB种类及服务，涵盖高速、高精度、高可靠性等不同类型的PCB板制造，同时提供定制化设计和生产支持。
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pcbTypes.map((type, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <CardTitle className="text-xl font-semibold">{type.title}</CardTitle>
                    <Layers className="size-6 text-[#D7001D] shrink-0" />
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-medium">{type.layers}</p>
                    <p>{type.material}</p>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <ul className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="size-4 text-[#D7001D] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 特殊工艺 */}
      <section className="w-full py-16 md:py-24 bg-muted/30">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">特殊工艺</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              采用先进的特殊工艺，实现高精度、高效率的PCB制造，包括高精度线路设计、特殊表面处理、自动化生产及严格的质量检测等环节。
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {specialProcesses.map((process, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-[#D7001D] mb-2">
                    {process.number}
                  </div>
                  <div className="text-base font-medium">
                    {process.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PCB生产流程 */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">PCB生产流程</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              采用先进的生产技术，遵循严谨的工艺流程，提供从设计到成品的全方位PCB生产服务，包括原材料采购、制板、电路布线、表面处理、检测与包装等各环节。
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {productionSteps.map((item, index) => (
              <div key={index} className="relative">
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="size-10 rounded-full bg-[#D7001D]/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-[#D7001D]">{index + 1}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">{item.step}</div>
                        <div className="text-base font-medium">{item.name}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {index < productionSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 -translate-y-1/2 z-10">
                    <ArrowRight className="size-4 text-[#D7001D]/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="w-full py-16 md:py-24 bg-muted/30">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-sm p-8 md:p-12 text-center">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold">需要PCB制作服务？</h3>
              <p className="text-lg text-muted-foreground">
                联系我们获取专业报价和技术支持
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/pricing"
                  className="inline-flex items-center justify-center h-12 px-8 rounded-md bg-[#D7001D] hover:bg-[#B8001A] text-white font-medium transition-colors"
                >
                  在线计价
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center h-12 px-8 rounded-md border border-[#D7001D] text-[#D7001D] hover:bg-[#D7001D] hover:text-white font-medium transition-colors"
                >
                  立即询价
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
