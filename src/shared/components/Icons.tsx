/* ============================================================
   NESSA AI — Ícones (shared/components)
   Traço próprio, 24px, herdam currentColor.
   ============================================================ */
import type { ReactElement } from "react";
import { cn } from "../../core/utils";

const ICONS = {
  home: (
    <>
      <path d="M4 11.2 12 4.4l8 6.8" />
      <path d="M6.4 9.9v9.3h11.2V9.9" />
      <path d="M10.2 19.2v-4.4h3.6v4.4" />
    </>
  ),
  chat: (
    <path d="M12 4.2c-4.6 0-8 2.9-8 6.6 0 1.7.7 3.2 1.9 4.4-.1 1.2-.5 2.4-1.3 3.3 1.6-.1 3-.6 4.1-1.4.9.3 2 .4 3.3.4 4.6 0 8-2.9 8-6.6S16.6 4.2 12 4.2Z" />
  ),
  stack: (
    <>
      <path d="m12 3.8 7.8 4.1L12 12 4.2 7.9Z" />
      <path d="m4.6 12.2 7.4 3.9 7.4-3.9" />
      <path d="m4.6 16.1 7.4 3.9 7.4-3.9" />
    </>
  ),
  nodes: (
    <>
      <circle cx="5.5" cy="6" r="2" />
      <circle cx="18.5" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M7.5 6h9M6.4 7.8l4.4 8.4M17.6 7.8l-4.4 8.4" />
    </>
  ),
  folder: (
    <path d="M3.6 6.8c0-.9.7-1.6 1.6-1.6h4.1l1.9 2h7.6c.9 0 1.6.7 1.6 1.6v8.4c0 .9-.7 1.6-1.6 1.6H5.2c-.9 0-1.6-.7-1.6-1.6Z" />
  ),
  doc: (
    <>
      <path d="M6 3.8h8l4 4v12.4H6Z" />
      <path d="M14 3.8v4h4M9 12h6M9 15.4h6" />
    </>
  ),
  image: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.4" />
      <path d="m5.5 17.5 4.5-4 3 2.6 2.5-2.1 3 3.5" />
    </>
  ),
  play: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2.5" />
      <path d="m10.4 9.2 4.6 2.8-4.6 2.8Z" />
    </>
  ),
  wave: <path d="M4 10v4M8 7.5v9M12 5v14M16 7.5v9M20 10v4" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="m15.2 8.8-1.8 4.6-4.6 1.8 1.8-4.6Z" />
    </>
  ),
  spark: (
    <path d="M12 3.5c.7 4.6 3.9 7.8 8.5 8.5-4.6.7-7.8 3.9-8.5 8.5-.7-4.6-3.9-7.8-8.5-8.5 4.6-.7 7.8-3.9 8.5-8.5Z" />
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M12 3.4v2.2M12 18.4v2.2M3.4 12h2.2M18.4 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" />
    </>
  ),
  menu: <path d="M4.5 7h15M4.5 12h15M4.5 17h15" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  "chevron-left": <path d="m14.5 6-6 6 6 6" />,
  "chevron-right": <path d="m9.5 6 6 6-6 6" />,
  "chevron-down": <path d="m6 9.5 6 6 6-6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  alert: (
    <>
      <path d="M12 4.6 21 19H3Z" />
      <path d="M12 10v4M12 16.6v.2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 11v5M12 7.8v.2" />
    </>
  ),
  send: (
    <>
      <path d="M20.5 3.5 3.5 10.2l6.6 2.2 2.4 7.1Z" />
      <path d="m10.1 12.4 10.4-8.9" />
    </>
  ),
  panel: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M9.5 4.5v15" />
    </>
  ),
  "arrow-right": <path d="M4.5 12h15M13.5 6l6 6-6 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.4" r="3.4" />
      <path d="M5 19.5c.8-3.4 3.6-5.3 7-5.3s6.2 1.9 7 5.3" />
    </>
  ),
  lock: (
    <>
      <rect x="5.5" y="10.5" width="13" height="9" rx="2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <path d="M8.2 18H14a4 4 0 0 0 4-4V8.2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m19.5 19.5-4-4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  clip: (
    <path d="m16.8 7.3-6.2 6.2a2.1 2.1 0 0 0 3 3l6.2-6.2a4.2 4.2 0 0 0-6-6L7.6 10.5a6.3 6.3 0 0 0 9 9l5.2-5.2" />
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v1.8M12 19.2V21M3 12h1.8M19.2 12H21M5.6 5.6l1.3 1.3M17.1 17.1l1.3 1.3M18.4 5.6l-1.3 1.3M6.9 17.1l-1.3 1.3" />
    </>
  ),
  moon: <path d="M20 13.6A8.2 8.2 0 0 1 10.4 4a8.2 8.2 0 1 0 9.6 9.6Z" />,
  code: <path d="m8.5 6.5-5 5.5 5 5.5M15.5 6.5l5 5.5-5 5.5" />,
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 18, className, strokeWidth = 1.6 }: IconProps) {
  const node: ReactElement = <>{ICONS[name]}</>;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      {node}
    </svg>
  );
}
