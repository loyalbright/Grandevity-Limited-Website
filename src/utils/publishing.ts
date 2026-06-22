export function isPublished(date: Date, now = new Date()) {
  return date.getTime() <= now.getTime();
}

export function isReleasePublished(
  release: { releaseDate: Date; status: 'draft' | 'scheduled' | 'published' },
  now = new Date(),
) {
  return release.status !== 'draft' && isPublished(release.releaseDate, now);
}
