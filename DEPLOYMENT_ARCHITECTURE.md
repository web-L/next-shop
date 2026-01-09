# 部署方案原理详解

## 一、整体架构原理

### 1.1 技术栈分层

```
┌─────────────────────────────────────────┐
│  用户浏览器 (中国大陆)                    │
└──────────────┬──────────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────────┐
│  Vercel 边缘网络 (全球 CDN)              │
│  - 自动分配域名: *.vercel.app           │
│  - 全球边缘节点 (Edge Network)           │
│  - 自动 HTTPS/SSL                       │
└──────────────┬──────────────────────────┘
               │
               │ 运行时请求
               ▼
┌─────────────────────────────────────────┐
│  Next.js 应用 (Serverless Functions)     │
│  - App Router (RSC)                     │
│  - Server Actions                       │
│  - API Routes                           │
└──────────────┬──────────────────────────┘
               │
               │ DATABASE_URL (pooled)
               ▼
┌─────────────────────────────────────────┐
│  Neon PostgreSQL (托管数据库)            │
│  - Pooled connection (运行时)           │
│  - Direct connection (迁移/seed)        │
└─────────────────────────────────────────┘
```

### 1.2 核心组件说明

#### **Vercel 的作用**
- **CI/CD 平台**：监听 Git 推送，自动构建+部署
- **边缘计算**：Next.js 应用运行在 Vercel 的 Serverless Functions 上
- **全球 CDN**：静态资源（图片/CSS/JS）自动分发到边缘节点
- **自动 HTTPS**：免费 SSL 证书，自动续期

#### **Neon 的作用**
- **托管 PostgreSQL**：无需自己维护数据库服务器
- **连接池管理**：
  - **Pooled**：适合 Serverless（短连接、高并发）
  - **Direct**：适合迁移/DDL（长连接、事务）

#### **Prisma 的作用**
- **ORM 层**：类型安全的数据库访问
- **迁移管理**：`prisma/migrations/` 记录所有 Schema 变更历史
- **连接适配**：通过 `@prisma/adapter-pg` 适配原生 `pg` 连接池

---

## 二、自动发布流程原理

### 2.1 Git Push → 自动部署的完整链路

```
开发者本地
    │
    │ git push origin main
    ▼
┌─────────────────────────────────────────┐
│  GitHub/GitLab (代码仓库)                │
│  - 接收 push 事件                      │
│  - 触发 Webhook                        │
└──────────────┬──────────────────────────┘
               │
               │ Webhook POST
               ▼
┌─────────────────────────────────────────┐
│  Vercel (监听 Webhook)                   │
│  1. 检测到新 commit                     │
│  2. 创建新的 Deployment                 │
│  3. 开始构建流程                        │
└──────────────┬──────────────────────────┘
               │
               │ 执行 Build Command
               │ npm run vercel-build
               ▼
┌─────────────────────────────────────────┐
│  构建阶段 (Build Phase)                  │
│  ┌──────────────────────────────────┐  │
│  │ 1. prisma generate               │  │
│  │    → 生成 Prisma Client          │  │
│  │                                   │  │
│  │ 2. prisma migrate deploy         │  │
│  │    → 读取 prisma/migrations/     │  │
│  │    → 执行未应用的迁移 SQL        │  │
│  │    → 使用 DIRECT_URL (长连接)    │  │
│  │                                   │  │
│  │ 3. next build                    │  │
│  │    → 编译 TypeScript             │  │
│  │    → 构建 React 组件            │  │
│  │    → 生成静态页面 (.next/)       │  │
│  │    → 打包 Serverless Functions   │  │
│  └──────────────────────────────────┘  │
└──────────────┬──────────────────────────┘
               │
               │ 构建成功
               ▼
┌─────────────────────────────────────────┐
│  部署阶段 (Deploy Phase)                 │
│  - 上传构建产物到边缘节点                │
│  - 更新路由配置                         │
│  - 预热 Serverless Functions            │
└──────────────┬──────────────────────────┘
               │
               │ 部署完成
               ▼
┌─────────────────────────────────────────┐
│  生产环境 (Production)                   │
│  - 新版本上线                           │
│  - 旧版本自动下线                       │
│  - 零停机时间                           │
└─────────────────────────────────────────┘
```

### 2.2 关键配置解析

#### **package.json 中的 `vercel-build` 脚本**

```json
"vercel-build": "prisma generate && prisma migrate deploy && next build"
```

**为什么这样设计？**
1. **`prisma generate`**：必须先生成 Client，代码才能编译通过
2. **`prisma migrate deploy`**：在构建时执行迁移，确保数据库结构最新
3. **`next build`**：最后构建应用，此时数据库已准备好

