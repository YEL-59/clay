import React from 'react';

export const ICON_PATHS: Record<string, string> = {
  search: 'M11 4.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm5 11.5 4 4',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  bag: 'M6 8h12l-1 12H7zm3 0V6.5a3 3 0 0 1 6 0V8',
  box: 'M4 8 12 4l8 4v8l-8 4-8-4zm0 0 8 4 8-4m-8 4v8',
  truck:
    'M3 6.5h11v9H3zm11 3h4l3 3v3h-7m-9 2.5a1.8 1.8 0 1 0 0-.1m11 .1a1.8 1.8 0 1 0 0-.1',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  users:
    'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm-6 9a6 6 0 0 1 12 0m1-9a3 3 0 1 0 0-6m2 15h3a5 5 0 0 0-4-5',
  ruler: 'M3 15 15 3l6 6L9 21l-6-6zm4-2 2 2m1-5 2 2m1-5 2 2',
  tag: 'M3.5 12.5V4h8.5l8.5 8.5-8.5 8.5zM8 8.5h.01',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0-6.2 2 2.1 2.9-.4.7 2.8 2.6 1.4-1 2.8 1 2.8-2.6 1.4-.7 2.8-2.9-.4-2 2.1-2-2.1-2.9.4-.7-2.8-2.6-1.4 1-2.8-1-2.8 2.6-1.4.7-2.8 2.9.4z',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0-5.5v2m0 15v2M4.6 4.6 6 6m12 12 1.4 1.4M2.5 12h2m15 0h2M4.6 19.4 6 18M18 6l1.4-1.4',
  moon: 'M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z',
  bell: 'M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zm4 4.5a2 2 0 0 0 4 0',
  store:
    'M4 9.5 5.5 4h13L20 9.5M4 9.5h16M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M5.5 12.5V20h13v-7.5M10 20v-4.5h4V20',
  out: 'M8 16 16 8m-6 0h6v6',
  dots: 'M5.5 12h.01M12 12h.01M18.5 12h.01',
  close: 'M6 6l12 12M18 6 6 18',
  alert: 'M12 4 2.8 19.5h18.4zm0 6v4m0 3h.01',
  return: 'M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3',
  trend: 'M3.5 16.5 9 11l4 4 7.5-7.5M15 7.5h5.5V13',
  grid: 'M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z',
  list: 'M8.5 6.5h12m-12 5.5h12m-12 5.5h12M4 6.5h.01M4 12h.01M4 17.5h.01',
  download: 'M12 4v11.5M7 10.5l5 5 5-5M5 19.5h14',
  clock: 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM12 7.5V12l3 2',
  cash: 'M3 6.5h18v11H3zm9 3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6 9.5h.01M18 14.5h.01',
  sparkle: 'M12 3.5 13.8 10.2 20.5 12l-6.7 1.8L12 20.5l-1.8-6.7L3.5 12l6.7-1.8z',
  shirt: 'M8.5 3.5 4 6l1.5 4.5L8 9.6V20.5h8V9.6l2.5.9L20 6l-4.5-2.5a3.5 3.5 0 0 1-7 0z',
  home: 'M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4z',
  note: 'M5 4h14v16H5zm4 5h6m-6 4h6m-6 4h3',
  undo: 'M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3',
  arrowR: 'M5 12h14m-6-6 6 6-6 6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  calendar: 'M3.5 5h17v15.5h-17zm0 5h17M8 3v4m8-4v4',
  folder: 'M3.5 6.5h6l2 2.5h9v10.5h-17z',
  image: 'M4 5h16v14H4zm3.5 4.5a1.5 1.5 0 1 0 0 .01M4 16l4.5-4.5 3.5 3.5 3-3 5 4',
  offline: 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zm-3.5 9 2.5 2.5 5-5',
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 18, className = '' }) => (
  <svg
    className={`ico ${className}`}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-hidden="true"
  >
    <path d={ICON_PATHS[name] ?? ICON_PATHS.dots} />
  </svg>
);
