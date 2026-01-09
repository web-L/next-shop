import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CartSheet } from "@/components/cart-sheet";
import { NavLink } from "@/components/nav-link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "恒天翊 - 智能化PCBA一站式服务",
  description: "专注多品种小批量PCBA一站式快捷生产，以速度、品质、技术、服务为核心经营理念的智能化工厂",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <header className="sticky top-0 z-50 w-full border-b border-[#D7001D]/20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
          <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center">
             <div className="mr-4 hidden lg:flex flex-1 items-center">
               <Link className="mr-6 flex items-center space-x-2 shrink-0" href="/">
                 <Image 
                   src="/logo.svg" 
                   alt="恒天翊" 
                   width={140} 
                   height={28}
                   className="h-7 w-auto"
                   priority
                 />
               </Link>
               <nav className="flex items-center gap-0.5 text-sm font-medium overflow-x-auto scrollbar-hide">
                 <NavLink href="/">首页</NavLink>
                 <NavLink href="/products">设备产品</NavLink>
                 <NavLink href="/categories">设备分类</NavLink>
                 <NavLink href="/pcb">PCB制作</NavLink>
                 <NavLink href="/smt">SMT贴片</NavLink>
                 <NavLink href="/supply-chain">供应链管理</NavLink>
                 <NavLink href="/pricing">在线计价</NavLink>
                 <NavLink href="/#advantages">核心优势</NavLink>
                 <NavLink href="/business">业务介绍</NavLink>
                 <NavLink href="/news">新闻资讯</NavLink>
                 <NavLink href="/about">关于我们</NavLink>
                 <NavLink href="/join">加入我们</NavLink>
               </nav>
             </div>
             {/* Mobile Nav */}
             <div className="flex md:hidden flex-1 items-center">
               <Link className="flex items-center" href="/">
                 <Image 
                   src="/logo.svg" 
                   alt="恒天翊" 
                   width={120} 
                   height={24}
                   className="h-6 w-auto"
                   priority
                 />
               </Link>
             </div>
             <div className="flex items-center justify-end gap-2">
               <CartSheet />
               {/* Auth Buttons */}
               <Button asChild variant="outline" className="border-[#D7001D] text-[#D7001D] hover:bg-[#D7001D] hover:text-white h-9 px-4">
                 <Link href="/login">登录</Link>
               </Button>
               <Button asChild className="bg-[#D7001D] hover:bg-[#B8001A] text-white border-0 h-9 px-4">
                 <Link href="/register">注册</Link>
               </Button>
             </div>
            </div>
          </div>
        </header>
        <main className="w-full">
          {children}
        </main>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
