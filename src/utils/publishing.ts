export function isPublished(date: Date, now = new Date()) {
  return date.getTime() <= now.getTime();
}
