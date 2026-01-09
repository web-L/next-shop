'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'link' | 'secondary';
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function LogoutButton({ 
  variant = 'outline', 
  className = '',
  size = 'default'
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/' 
      });
      // 清除 session 后刷新页面以更新 UI
      router.refresh();
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      // 即使出错也尝试跳转
      router.replace('/');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      type="button"
      variant={variant}
      className={className}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {isLoading ? '退出中...' : '退出登录'}
    </Button>
  );
}
