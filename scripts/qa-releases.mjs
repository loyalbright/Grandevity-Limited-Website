import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const releasesDir = join('src', 'data', 'releases');
const distDir = 'dist';
const today = new Date().toISOString().slice(0, 10);
const errors = [];

const languages = [
  {
    name: 'English',
    releasePrefix: 'music',
    articlePrefix: 'blog/music',
    classicalSourceKey: 'en',
  },
  {
    name: 'Traditional Chinese',
    releasePrefix: 'zh/music',
    articlePrefix: 'zh/blog/music',
    classicalSourceKey: 'zhHant',
  },
  {
    name: 'Simplified Chinese',
    releasePrefix: 'zh-hans/music',
    articlePrefix: 'zh-hans/blog/music',
    classicalSourceKey: 'zhHans',
  },
];

function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function pagePath(prefix, slug) {
  return join(distDir, prefix, slug, 'index.html');
}

function isPublicRelease(release) {
  return release.status !== 'draft' && release.releaseDate <= today;
}

function addError(message) {
  errors.push(message);
}

function assertFileExists(filePath, message) {
  if (!existsSync(filePath)) {
    addError(`${message}: ${filePath}`);
    return false;
  }

  return true;
}

function assertFileMissing(filePath, message) {
  if (existsSync(filePath)) {
    addError(`${message}: ${filePath}`);
  }
}

function assertContains(html, expected, message) {
  if (!html.includes(expected)) {
    addError(message);
  }
}

if (!existsSync(distDir)) {
  addError('dist directory is missing. Run npm run build before npm run qa:releases.');
}

if (errors.length === 0) {
  const releaseFiles = readdirSync(releasesDir)
    .filter((fileName) => fileName.endsWith('.json'))
    .sort();

  for (const fileName of releaseFiles) {
    const releaseFile = join(releasesDir, fileName);
    const slug = basename(fileName, '.json');
    const release = readJson(releaseFile);

    for (const language of languages) {
      const releasePage = pagePath(language.releasePrefix, slug);
      const articlePage = pagePath(language.articlePrefix, release.articleSlug);

      if (!isPublicRelease(release)) {
        assertFileMissing(
          releasePage,
          `${releaseFile}: hidden ${language.name} release page should not exist`,
        );
        continue;
      }

      const hasReleasePage = assertFileExists(
        releasePage,
        `${releaseFile}: missing ${language.name} release page`,
      );

      assertFileExists(
        articlePage,
        `${releaseFile}: missing ${language.name} article page`,
      );

      if (!hasReleasePage) {
        continue;
      }

      const html = readText(releasePage);

      assertContains(
        html,
        `youtube.com/embed/${release.youtubeId}`,
        `${releasePage}: missing YouTube embed`,
      );

      assertContains(
        html,
        `/${language.articlePrefix}/${release.articleSlug}/`,
        `${releasePage}: missing article link`,
      );

      const classicalSource = release.classicalSource?.[language.classicalSourceKey];

      if (classicalSource) {
        assertContains(
          html,
          classicalSource,
          `${releasePage}: missing classical source ${language.classicalSourceKey}`,
        );
      }

      if (html.includes('/zh-hans/blog/zh-hans/')) {
        addError(`${releasePage}: duplicated zh-hans blog prefix`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Release QA failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log('Release QA passed.');