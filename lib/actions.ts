'use server';

import { signIn, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

// 登出功能
export async function logout() {
  await signOut({ redirectTo: '/' });
}

// 处理登录表单提交
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // 验证输入
  if (!email || !password) {
    return '请输入邮箱和密码。';
  }

  try {
    // NextAuth v5 的 signIn 在 Server Action 中会抛出重定向错误（登录成功时）
    await signIn('credentials', {
      email,
      password,
    });
    
    // 如果执行到这里，说明登录成功（但通常不会执行到这里，因为会抛出重定向错误）
    return 'success';
  } catch (error) {
    if (error && typeof error === 'object') {
      if ('digest' in error && typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
        return 'success'; // 登录成功
      }
      if ('type' in error && error.type === 'NEXT_REDIRECT') {
        return 'success'; // 登录成功
      }
    }

    // 处理 NextAuth 认证错误
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return '邮箱或密码错误，请检查后重试。';
        default:
          // 记录未知的认证错误类型以便调试
          console.error('AuthError type:', error.type);
          return '邮箱或密码错误，请检查后重试。';
      }
    }

    // 记录其他错误以便调试
    console.error('Login error:', error);
    
    // 其他未知错误
    return '登录失败，请稍后重试。';
  }
}

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  // 1. 输入验证
  if (!email || !password || !name) {
    return '请填写所有字段。';
  }

  // 验证邮箱格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return '请输入有效的邮箱地址。';
  }

  // 验证密码长度（至少6个字符）
  if (password.length < 6) {
    return '密码长度至少为6个字符。';
  }

  // 验证姓名长度
  if (name.trim().length < 2) {
    return '姓名长度至少为2个字符。';
  }

  // 2. 检查用户是否已存在
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return '该邮箱已被注册，请使用其他邮箱或直接登录。';
    }
  } catch (error) {
    console.error('Error checking existing user:', error);
    return '检查用户信息失败，请稍后重试。';
  }

  // 3. 密码加密
  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    console.error('Error hashing password:', error);
    return '密码处理失败，请稍后重试。';
  }

  // 4. 创建用户
  try {
    await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: name.trim(),
        role: 'USER',
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    // 检查是否是唯一约束错误
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return '该邮箱已被注册，请使用其他邮箱或直接登录。';
    }
    return '创建账户失败，请稍后重试。';
  }

  // 5. 注册成功后自动登录
  try {
    const result = await signIn('credentials', {
      email: email.toLowerCase().trim(),
      password,
      redirect: false, // 不自动重定向，让客户端处理
    });

    // 检查登录结果
    if (result?.error) {
      // 自动登录失败，但注册已成功
      console.error('Auto-login failed after registration:', result.error);
      return 'success'; // 返回成功，让用户手动登录
    }

    // 登录成功
    if (result?.ok) {
      return 'success';
    }

    // 默认返回成功（注册已成功）
    return 'success';
  } catch (error) {
    // 记录错误，但注册已成功，返回成功状态
    console.error('Error during auto-login:', error);
    return 'success';
  }
}