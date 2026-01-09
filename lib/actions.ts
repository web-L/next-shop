'use server';

import { signIn } from '@/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

// 处理登录表单提交
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password) {
    return 'Please fill in all fields.';
  }

  // 1. 检查用户是否存在
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return 'User already exists.';
  }

  // 2. 密码加密
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. 创建用户
  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER',
      },
    });
  } catch (error) {
    return 'Failed to create user.';
  }

  // 4. 重定向到登录页
  redirect('/login');
}