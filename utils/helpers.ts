export function getLocalISOString(date: Date = new Date()): string {
  const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOString = new Date(date.getTime() - tzOffset)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  return localISOString;
}