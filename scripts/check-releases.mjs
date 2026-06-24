import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const releasesDirectory = join('src', 'data', 'releases');
const errors = [];
const youtubeIds = new Map();

for (const file of readdirSync(releasesDirectory).filter((name) => name.endsWith('.json'))) {
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
  }

  if (!release.title?.en || !release.title?.zhHant || !release.title?.zhHans) {
    errors.push(`${path}: en, zhHant and zhHans titles are required`);
  }

  if (release.classicalSource !== undefined) {
    if (typeof release.classicalSource !== 'object' || release.classicalSource === null || Array.isArray(release.classicalSource)) {
      errors.push(`${path}: classicalSource must be an object with en, zhHant and zhHans values`);
    } else if (!release.classicalSource.en || !release.classicalSource.zhHant || !release.classicalSource.zhHans) {
      errors.push(`${path}: classicalSource.en, classicalSource.zhHant and classicalSource.zhHans are required when classicalSource is provided`);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(release.releaseDate ?? '')) {
    errors.push(`${path}: releaseDate must use YYYY-MM-DD`);
  }

  if (!release.youtubeId || release.youtubeId === 'YOUTUBE_VIDEO_ID') {
    errors.push(`${path}: replace the YouTube placeholder before publishing`);
  } else if (youtubeIds.has(release.youtubeId)) {
    errors.push(`${path}: YouTube ID duplicates ${youtubeIds.get(release.youtubeId)}`);
  } else {
    youtubeIds.set(release.youtubeId, path);
  }

  for (const language of ['zh', 'en', 'zh-hans']) {
    const article = join('src', 'content', 'blog', language, 'music', `${release.articleSlug}.md`);
    if (!existsSync(article)) {
      errors.push(`${path}: missing paired article ${article}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Release validation failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`Release validation passed (${youtubeIds.size} releases).`);
