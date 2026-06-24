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

const releasesCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/data/releases" }),
  schema: z.object({
    title: z.object({
      en: z.string(),
      zhHant: z.string(),
      zhHans: z.string(),
    }),
    releaseDate: z.coerce.date(),
    youtubeId: z.string(),
    articleSlug: z.string(),
    status: z.enum(['draft', 'scheduled', 'published']).default('published'),
    classicalSource: z.object({
      en: z.string(),
      zhHant: z.string(),
      zhHans: z.string(),
    }).optional(),
    hyperfollow: z.string().url().optional(),
    platforms: z.object({
      spotify: z.string().url().optional(),
      appleMusic: z.string().url().optional(),
      youtubeMusic: z.string().url().optional(),
      tidal: z.string().url().optional(),
    }).optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
  'releases': releasesCollection,
};
