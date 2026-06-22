import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const slug = process.argv[2];

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Usage: npm run new-release -- song-slug');
  process.exit(1);
}

const files = {
  release: join('src', 'data', 'releases', `${slug}.json`),
  en: join('src', 'content', 'blog', 'en', 'music', `${slug}.md`),
  zh: join('src', 'content', 'blog', 'zh', 'music', `${slug}.md`),
};

const existing = Object.values(files).filter(existsSync);
if (existing.length > 0) {
  console.error(`Refusing to overwrite existing files:\n${existing.join('\n')}`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const release = {
  title: {
    en: 'English Song Title',
    zhHant: '繁體歌名',
    zhHans: '简体歌名',
  },
  releaseDate: today,
  youtubeId: 'YOUTUBE_VIDEO_ID',
  articleSlug: slug,
  status: 'draft',
  classicalSource: '',
};

const frontmatter = (language) => `---
title: "${language === 'en' ? 'English article title' : '繁體中文文章標題'}"
date: ${today}
description: "${language === 'en' ? 'English SEO description.' : '繁體中文 SEO 描述。'}"
author: "Grandevity Studio"
category: "${language === 'en' ? 'Music' : '音樂'}"
tags: ["${language === 'en' ? 'Music' : '音樂'}", "${language === 'en' ? 'Original Music' : '原創音樂'}"]
---

${language === 'en' ? 'Write the English release story here.' : '在此撰寫繁體中文作品文宣。'}
`;

for (const path of Object.values(files)) {
  mkdirSync(dirname(path), { recursive: true });
}

writeFileSync(files.release, `${JSON.stringify(release, null, 2)}\n`);
writeFileSync(files.en, frontmatter('en'));
writeFileSync(files.zh, frontmatter('zh'));

console.log(`Created release scaffold for "${slug}":`);
console.log(Object.values(files).join('\n'));
