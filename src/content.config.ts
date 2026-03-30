import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders'; // 新增：引入官方的 glob 加载器

const blogCollection = defineCollection({
  // 移除旧版的 type: 'content'，换成全新的 loader
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string().optional(),
    author: z.string().default('Grandevity Team'),
    category: z.string().default('General'),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};