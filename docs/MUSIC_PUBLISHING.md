# Music Publishing

## Create a release

Run:

```bash
npm run new-release -- song-slug
```

Use lowercase ASCII words separated by hyphens. The command creates:

```text
src/content/blog/zh/music/song-slug.md
src/content/blog/en/music/song-slug.md
src/content/blog/zh-hans/music/song-slug.md
src/data/releases/song-slug.json
```

## Complete the release data

Edit the generated JSON file:

- `title.en`: English song title.
- `title.zhHant`: Traditional Chinese title.
- `title.zhHans`: Simplified Chinese title.
- `releaseDate`: Public release date in `YYYY-MM-DD` format.
- `youtubeId`: The value after `watch?v=` in the YouTube URL.
- `articleSlug`: Keep this identical to the filename.
- `status`: Use `draft`, `scheduled`, or `published`.
- `classicalSource.en`: Optional English classical author and work.
- `classicalSource.zhHant`: Optional Traditional Chinese classical author and work.
- `classicalSource.zhHans`: Optional Simplified Chinese classical author and work.
- `hyperfollow`: Optional DistroKid HyperFollow URL.
- `platforms`: Optional direct streaming links.

Draft releases never appear publicly. Scheduled and published releases appear only when their release date has arrived.

## Write all language articles

Use this publishing order:

1. Complete the Traditional Chinese article first.
2. Write the English article for international discovery.
3. Generate or adapt the Simplified Chinese article from the Traditional Chinese version, then review it manually.

## Validate and preview

Run:

```bash
npm run build
```

The build checks release data and paired articles before Astro generates the site. Push the working branch and review its Cloudflare Preview URL before merging.

## Scheduled publishing

This is a static Astro site, so date-gated releases become public only after a new build.

The repository includes a daily GitHub Actions workflow that calls a Cloudflare Deploy Hook for the `main` branch. Store the hook URL as a GitHub Actions repository secret named `CLOUDFLARE_DEPLOY_HOOK`.

The workflow also supports manual runs from the GitHub Actions tab.

## Public release pages

Published releases automatically generate music landing pages:

```text
/music/song-slug/
/zh/music/song-slug/
```

Use these pages as the stable links in YouTube descriptions, social posts, artist profiles and music platform bios.
