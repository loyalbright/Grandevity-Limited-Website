import { z, defineCollection } from 'astro:content';

// 定义博客文章的数据结构
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    author: z.string().default('Grandevity Team'),
  }),
});

// 导出集合，Astro 会自动识别
export const collections = {
  'blog': blogCollection,
};