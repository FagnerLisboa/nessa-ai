/* ============================================================
   NESSA AI — Constantes de sistema
   Breakpoints espelham src/styles/_vars.scss
   ============================================================ */

export const APP_NAME = "NESSA";
export const APP_SUFFIX = "AI";
export const TAGLINE = "Complexidade interna. Simplicidade externa.";
export const VERSION = "0.1.0";
export const STAGE_LABEL = "Etapa 1 · Fundação";

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  shell: 1200,
  xl: 1280,
  "2xl": 1536,
} as const;

export type BreakpointId = keyof typeof BREAKPOINTS;

export const STORAGE_KEYS = {
  settings: "nessa:settings:v1",
  sidebar: "nessa:sidebar:v1",
} as const;

export interface TokenEntry {
  name: string;
  value: string;
}

export interface TokenGroup {
  group: string;
  tokens: TokenEntry[];
}

/** Folha de tokens real do design system (nessa-theme.scss). */
export const DESIGN_TOKENS: TokenGroup[] = [
  {
    group: "Cor",
    tokens: [
      { name: "--nessa-background", value: "#0B0B10" },
      { name: "--nessa-surface", value: "#111118" },
      { name: "--nessa-surface-2", value: "#171720" },
      { name: "--nessa-surface-hover", value: "#1E1E2A" },
      { name: "--nessa-border", value: "#292936" },
      { name: "--nessa-text", value: "#F5F5F7" },
      { name: "--nessa-text-muted", value: "#A1A1AA" },
      { name: "--nessa-primary", value: "#8B5CF6" },
      { name: "--nessa-primary-hover", value: "#7C3AED" },
      { name: "--nessa-secondary", value: "#6366F1" },
      { name: "--nessa-accent", value: "#A78BFA" },
      { name: "--nessa-success", value: "#22C55E" },
      { name: "--nessa-warning", value: "#F59E0B" },
      { name: "--nessa-danger", value: "#EF4444" },
    ],
  },
  {
    group: "Raio",
    tokens: [
      { name: "--radius-sm", value: "8px" },
      { name: "--radius-md", value: "12px" },
      { name: "--radius-lg", value: "16px" },
      { name: "--radius-xl", value: "20px" },
    ],
  },
  {
    group: "Sombra",
    tokens: [
      { name: "--shadow-sm", value: "0 2px 10px rgba(0,0,0,.35)" },
      { name: "--shadow-md", value: "0 10px 28px rgba(0,0,0,.45)" },
      { name: "--shadow-glow", value: "ring violeta + difusão" },
    ],
  },
  {
    group: "Movimento",
    tokens: [
      { name: "--t-fast", value: "150ms" },
      { name: "--t-base", value: "250ms" },
      { name: "--t-slow", value: "480ms" },
      { name: "--ease-out", value: "cubic-bezier(.22,.61,.36,1)" },
    ],
  },
  {
    group: "Espaço",
    tokens: [
      { name: "--space-1", value: "4px" },
      { name: "--space-3", value: "12px" },
      { name: "--space-6", value: "24px" },
      { name: "--space-9", value: "48px" },
      { name: "--space-12", value: "96px" },
    ],
  },
];