**执行顺序很重要**：
- 如果先 `next build` 再迁移，运行时可能访问到旧 Schema，导致报错
- 如果迁移失败，构建会中断，避免部署不兼容的代码

#### **Vercel 的 Build Command 配置**

在 Vercel 项目设置中，Build Command 填：
```bash
npm run vercel-build
```

Vercel 会：
1. 读取 `package.json` 的 `vercel-build` 脚本
2. 在构建容器中执行
3. 构建容器可以访问环境变量（`DATABASE_URL`、`DIRECT_URL`）
4. 构建容器可以访问 Neon（网络连通）

---

## 三、数据结构修改的处理流程

### 3.1 完整的迁移工作流

#### **场景：你要给 `Product` 表加一个新字段 `tags`**

#### **步骤 1：本地开发环境修改 Schema**

```prisma
// prisma/schema.prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Decimal  @db.Decimal(10, 2)
  image       String?
  stock       Int      @default(0)
  tags        String[] @default([])  // ← 新增字段
  // ... 其他字段
}
```

#### **步骤 2：创建迁移文件（本地）**

```bash
npm run prisma:migrate:dev --name add_product_tags
```

**Prisma 会做什么？**
1. 对比当前 Schema 和数据库实际结构
2. 生成差异 SQL（`ALTER TABLE "Product" ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];`）
3. 在 `prisma/migrations/YYYYMMDDHHMMSS_add_product_tags/` 创建 `migration.sql`
4. **立即执行迁移**（应用到本地数据库）
5. 更新 `_prisma_migrations` 表记录

**生成的文件结构：**
```
prisma/migrations/
  ├── 20260109025320_init/
  │   └── migration.sql
  └── 20260115120000_add_product_tags/  ← 新迁移
      └── migration.sql
```

#### **步骤 3：提交迁移文件到 Git**

```bash
git add prisma/migrations/20260115120000_add_product_tags/
git commit -m "feat: add tags field to Product"
git push origin main
```

**关键点**：
- ✅ **迁移文件必须提交到 Git**（Vercel 构建时需要）
- ✅ **不要手动修改已提交的迁移文件**（破坏历史一致性）
- ❌ **不要在生产环境用 `prisma migrate dev`**（会创建新迁移，破坏流程）

#### **步骤 4：Vercel 自动部署（自动执行迁移）**

当你 `git push` 后：

1. **Vercel 检测到新 commit**
2. **执行 `npm run vercel-build`**
3. **`prisma migrate deploy` 执行**：
   ```sql
   -- Prisma 会检查 _prisma_migrations 表
   -- 发现 20260115120000_add_product_tags 未应用
   -- 执行 migration.sql 中的 ALTER TABLE
   ```
4. **迁移成功后，继续构建**
5. **部署新版本**

**迁移的安全性**：
- `migrate deploy` 是**幂等的**（重复执行不会报错）
- Prisma 用 `_prisma_migrations` 表追踪已应用的迁移
- 如果迁移失败，构建会中断，**不会部署不兼容的代码**

---

### 3.2 迁移的最佳实践

#### **✅ 推荐做法**

1. **本地开发用 `migrate dev`**
   ```bash
   npm run prisma:migrate:dev --name your_migration_name
   ```
   - 自动创建迁移文件
   - 立即应用到本地数据库
   - 适合快速迭代

2. **生产环境用 `migrate deploy`**
   ```bash
   npm run prisma:migrate:deploy
   ```
   - 只执行未应用的迁移
   - 不会创建新迁移文件
   - 适合 CI/CD 自动化

3. **迁移文件必须版本控制**
   - 所有迁移文件提交到 Git
   - 团队成员拉取后，本地也会同步迁移历史

#### **❌ 避免的做法**

1. **不要在生产环境用 `migrate dev`**
   - 会创建新迁移文件（破坏流程）
   - 可能和本地不一致

2. **不要手动修改已提交的迁移**
   - 破坏历史一致性
   - 其他环境执行会失败

3. **不要跳过迁移直接改数据库**
   - Prisma 不知道结构变了
   - 下次迁移会冲突

---

### 3.3 数据迁移（Data Migration）处理

#### **场景：你需要给现有数据填充默认值**

**问题**：Schema 改了，但已有数据需要转换（比如 `tags` 字段，旧数据是 `null`，需要填充 `[]`）

#### **方案 1：在迁移 SQL 中处理（推荐）**

