import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const args = process.argv.slice(2);

const usage = `Usage:
  npm run new-release -- song-slug
  npm run new-release -- song-slug --date 2026-07-01
  npm run new-release -- song-slug --date 2026-07-01 --status scheduled

Publishing order:
  1. Traditional Chinese article
  2. English article
  3. Simplified Chinese article
  4. Release JSON
  5. Publishing kit
`;

if (args.includes('--help') || args.includes('-h')) {
  console.log(usage);
  process.exit(0);
}

const slug = args[0];

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error(usage);
  process.exit(1);
}

const options = {
  date: new Date().toISOString().slice(0, 10),
  status: 'draft',
};

for (let index = 1; index < args.length; index += 1) {
  const arg = args[index];

  if (arg === '--date') {
    options.date = args[index + 1];
    index += 1;
  } else if (arg.startsWith('--date=')) {
    options.date = arg.slice('--date='.length);
  } else if (arg === '--status') {
    options.status = args[index + 1];
    index += 1;
  } else if (arg.startsWith('--status=')) {
    options.status = arg.slice('--status='.length);
  } else {
    console.error(`Unknown option: ${arg}\n\n${usage}`);
    process.exit(1);
  }
}

const isValidDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
};

if (!isValidDate(options.date)) {
  console.error('--date must be a real YYYY-MM-DD calendar date');
  process.exit(1);
}

if (!['draft', 'scheduled', 'published'].includes(options.status)) {
  console.error('--status must be draft, scheduled, or published');
  process.exit(1);
}

const files = {
  zh: join('src', 'content', 'blog', 'zh', 'music', `${slug}.md`),
  en: join('src', 'content', 'blog', 'en', 'music', `${slug}.md`),
  zhHans: join('src', 'content', 'blog', 'zh-hans', 'music', `${slug}.md`),
  release: join('src', 'data', 'releases', `${slug}.json`),
  checklist: join('docs', 'releases', slug, 'checklist.md'),
  youtubeDescription: join('docs', 'releases', slug, 'youtube-description.md'),
  socialPosts: join('docs', 'releases', slug, 'social-posts.md'),
};

const existing = Object.values(files).filter(existsSync);
if (existing.length > 0) {
  console.error(`Refusing to overwrite existing files:\n${existing.join('\n')}`);
  process.exit(1);
}

const release = {
  title: {
    en: 'English Song Title',
    zhHant: '繁體歌名',
    zhHans: '简体歌名',
  },
  releaseDate: options.date,
  youtubeId: 'YOUTUBE_VIDEO_ID',
  articleSlug: slug,
  status: options.status,
};

const templates = {
  zh: {
    title: '繁體中文文章標題',
    description: '繁體中文 SEO 描述。',
    category: '音樂',
    tags: ['音樂', '原創音樂'],
    body: `## 發布筆記

待補：繁體中文主稿。先完成這一版，再翻譯英文與簡體中文。

## 建議段落

待補：歌曲核心意象。
待補：古典來源與現代表達。
待補：適合聆聽的情境。
待補：YouTube / 串流平台導流。
`,
  },
  en: {
    title: 'English article title',
    description: 'English SEO description.',
    category: 'Music',
    tags: ['Music', 'Original Music'],
    body: `## Release Notes

TODO: Translate and adapt from the Traditional Chinese master article after it is finalized.

## Suggested Sections

TODO: Core image of the song.
TODO: Classical source and modern interpretation.
TODO: Listening context.
TODO: YouTube / streaming platform call to action.
`,
  },
  zhHans: {
    title: '简体中文文章标题',
    description: '简体中文 SEO 描述。',
    category: '音乐',
    tags: ['音乐', '原创音乐'],
    body: `## 发布笔记

待补：从繁体中文主稿转换并校对。最后处理简体中文版本。

## 建议段落

待补：歌曲核心意象。
待补：古典来源与现代表达。
待补：适合聆听的情境。
待补：YouTube / 串流平台导流。
`,
  },
};

