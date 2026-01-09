# Next Shop - 企业级 Next.js 电商系统

这是一个基于 **Next.js 15 (App Router)** 构建的现代化、高性能全栈电商平台。项目采用最新的 React Server Components (RSC) 架构，结合 TypeScript、PostgreSQL 和 Prisma，实现了从商品浏览、购物车管理到下单支付的完整电商闭环。

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Prisma](https://img.shields.io/badge/Prisma-ORM-teal) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan)

## 🚀 核心特性

- **⚡️ 高性能架构**: 
  - 采用 **App Router** 和 **React Server Components**，大幅减少客户端 Bundle 体积。
  - 利用 `generateStaticParams` 实现商品详情页的 **SSG (静态生成)**，实现秒级加载。
  - 支持 **Streaming** 流式渲染，提升首屏交互体验。

- **🔐 安全认证系统**:
  - 集成 **NextAuth.js v5 (Auth.js)**。
  - 支持凭证登录 (Credentials) 和 Session 管理。
  - **Middleware** 路由保护，确保敏感页面（如个人中心、结账页）安全。

- **🛒 健壮的交易流程**:
  - **购物车**: 基于 **Zustand** 的客户端状态管理，支持持久化存储。
  - **事务处理**: 使用 Prisma `$transaction` 保证订单创建与库存扣减的 **原子性 (Atomicity)**，杜绝超卖现象。
  - **乐观锁**: 数据库层面使用原子操作 (`decrement`) 处理并发库存更新。

- **🎨 现代化 UI/UX**:
  - 深度集成 **Shadcn/ui** 组件库。
  - **Tailwind CSS** 原子化样式，完全响应式设计（Mobile First）。
  - 优雅的交互反馈：Server Actions 配合 `useTransition` 和 `Toast` 通知。

- **🔍 SEO 与生产级优化**:
  - 动态生成 **Metadata** 和 **Open Graph** 图片。
  - **Docker** 容器化支持，提供生产级 `Dockerfile`。
  - 全局错误边界 (`error.tsx`) 和 404 处理。

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **数据库**: PostgreSQL (开发环境使用 Docker，生产环境支持 Neon/Supabase)
- **ORM**: Prisma (支持 Driver Adapters)
- **认证**: NextAuth.js v5 Beta
- **样式**: Tailwind CSS + Shadcn/ui (Radix UI)
- **表单**: React Hook Form + Zod
- **状态管理**: Zustand (客户端) + Server Actions (服务端)

## 🏁 快速开始

### 1. 环境准备
确保本地已安装：
- Node.js 18+
- Docker & Docker Compose (用于运行本地数据库)

### 2. 初始化项目

```bash
# 安装依赖
npm install

# 复制环境变量配置
cp .env.example .env
# (如果项目没有 .env.example，请参考下方配置)
```

### 3. 启动数据库

使用 Docker Compose 启动 PostgreSQL 容器：

```bash
docker-compose up -d
```

### 4. 数据库迁移与填充

```bash
# 初始化数据库表结构
npx prisma migrate dev --name init

# 填充初始测试数据 (分类、商品、管理员账号)
npx prisma db seed
```

> **默认管理员账号**: 
> - Email: `admin@example.com`
> - Password: `password123`

### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

## 📂 项目结构

```
next-shop/
├── app/                    # Next.js App Router 目录
│   ├── (auth)/             # 认证相关路由 (login, register)
│   ├── admin/              # 后台管理路由
│   ├── api/                # API Routes (NextAuth)
│   ├── orders/             # 订单相关页面
│   ├── products/           # 商品列表与详情页
│   ├── layout.tsx          # 全局布局
│   └── page.tsx            # 首页
├── components/             # React 组件
│   ├── ui/                 # Shadcn 基础组件
│   └── ...                 # 业务组件 (CartSheet, UserMenu 等)
├── lib/                    # 工具函数与核心逻辑
│   ├── actions/            # Server Actions (业务逻辑层)
│   ├── store/              # Zustand Store (购物车状态)
│   ├── prisma.ts           # Prisma 客户端实例
│   └── utils.ts            # 通用工具
├── prisma/                 # 数据库相关
│   ├── schema.prisma       # 数据模型定义
│   └── seed.ts             # 种子数据脚本
└── public/                 # 静态资源
```

## 🚢 部署

### Docker 部署
项目包含高度优化的 `Dockerfile`（基于 Next.js Standalone 模式）。

```bash
# 构建镜像
docker build -t next-shop .

# 运行容器
docker run -p 3000:3000 next-shop
```

### Vercel 部署
本项目完美适配 Vercel + Neon (Serverless Postgres) 架构。
详情请参考 [DEPLOY_NEON_VERCEL.md](./DEPLOY_NEON_VERCEL.md)（如果有）。

## 📝 环境变量配置

在 `.env` 文件中配置：

```env
# 数据库连接串
DATABASE_URL="postgresql://nextshop_user:nextshop_password@localhost:5432/nextshop_db?schema=public"

# NextAuth 密钥 (生成命令: openssl rand -base64 32)
AUTH_SECRET="your-secret-key"

# 生产环境 URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

---

Built with ❤️ by Next.js Developers.
