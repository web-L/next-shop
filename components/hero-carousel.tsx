"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const banners = [
  "/banner/banner3_1.webp",
  "/banner/zu70_1.webp",
  "/banner/zu69_1.webp",
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // 每5秒切换

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 轮播图片 */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentIndex ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={banner}
              alt={`Banner ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* 遮罩层 */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* 内容覆盖层 */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center space-y-8 px-6 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
            恒天翊
          </h1>
          <p className="text-2xl md:text-3xl font-medium text-white drop-shadow-lg">
            智能化PCBA一站式服务
          </p>
          <p className="text-lg md:text-xl text-white/90 drop-shadow-lg max-w-2xl mx-auto leading-relaxed">
            专注多品种小批量PCBA一站式快捷生产，以速度、品质、技术、服务为核心经营理念
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button asChild size="lg" className="h-12 px-8 text-base bg-[#D7001D] hover:bg-[#B8001A] text-white border-0">
              <a href="/products">查看设备产品</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <a href="#contact">立即询价</a>
            </Button>
          </div>
        </div>
      </div>

      {/* 左右箭头 */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all"
        aria-label="上一张"
      >
        <ChevronLeft className="size-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all"
        aria-label="下一张"
      >
        <ChevronRight className="size-6" />
      </button>

      {/* 指示器 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              index === currentIndex
                ? "w-8 bg-[#D7001D]"
                : "w-2 bg-white/50 hover:bg-white/70"
            )}
            aria-label={`跳转到第 ${index + 1} 张`}
          />
        ))}
      </div>
    </div>
  );
}