const releaseUrl = `https://grandevity.co.nz/music/${slug}/`;
const zhReleaseUrl = `https://grandevity.co.nz/zh/music/${slug}/`;
const zhHansReleaseUrl = `https://grandevity.co.nz/zh-hans/music/${slug}/`;

const publishingChecklist = `# Release Checklist: ${slug}

## Core Data

- [ ] Confirm final English title.
- [ ] Confirm final Traditional Chinese title.
- [ ] Confirm final Simplified Chinese title.
- [ ] Confirm release date: ${options.date}
- [ ] Confirm DistroKid submission.
- [ ] Add HyperFollow URL when available.
- [ ] Add direct platform links when available.
- [ ] Add final YouTube video ID.

## Articles

- [ ] Complete Traditional Chinese article.
- [ ] Complete English article.
- [ ] Complete Simplified Chinese article.
- [ ] Remove all TODO / 待補 / 待补 placeholders.
- [ ] Confirm article dates match releaseDate.

## Website QA

- [ ] Run npm run check:releases.
- [ ] Run npm run build.
- [ ] Check English release page: ${releaseUrl}
- [ ] Check Traditional Chinese release page: ${zhReleaseUrl}
- [ ] Check Simplified Chinese release page: ${zhHansReleaseUrl}
- [ ] Confirm YouTube embed loads.
- [ ] Confirm article links work.
- [ ] Confirm language switch works.

## Production

- [ ] Merge PR.
- [ ] Wait for Cloudflare production deployment.
- [ ] Check production release pages.
- [ ] Add release page link to YouTube description.
- [ ] Publish social posts.
`;

const youtubeDescription = `# YouTube Description: ${slug}

TODO: Replace this section with the final YouTube description.

Listen / Read more:
${releaseUrl}

繁體中文：
${zhReleaseUrl}

简体中文：
${zhHansReleaseUrl}

Official site:
https://grandevity.co.nz/music/

Contact:
info@grandevity.co.nz

#GrandevityMusic #Mandopop #OriginalMusic
`;

const socialPosts = `# Social Posts: ${slug}

## English

TODO: Write English announcement.

Listen / watch:
${releaseUrl}

## 繁體中文

待補：撰寫繁體中文發布文案。

收聽 / 觀看：
${zhReleaseUrl}

## 简体中文

待补：撰写简体中文发布文案。

收听 / 观看：
${zhHansReleaseUrl}
`;

const frontmatter = (template) => `---
title: "${template.title}"
date: ${options.date}
description: "${template.description}"
author: "Grandevity Studio"
category: "${template.category}"
tags: [${template.tags.map((tag) => `"${tag}"`).join(', ')}]
---

${template.body}`;

for (const path of Object.values(files)) {
  mkdirSync(dirname(path), { recursive: true });
}

writeFileSync(files.zh, frontmatter(templates.zh));
writeFileSync(files.en, frontmatter(templates.en));
writeFileSync(files.zhHans, frontmatter(templates.zhHans));
writeFileSync(files.release, `${JSON.stringify(release, null, 2)}\n`);
writeFileSync(files.checklist, publishingChecklist);
writeFileSync(files.youtubeDescription, youtubeDescription);
writeFileSync(files.socialPosts, socialPosts);

console.log(`Created release scaffold for "${slug}":`);
console.log([
  `1. ${files.zh}`,
  `2. ${files.en}`,
  `3. ${files.zhHans}`,
  `4. ${files.release}`,
  `5. ${files.checklist}`,
  `6. ${files.youtubeDescription}`,
  `7. ${files.socialPosts}`,
].join('\n'));

console.log(`
Next steps:
- Write the Traditional Chinese article first.
- Translate/adapt the English article second.
- Convert and proofread the Simplified Chinese article third.
- Replace release JSON title values and youtubeId.
- Complete docs/releases/${slug}/ publishing materials.
- Set status to scheduled or published only when all placeholders are removed.
- Run npm run check:releases before committing.
`);