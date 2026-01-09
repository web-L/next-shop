"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  
  // 处理锚点链接（如 /#advantages）
  const isAnchorLink = href.startsWith("/#");
  const baseHref = isAnchorLink ? "/" : href;
  
  // 判断是否激活
  const isActive = isAnchorLink 
    ? pathname === "/" // 锚点链接只在首页时激活
    : pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "px-2.5 py-2 rounded-md transition-all whitespace-nowrap",
        isActive
          ? "bg-[#D7001D]/10 text-[#D7001D] font-medium"
          : "text-foreground/80 hover:bg-[#D7001D]/10 hover:text-[#D7001D]",
        className
      )}
    >
      {children}
    </Link>
  );
}
