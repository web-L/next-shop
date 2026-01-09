'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Package, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function UserMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ 
      redirect: false,
      callbackUrl: '/' 
    });
    // 清除 session 后刷新页面以更新 UI
    router.refresh();
    router.push('/');
  };

  if (status === 'loading') {
    return (
      <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <>
        <Button asChild variant="outline" className="border-[#D7001D] text-[#D7001D] hover:bg-[#D7001D] hover:text-white h-9 px-4">
          <Link href="/login">登录</Link>
        </Button>
        <Button asChild className="bg-[#D7001D] hover:bg-[#B8001A] text-white border-0 h-9 px-4">
          <Link href="/register">注册</Link>
        </Button>
      </>
    );
  }

  const userInitials = session.user.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : session.user.email?.[0].toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={session.user.image || undefined} alt={session.user.name || ''} />
            <AvatarFallback className="bg-[#D7001D] text-white">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name || '用户'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>个人中心</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            <span>我的订单</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button 
            type="button" 
            onClick={handleLogout}
            className="w-full flex items-center cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>退出登录</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
