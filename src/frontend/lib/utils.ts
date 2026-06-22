export function formatBytes(kb: number): string {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function formatAge(createdAt: string): string {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);
  if (days < 30) return `${days} days old`;
  if (days < 365) return `${Math.floor(days / 30)} months old`;
  return `${Math.floor(days / 365)} years old`;
}

export function formatRelativeDate(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function isValidGitHubUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(\/)?$/.test(url.trim());
}