```sql
-- prisma/migrations/20260115120000_add_product_tags/migration.sql

-- 1. 添加列（允许 NULL）
ALTER TABLE "Product" ADD COLUMN "tags" TEXT[];

-- 2. 数据迁移：给 NULL 填充默认值
UPDATE "Product" SET "tags" = ARRAY[]::TEXT[] WHERE "tags" IS NULL;

-- 3. 设置 NOT NULL 约束（如果需要）
ALTER TABLE "Product" ALTER COLUMN "tags" SET NOT NULL;
ALTER TABLE "Product" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[];
```

**如何生成这样的迁移？**

1. 先用 `migrate dev` 生成基础迁移
2. 手动编辑 `migration.sql`，加入数据迁移逻辑
3. 提交到 Git

#### **方案 2：在应用代码中处理（不推荐生产）**

```typescript
// lib/actions/product.ts
export async function getProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  
  // 兼容旧数据
  if (!product.tags) {
    product.tags = [];
  }
  
  return product;
}
```

**缺点**：每次查询都要判断，性能差，且治标不治本

---

### 3.4 回滚迁移（Rollback）

#### **Prisma 不提供自动回滚**

**原因**：回滚 SQL 可能丢失数据（比如 `DROP COLUMN`），Prisma 无法自动生成安全的回滚脚本

#### **手动回滚流程**

1. **创建新的迁移文件，执行反向操作**

```bash
npm run prisma:migrate:dev --name rollback_add_product_tags
```

2. **手动编辑迁移 SQL**

```sql
-- 回滚：删除 tags 列
ALTER TABLE "Product" DROP COLUMN "tags";
```

3. **提交并部署**

**⚠️ 警告**：回滚可能丢失数据，生产环境要谨慎

---

## 四、常见问题与解决方案

### 4.1 迁移在 Vercel 构建时失败

**症状**：构建日志显示 `migrate deploy` 报错

**可能原因**：
1. `DIRECT_URL` 未配置或配置错误
2. Neon 连接超时（网络问题）
3. 迁移 SQL 语法错误

**排查步骤**：
1. 检查 Vercel 环境变量（确认 `DIRECT_URL` 存在）
2. 本地执行 `npm run prisma:migrate:deploy` 验证迁移文件
3. 查看 Vercel 构建日志的详细错误信息

### 4.2 迁移执行了，但应用报错

**症状**：部署成功，但运行时访问数据库报 "column does not exist"

**可能原因**：
1. 迁移执行了，但 Prisma Client 未重新生成
2. 应用代码还在用旧 Schema

**解决方案**：
- 确认 `vercel-build` 脚本顺序：`generate` → `migrate deploy` → `build`
- 如果还是有问题，手动触发一次部署（强制重新构建）

### 4.3 多个环境（Preview/Production）的迁移冲突

**场景**：你同时有 Preview 和 Production 环境，都连同一个 Neon 数据库

**问题**：两个环境同时执行迁移可能冲突

**解决方案**：
- Prisma 的 `_prisma_migrations` 表是共享的，迁移只会执行一次
- 但建议：**Preview 和 Production 用不同的数据库**（Neon 支持多分支）

---

## 五、总结：自动发布的完整流程

### 日常更新（代码变更，无 Schema 变更）

```
1. 本地修改代码
2. git commit && git push
3. Vercel 自动构建（只执行 next build）
4. 自动部署
5. 零停机上线
```

### Schema 变更（数据库结构修改）

```
1. 本地修改 prisma/schema.prisma
2. npm run prisma:migrate:dev --name xxx
3. git add prisma/migrations/xxx/
4. git commit && git push
5. Vercel 自动构建：
   - prisma generate
   - prisma migrate deploy (执行新迁移)
   - next build
6. 自动部署
7. 数据库结构已更新，应用代码兼容新结构
```

### 数据迁移（需要转换现有数据）

```
1. 创建迁移文件（migrate dev）
2. 手动编辑 migration.sql，加入数据迁移逻辑
3. 本地测试迁移
4. git commit && git push
5. Vercel 自动执行迁移（包含数据转换）
6. 部署完成
```

---

## 六、关键要点速查

| 操作 | 本地开发 | 生产环境 (Vercel) |
|------|---------|------------------|
| 创建迁移 | `migrate dev` | ❌ 不要用 |
| 执行迁移 | `migrate dev` (自动) | `migrate deploy` (自动) |
| 生成 Client | `prisma generate` | `prisma generate` (构建时) |
| 填充数据 | `prisma db seed` | ❌ 不要在生产 seed |
| 连接串 | `DATABASE_URL` (docker) | `DATABASE_URL` (pooled) + `DIRECT_URL` (direct) |

---

**记住核心原则**：
- ✅ **迁移文件必须版本控制**
- ✅ **生产环境只用 `migrate deploy`**
- ✅ **构建时自动迁移，确保数据库结构最新**
- ✅ **代码和数据库结构同步更新，避免不兼容**
