import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const releasesDirectory = join('src', 'data', 'releases');
const errors = [];
const youtubeIds = new Map();
const articleSlugs = new Set();

const languages = [
  { key: 'zhHant', dir: 'zh', label: 'Traditional Chinese', category: '音樂' },
  { key: 'en', dir: 'en', label: 'English', category: 'Music' },
  { key: 'zhHans', dir: 'zh-hans', label: 'Simplified Chinese', category: '音乐' },
];

const validStatuses = new Set(['draft', 'scheduled', 'published']);
const placeholderValues = new Set([
  'YOUTUBE_VIDEO_ID',
  'English Song Title',
  '繁體歌名',
  '简体歌名',
  'English article title',
  '繁體中文文章標題',
  '简体中文文章标题',
]);

const placeholderText = [
  'Write the English release story here.',
  '在此撰寫繁體中文作品文宣。',
  '在此撰写简体中文作品文宣。',
];

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isPlaceholder = (value) => typeof value === 'string' && placeholderValues.has(value.trim());
const isHttpUrl = (value) => typeof value === 'string' && /^https?:\/\/\S+$/i.test(value);

function isValidCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function readFrontmatter(path) {
  const source = readFileSync(path, 'utf8');
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { data: null, body: source };

  const data = {};
  for (const line of match[1].split('\n')) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (field) {
      data[field[1]] = field[2].replace(/^["']|["']$/g, '').trim();
    }
  }

  return { data, body: source.slice(match[0].length) };
}

for (const file of readdirSync(releasesDirectory).filter((name) => name.endsWith('.json')).sort()) {
  const path = join(releasesDirectory, file);
  const slug = basename(file, '.json');

  let release;
  try {
    release = JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    errors.push(`${path}: invalid JSON (${error.message})`);
    continue;
  }

  if (release.articleSlug !== slug) {
    errors.push(`${path}: articleSlug must match filename "${slug}"`);
  } else if (articleSlugs.has(release.articleSlug)) {
    errors.push(`${path}: duplicate articleSlug "${release.articleSlug}"`);
  } else {
    articleSlugs.add(release.articleSlug);
  }

  if (!validStatuses.has(release.status)) {
    errors.push(`${path}: status must be draft, scheduled, or published`);
  }

  if (!isValidCalendarDate(release.releaseDate)) {
    errors.push(`${path}: releaseDate must be a real YYYY-MM-DD calendar date`);
  }

  for (const language of languages) {
    const title = release.title?.[language.key];
    if (!isNonEmptyString(title) || isPlaceholder(title)) {
      errors.push(`${path}: title.${language.key} is required and cannot be a placeholder`);
    }
  }

  const isPublicCandidate = release.status === 'scheduled' || release.status === 'published';
  if (!isNonEmptyString(release.youtubeId) || isPlaceholder(release.youtubeId)) {
    if (isPublicCandidate) {
      errors.push(`${path}: ${release.status} releases require a real youtubeId`);
    }
  } else if (!/^[A-Za-z0-9_-]{11}$/.test(release.youtubeId)) {
    errors.push(`${path}: youtubeId should be the 11-character YouTube video ID, not a full URL`);
  } else if (youtubeIds.has(release.youtubeId)) {
    errors.push(`${path}: youtubeId duplicates ${youtubeIds.get(release.youtubeId)}`);
  } else {
    youtubeIds.set(release.youtubeId, path);
  }

  if (release.classicalSource !== undefined) {
    if (typeof release.classicalSource !== 'object' || release.classicalSource === null || Array.isArray(release.classicalSource)) {
      errors.push(`${path}: classicalSource must be an object with en, zhHant and zhHans values`);
    } else {
      for (const language of languages) {
        if (!isNonEmptyString(release.classicalSource[language.key])) {
          errors.push(`${path}: classicalSource.${language.key} is required when classicalSource is provided`);
        }
      }
    }
  }

  if (release.hyperfollow !== undefined && !isHttpUrl(release.hyperfollow)) {
    errors.push(`${path}: hyperfollow must be an http(s) URL when provided`);
  }

  if (release.platforms !== undefined) {
    if (typeof release.platforms !== 'object' || release.platforms === null || Array.isArray(release.platforms)) {
      errors.push(`${path}: platforms must be an object of platformName -> URL`);
    } else {
      for (const [platform, url] of Object.entries(release.platforms)) {
        if (!isHttpUrl(url)) errors.push(`${path}: platforms.${platform} must be an http(s) URL`);
      }
    }
  }

  for (const language of languages) {
    const article = join('src', 'content', 'blog', language.dir, 'music', `${release.articleSlug}.md`);
    if (!existsSync(article)) {
      errors.push(`${path}: missing paired article ${article}`);
      continue;
    }

    const { data, body } = readFrontmatter(article);
    if (!data) {
      errors.push(`${article}: missing frontmatter`);
      continue;
    }

    for (const field of ['title', 'date', 'description', 'category']) {
      if (!isNonEmptyString(data[field]) || isPlaceholder(data[field])) {
        errors.push(`${article}: frontmatter ${field} is required and cannot be a placeholder`);
      }
    }

    if (data.date !== release.releaseDate) {
      errors.push(`${article}: article date must match releaseDate ${release.releaseDate}`);
    }

    if (data.category !== language.category) {
      errors.push(`${article}: category should be "${language.category}"`);
    }

    if (placeholderText.some((text) => body.includes(text))) {
      errors.push(`${article}: replace scaffold placeholder body before publishing`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Release validation failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`Release validation passed (${articleSlugs.size} releases).`);
