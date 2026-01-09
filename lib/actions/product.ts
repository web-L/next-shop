// 核心逻辑，不包含 React 组件
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().min(0.01), // coerce 强制将字符串转为数字
  stock: z.coerce.number().int().min(0),
  categoryId: z.string(),
  // image: z.instanceof(File) // 图片上传稍后处理
});

export async function createProduct(formData: FormData) {
  "use server";

  // 1. 验证数据
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) {
    return { error: "Invalid form data" };
  }

  // 2. 插入数据库
  try {
    await prisma.product.create({
      data: {
        ...parsed.data,
        image: "/images/placeholder.jpg", // 暂时占位
      },
    });
  } catch (e) {
    return { error: "Database Error: Failed to create product." };
  }

  // 3. 刷新缓存 (ISR)
  // 这会告诉 Next.js: "/products" 页面对应的数据变了，下次有人访问时，请重新生成 HTML
  revalidatePath("/products");
  
  // 4. 跳转
  redirect("/products");
}
