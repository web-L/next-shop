import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

// 在 Prisma 7 中，使用 engine type "client" 需要提供 adapter
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// 随机选择图片的函数
function getRandomImage(): string {
  const imageNumbers = [1, 2, 3, 4, 5, 6, 7]
  const randomIndex = Math.floor(Math.random() * imageNumbers.length)
  return `/images/${imageNumbers[randomIndex]}.jpeg`
}

async function main() {
  // 1. 清理现有数据 (可选，避免重复运行报错，或使用 upsert)
  // 注意：真实生产环境慎用 deleteMany
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  console.log('Deleted old data')

  // 2. 创建分类
  const industrialEquipment = await prisma.category.create({
    data: { name: '工业设备' },
  })

  // 3. 根据 prompts.txt 中的产品信息创建商品
  const products = [
    {
      name: 'JUKI RS1贴片机',
      description: 'JUKI RS1 SMT 贴片机，高精度表面贴装技术设备，适用于电子制造业的自动化生产。',
      price: 285000.00,
      stock: 3,
    },
    {
      name: '劲拓10温区回流焊',
      description: '劲拓10温区回流焊设备，精确控制温度曲线，确保焊接质量，适用于SMT生产线。',
      price: 125000.00,
      stock: 5,
    },
    {
      name: '全自动印刷机',
      description: '全自动丝网印刷机，高精度印刷，适用于PCB板锡膏印刷工艺，提升生产效率。',
      price: 85000.00,
      stock: 8,
    },
    {
      name: '光学检测AOI',
      description: '自动光学检测系统（AOI），用于PCB板质量检测，自动识别焊接缺陷和元件错位。',
      price: 195000.00,
      stock: 4,
    },
    {
      name: 'KIC炉温测试仪',
      description: 'KIC炉温测试仪，实时监测回流焊炉温度曲线，确保焊接工艺参数准确。',
      price: 45000.00,
      stock: 10,
    },
    {
      name: 'X-RAY BGA检测设备',
      description: 'X-RAY BGA检测设备，用于BGA封装元件的内部结构检测，确保焊接质量。',
      price: 320000.00,
      stock: 2,
    },
    {
      name: 'SPI锡膏检测',
      description: 'SPI锡膏检测系统，检测锡膏印刷质量，包括厚度、体积和形状，确保印刷精度。',
      price: 165000.00,
      stock: 6,
    },
    {
      name: '日东波峰焊',
      description: '日东波峰焊设备，适用于通孔元件的焊接，稳定可靠的焊接质量。',
      price: 185000.00,
      stock: 4,
    },
    {
      name: '安达自动三防漆喷雾机',
      description: '安达自动三防漆喷雾机，自动喷涂三防漆，保护PCB板免受环境侵蚀。',
      price: 95000.00,
      stock: 7,
    },
    {
      name: '自动PCB清洗机',
      description: '自动PCB清洗机，高效清洗PCB板，去除助焊剂残留，保证产品质量。',
      price: 75000.00,
      stock: 9,
    },
  ]

  // 创建商品，随机分配图片
  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        image: getRandomImage(),
        categoryId: industrialEquipment.id,
      },
    })
    console.log(`Created product: ${product.name}`)
  }

  // 4. 创建测试用户 (管理员)
  const hashedPassword = await bcrypt.hash('password123', 10)
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('Created admin user: admin@example.com / password123')

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
