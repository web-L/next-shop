'use client';

import { useActionState } from 'react';
import { register } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const { update } = useSession();
  const hasRedirected = useRef(false); // 防止重复重定向
  const [errorMessage, dispatch, isPending] = useActionState(register, undefined);

  // 监听注册成功状态
  useEffect(() => {
    if (errorMessage === 'success' && !hasRedirected.current) {
      hasRedirected.current = true; // 标记已重定向，防止重复执行
      
      // 注册成功，更新 session 并跳转
      const handleRedirect = async () => {
        try {
          await update(); // 更新客户端 session
          router.refresh(); // 刷新服务端数据
        } catch (error) {
          console.error('Error updating session:', error);
        } finally {
          // 使用 replace 而不是 push，避免在历史记录中留下注册页
          router.replace('/');
        }
      };

      handleRedirect();
    }
  }, [errorMessage, router, update]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">创建账户</CardTitle>
          <CardDescription>
            填写以下信息创建您的账户
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="张三" 
                minLength={2}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="example@email.com" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="至少6个字符"
                minLength={6}
                required 
              />
              <p className="text-xs text-muted-foreground">
                密码长度至少为6个字符
              </p>
            </div>
            {errorMessage && errorMessage !== 'success' && (
              <div className="text-sm text-red-500 font-medium bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                {errorMessage}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-[#D7001D] hover:bg-[#B8001A] text-white" 
              disabled={isPending}
            >
              {isPending ? '创建中...' : '创建账户'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
             <p className="text-muted-foreground">
               已有账户？<Link href="/login" className="underline text-[#D7001D] hover:text-[#B8001A]">立即登录</Link>
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}