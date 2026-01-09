## Neon + Vercel 部署详细流程（适用于本项目）

本项目：Next.js（App Router）+ Prisma + PostgreSQL（Neon）+ NextAuth v5。

---

## 0. 你将获得什么

- **推送代码自动上线**（Vercel）
- Postgres 托管在 **Neon**
- 生产环境按最佳实践区分：
  - **DATABASE_URL = Neon pooled**（适合 Vercel 运行时）
  - **DIRECT_URL = Neon direct**（适合 migrate/seed）
  - Prisma 7：连接串不再写在 `schema.prisma`，迁移/seed 由 `prisma.config.ts` 读取（本项目已配置优先使用 `DIRECT_URL`）

---

## 1. 在 Neon 创建数据库

1) 注册/登录 Neon，新建 Project（选择离你和 Vercel 最近的 Region）。

2) 在 Neon 项目中创建数据库（默认会有一个 DB），并获取两条连接串：

- **Pooled connection string**（通常带 `-pooler`）
- **Direct connection string**（不带 `-pooler`）

3) 确保两条连接串都带上 `sslmode=require`。

---

## 2. 本地首次初始化（可选，但强烈建议）

### 2.1 写入本地环境变量

在 `next-shop` 目录下创建你自己的 `.env.local`（不要提交 Git），写入：

```bash
DATABASE_URL="你的 Neon pooled 连接串"
DIRECT_URL="你的 Neon direct 连接串"
AUTH_SECRET="一段强随机字符串"
AUTH_TRUST_HOST="true"
```

> 也可以参考仓库中的 `ENV_EXAMPLE.txt`。

### 2.2 生成 Prisma Client + 执行迁移

```bash
npm run prisma:generate
npm run prisma:migrate:deploy
```

### 2.3 （可选）写入种子数据

本项目已配置 seed：`ts-node prisma/seed.ts`（见 `prisma.config.ts`）。

```bash
npm run prisma:seed
```

成功后你会得到测试管理员：
- `admin@example.com`
- `password123`

---

## 3. 在 Vercel 部署应用

### 3.1 连接代码仓库

1) Vercel 新建 Project，导入你的 Git 仓库
2) Root Directory 选择 `next-shop/`（如果你仓库根不是 next-shop）

### 3.2 配置环境变量（最关键）

在 Vercel Project → Settings → Environment Variables 添加：

- `DATABASE_URL`：Neon **pooled** 连接串
- `DIRECT_URL`：Neon **direct** 连接串
- `AUTH_SECRET`：强随机字符串
- `AUTH_TRUST_HOST`：`true`

环境建议：
- Preview / Production 都要配（至少 Production 必须配齐）

### 3.3 配置 Build Command（推荐）

为保证每次发布自动迁移数据库，推荐 Build Command 使用：

```bash
npm run vercel-build
```

它等价于：
- `prisma generate`
- `prisma migrate deploy`
- `next build`

> 注意：迁移需要访问数据库，所以 Vercel 构建阶段也必须能连上 Neon（通常没问题）。

### 3.4 一键部署

保存后触发部署即可。Vercel 会自动分配 `*.vercel.app` 域名。

---

## 4. 生产发布后的验证清单

1) 打开首页、商品列表、商品详情页是否正常
2) 访问登录页，使用 seed 的管理员账号登录
3) 下单/结账流程是否能创建订单（依赖数据库写入）

---

## 5. 常见问题排查（高频）

### 5.1 构建时报 DATABASE_URL 未设置

- 确认 Vercel 环境变量已配置到对应环境（Preview/Production）
- 确认 Root Directory 选择正确（否则读不到配置）

### 5.2 迁移失败 / 无法创建表

- 优先确认你在 Vercel 中设置了 **DIRECT_URL（direct）**
- 确认连接串里有 `sslmode=require`

### 5.3 NextAuth 登录后回调异常 / host 相关报错

- 先加上 `AUTH_TRUST_HOST=true`
- 确认 `AUTH_SECRET` 已设置且足够随机

---

## 6. 推荐的日常发布方式

- 开发：本地 `docker-compose.yml` 起 Postgres，或直接连 Neon（看你需求）
- 生产：**Vercel 自动发布**（推荐走 PR → Preview → Merge → Production）

