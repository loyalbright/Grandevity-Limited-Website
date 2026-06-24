import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const slug = process.argv[2];

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Usage: npm run new-release -- song-slug');
  process.exit(1);
}

const files = {
  zh: join('src', 'content', 'blog', 'zh', 'music', `${slug}.md`),
  en: join('src', 'content', 'blog', 'en', 'music', `${slug}.md`),
  zhHans: join('src', 'content', 'blog', 'zh-hans', 'music', `${slug}.md`),
  release: join('src', 'data', 'releases', `${slug}.json`),
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
};

const frontmatter = (language) => {
  const isEnglish = language === 'en';
  const isSimplified = language === 'zhHans';

  return `---
title: "${isEnglish ? 'English article title' : isSimplified ? '简体中文文章标题' : '繁體中文文章標題'}"
date: ${today}
description: "${isEnglish ? 'English SEO description.' : isSimplified ? '简体中文 SEO 描述。' : '繁體中文 SEO 描述。'}"
author: "Grandevity Studio"
category: "${isEnglish ? 'Music' : isSimplified ? '音乐' : '音樂'}"
tags: ["${isEnglish ? 'Music' : isSimplified ? '音乐' : '音樂'}", "${isEnglish ? 'Original Music' : isSimplified ? '原创音乐' : '原創音樂'}"]
---

${isEnglish ? 'Write the English release story here.' : isSimplified ? '在此撰写简体中文作品文宣。' : '在此撰寫繁體中文作品文宣。'}
`;
};

for (const path of Object.values(files)) {
  mkdirSync(dirname(path), { recursive: true });
}

writeFileSync(files.zh, frontmatter('zh'));
writeFileSync(files.en, frontmatter('en'));
writeFileSync(files.zhHans, frontmatter('zhHans'));
writeFileSync(files.release, `${JSON.stringify(release, null, 2)}\n`);

console.log(`Created release scaffold for "${slug}":`);
console.log([
  files.zh,
  files.en,
  files.zhHans,
  files.release,
].join('\n'));
