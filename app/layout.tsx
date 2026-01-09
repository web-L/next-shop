import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { CartSheet } from "@/components/cart-sheet";
import { NavLink } from "@/components/nav-link";
import { UserMenu } from "@/components/user-menu";
import { NextAuthSessionProvider } from "@/components/session-provider";
import Image from "next/image";
import { metadata as siteMetadata } from "./layout-metadata";

const inter = Inter({ subsets: ["latin"] });

// 使用统一的 metadata 配置
export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        <NextAuthSessionProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <header className="sticky top-0 z-50 w-full border-b border-[#D7001D]/20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 dark:bg-gray-950/95">
          <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center">
             <div className="mr-4 hidden lg:flex flex-1 items-center min-w-0">
               <Link className="mr-4 lg:mr-6 flex items-center space-x-2 shrink-0" href="/">
                 <Image 
                   src="/logo.svg" 
                   alt="恒天翊" 
                   width={140} 
                   height={28}
                   className="h-7 w-auto"
                   priority
                 />
               </Link>
               <nav className="flex items-center gap-0 text-xs lg:text-sm font-medium overflow-x-auto scrollbar-hide flex-1 min-w-0 smooth-scroll">
                 <NavLink href="/" className="shrink-0">首页</NavLink>
                 <NavLink href="/products" className="shrink-0">设备产品</NavLink>
                 <NavLink href="/categories" className="shrink-0">设备分类</NavLink>
                 <NavLink href="/pcb" className="shrink-0">PCB制作</NavLink>
                 <NavLink href="/smt" className="shrink-0">SMT贴片</NavLink>
                 <NavLink href="/supply-chain" className="shrink-0">供应链管理</NavLink>
                 <NavLink href="/pricing" className="shrink-0">在线计价</NavLink>
                 <NavLink href="/#advantages" className="shrink-0">核心优势</NavLink>
                 <NavLink href="/business" className="shrink-0">业务介绍</NavLink>
                 <NavLink href="/news" className="shrink-0">新闻资讯</NavLink>
                 <NavLink href="/about" className="shrink-0">关于我们</NavLink>
                 <NavLink href="/join" className="shrink-0">加入我们</NavLink>
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
                 <UserMenu />
             </div>
            </div>
          </div>
        </header>
        <main className="w-full">
          {children}
        </main>
        </ThemeProvider>
        <Toaster />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
