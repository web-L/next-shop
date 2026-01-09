// components/nav-link.tsx
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
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium transition-colors hover:text-[#D7001D] whitespace-nowrap",
        isActive ? "text-[#D7001D]" : "text-gray-600 dark:text-gray-300",
        className
      )}
    >
      {children}
    </Link>
  );
}
