import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg' // 1. 引入适配器
import { Pool } from 'pg' // 2. 引入原生 node-postgres 连接池

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL
  // ... 检查环境变量 ...
  
  // 3. 创建原生 pg 连接池
  const pool = new Pool({ connectionString })
  // 4. 将原生池包装成 Prisma 适配器
  const adapter = new PrismaPg(pool)
  
  // 5. 注入 adapter 启动 Prisma
  return new PrismaClient({ adapter })
}

// 6. 单例模式 (防止热重载导致连接数爆炸)
export const prisma = globalForPrisma.prisma || createPrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma