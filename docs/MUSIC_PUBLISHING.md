# Music Publishing

This site publishes each song in three languages:

```text
1. Traditional Chinese
2. English
3. Simplified Chinese
```

The release JSON connects the three articles, the music pages, YouTube embeds, DistroKid links and scheduled publishing.

## Create a release scaffold

Run:

```bash
npm run new-release -- song-slug
```

Optional date and status:

```bash
npm run new-release -- song-slug --date 2026-07-01
npm run new-release -- song-slug --date 2026-07-01 --status scheduled
```

Use lowercase ASCII words separated by hyphens. The command creates files in this order:

```text
src/content/blog/zh/music/song-slug.md
src/content/blog/en/music/song-slug.md
src/content/blog/zh-hans/music/song-slug.md
src/data/releases/song-slug.json
```

## Publishing checklist

Use this checklist for every song.

### 1. Prepare distribution data

- Confirm the song has been submitted in DistroKid.
- Confirm the public release date.
- Copy the DistroKid HyperFollow URL when available.
- Copy direct platform links when available.
- Copy the final YouTube video ID after the MV upload is ready.

Use only the YouTube video ID, not the full URL:

```text
https://www.youtube.com/watch?v=PnUhVeixP6s
youtubeId: PnUhVeixP6s
```

### 2. Write the articles

Write in this order:

1. Finish the Traditional Chinese article in `src/content/blog/zh/music/song-slug.md`.
2. Write the English article in `src/content/blog/en/music/song-slug.md`.
3. Convert and proofread the Simplified Chinese article in `src/content/blog/zh-hans/music/song-slug.md`.

Before publishing, remove all scaffold placeholders:

```text
TODO:
待補：
待补：
```

### 3. Complete release JSON

Edit `src/data/releases/song-slug.json`.

Required fields:

- `title.en`: English song title.
- `title.zhHant`: Traditional Chinese title.
- `title.zhHans`: Simplified Chinese title.
- `releaseDate`: Public release date in `YYYY-MM-DD` format.
- `youtubeId`: The 11-character YouTube video ID.
- `articleSlug`: Keep this identical to the filename.
- `status`: Use `draft`, `scheduled`, or `published`.

Optional fields:

- `classicalSource.en`: English classical author and work.
- `classicalSource.zhHant`: Traditional Chinese classical author and work.
- `classicalSource.zhHans`: Simplified Chinese classical author and work.
- `hyperfollow`: DistroKid HyperFollow URL.
- `platforms`: Direct streaming links.

Status rules:

- `draft`: Hidden from public pages. Placeholders are allowed.
- `scheduled`: Public only after `releaseDate`. Placeholders are not allowed.
- `published`: Public after `releaseDate`. Placeholders are not allowed.

### 4. Validate locally

Run:

```bash
npm run check:releases
npm run build
```

The release checker verifies:

- Each release has three paired articles.
- `articleSlug` matches the release JSON filename.
- `releaseDate` is a real `YYYY-MM-DD` date.
- YouTube IDs use the 11-character ID format.
- Scheduled and published releases do not contain scaffold placeholders.
- Article dates match the release date.
- Article categories match the language.

### 5. Preview before merge

Push the branch and open the Cloudflare Preview URL.

Check these pages:

```text
/music/song-slug/
/zh/music/song-slug/
/zh-hans/music/song-slug/

/blog/music/song-slug/
/zh/blog/music/song-slug/
/zh-hans/blog/music/song-slug/
```

Also check:

- The YouTube embed loads.
- The release page links to the correct article.
- The language switch shows `EN | 繁 | 简`.
- DistroKid or platform links open correctly.
- Future-dated releases do not appear before `releaseDate`.

### 6. Merge and production check

After the PR is merged, wait for the production Cloudflare deployment to finish.

Check the production URLs:

```text
https://grandevity.co.nz/music/song-slug/
https://grandevity.co.nz/zh/music/song-slug/
https://grandevity.co.nz/zh-hans/music/song-slug/
```

## Scheduled publishing

This is a static Astro site. Date-gated releases become public only after a new build.

The repository includes a daily GitHub Actions workflow that calls a Cloudflare Deploy Hook for the `main` branch. Store the hook URL as a GitHub Actions repository secret named `CLOUDFLARE_DEPLOY_HOOK`.

The workflow also supports manual runs from the GitHub Actions tab.

## Public release pages

Published releases automatically generate music landing pages:

```text
/music/song-slug/
/zh/music/song-slug/
/zh-hans/music/song-slug/
```

Use these pages as stable links in YouTube descriptions, social posts, artist profiles and music platform bios.
