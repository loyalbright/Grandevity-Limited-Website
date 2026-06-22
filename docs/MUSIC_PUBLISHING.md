# Music Publishing

## Create a release

Run:

```bash
npm run new-release -- song-slug
```

Use lowercase ASCII words separated by hyphens. The command creates:

```text
src/data/releases/song-slug.json
src/content/blog/en/music/song-slug.md
src/content/blog/zh/music/song-slug.md
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
- `classicalSource`: Optional classical author and work.
- `hyperfollow`: Optional DistroKid HyperFollow URL.
- `platforms`: Optional direct streaming links.

Draft releases never appear publicly. Scheduled and published releases appear only when their release date has arrived.

## Write both articles

Complete the English and Traditional Chinese Markdown files. Simplified Chinese support will be added separately.

## Validate and preview

Run:

```bash
npm run build
```

The build checks release data and paired articles before Astro generates the site. Push the working branch and review its Cloudflare Preview URL before merging.
