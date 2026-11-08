export const formatBDT = (amount: number): string =>
  '৳' + Math.round(amount).toLocaleString('en-IN');

export const formatCompactBDT = (amount: number): string =>
  amount >= 1e5
    ? `৳${(amount / 1e5).toFixed(amount >= 1e6 ? 1 : 2)}L`
    : amount >= 1e3
      ? `৳${(amount / 1e3).toFixed(1)}K`
      : formatBDT(amount);

export const formatDateTime = (timestamp: number): string =>
  new Date(timestamp).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Dhaka',
  });

export const formatDate = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  });

export const pluralize = (count: number, singular: string, plural = singular + 's'): string =>
  `${count.toLocaleString('en-IN')} ${count === 1 ? singular : plural}`;

export const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

export const formatBytes = (bytes: number): string => {
  if (!bytes || bytes <= 0) return '0 KB';
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};
