# Next.js 企业级电商项目 (Next Shop) 执行计划

## 项目目标
构建一个具备完整全栈能力、高性能、可扩展的企业级电商系统。
项目路径: `@next-shop`

## 技术栈选择 (Enterprise Stack)
- **Framework**: Next.js 14/15 (App Router) - 利用最新的 RSC (React Server Components) 架构。
- **Language**: TypeScript - 强类型保证代码质量。
- **Database**: PostgreSQL - 关系型数据库标准。
- **Infrastructure**: Docker & Docker Compose - 本地容器化开发环境。
- **ORM**: Prisma - 类型安全的数据库客户端。
- **Auth**: NextAuth.js (v5 Beta / Auth.js) - 认证解决方案。
- **Styling**: Tailwind CSS - 原子化 CSS。
- **UI Components**: Shadcn/ui (Radix UI + Tailwind) - 高度可定制的企业级组件库。
- **Form Handling**: React Hook Form + Zod - 强大的表单验证。
- **State Management**: Zustand (客户端全局状态) + React Query (可选，服务端状态管理) 或利用 Server Actions。

## 教学模式
1. **概念讲解**: 解释即将使用的技术原理（如 "为什么用 Docker", "Server Actions vs API Routes"）。
2. **代码实现**: 手把手编写代码。
3. **知识点测验**: 针对核心概念提问，确保理解深度。

---

## 执行阶段 (Roadmap)

### 第一阶段: 基础设施与初始化 (Infrastructure & Init)
**目标**: 搭建稳固的开发地基。
- [ ] 1.1 初始化 Next.js 项目 (TypeScript, ESLint, Prettier)。
- [ ] 1.2 配置 Docker Compose 运行 PostgreSQL 数据库。
- [ ] 1.3 初始化 Prisma 并连接数据库。
- [ ] 1.4 环境变量管理与类型安全 (`t3-env` 或自定义验证)。
- **知识点**: Next.js App Directory 结构, Docker 网络与持久化, ORM 概念。

### 第二阶段: 数据库架构设计 (Database Modeling)
**目标**: 设计符合电商业务的关系模型。
- [ ] 2.1 设计 Schema: User (用户), Product (商品), Category (分类)。
- [ ] 2.2 数据库迁移 (Migration) 流程。
- [ ] 2.3 编写种子脚本 (Seed Script) 填充测试数据。
- **知识点**: 关系数据库设计范式 (1:N, M:N), Prisma Schema 语法, 数据一致性。

### 第三阶段: UI 架构与组件库 (UI Architecture)
**目标**: 建立统一的设计系统。
- [ ] 3.1 集成 Shadcn/ui。
- [ ] 3.2 实现响应式布局 (Layout) 和导航栏。
- [ ] 3.3 字体与主题配置。
- **知识点**: Tailwind 配置, Server Components 中的样式处理, 组件复用设计。

### 第四阶段: 身份认证系统 (Authentication)
**目标**: 安全的用户登录与权限控制。
- [ ] 4.1 集成 NextAuth.js v5。
- [ ] 4.2 实现凭证登录 (Credentials Provider) 与 OAuth (可选)。
- [ ] 4.3 编写 Middleware 进行路由保护。
- [ ] 4.4 注册与密码加密 (bcrypt)。
- **知识点**: JWT vs Session, Middleware 原理, 密码学基础。

### 第五阶段: 商品核心模块 (Products Core)
**目标**: 实现高性能的商品浏览与管理。
- [ ] 5.1 商品列表页 (服务端渲染 + 分页)。
- [ ] 5.2 商品详情页 (动态路由 + 静态生成参数)。
- [ ] 5.3 后台管理: 创建/编辑商品 (Server Actions)。
- [ ] 5.4 图片上传处理 (本地存储或云存储模拟)。
- **知识点**: Server Actions 深度解析, Streaming (流式渲染), Suspense, 缓存策略 (`unstable_cache`).

### 第六阶段: 购物车与状态管理 (Cart & State)
**目标**: 复杂的客户端交互逻辑。
- [ ] 6.1 购物车数据结构设计。
- [ ] 6.2 使用 Zustand 实现客户端购物车状态。
- [ ] 6.3 购物车与服务端同步策略 (Guest vs Logged in)。
- **知识点**: Client Components vs Server Components 边界, 状态持久化, 乐观更新 (Optimistic UI).

### 第七阶段: 订单与事务 (Orders & Transactions)
**目标**: 保证业务数据完整性。
- [ ] 7.1 结账流程 (Checkout Flow)。
- [ ] 7.2 创建订单 (使用数据库事务 Transaction)。
- [ ] 7.3 模拟支付流程。
- [ ] 7.4 用户订单历史查看。
- **知识点**: ACID 事务特性, 复杂 SQL 查询, 错误处理模式。

### 第八阶段: 生产级优化 (Production Ready)
**目标**: 提速、SEO 与监控。
- [ ] 8.1 Metadata 与 SEO 优化。
- [ ] 8.2 性能分析与优化 (Lighthouse)。
- [ ] 8.3 错误边界 (Error Boundaries) 与 日志。
- [ ] 8.4 Docker 构建生产镜像 (Dockerfile)。
- **知识点**: Next.js 构建流程, Web Vitals, 容器化部署最佳实践。

---

## 下一步
请确认计划无误，我们将从 **第一阶段: 基础设施与初始化** 开始。
