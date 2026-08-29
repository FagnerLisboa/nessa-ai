/* ============================================================
   NESSA AI — Modelos de domínio (core/models)
   Contratos tipados que guiarão as Etapas 2 e 3.
   ============================================================ */

export type Stage = 1 | 2 | 3;

export type ModuleId =
  | "home"
  | "chat"
  | "conversations"
  | "agents"
  | "projects"
  | "files"
  | "images"
  | "videos"
  | "voice"
  | "research"
  | "assistant"
  | "settings";

export type NavGroupId = "principal" | "estudio" | "midia" | "descoberta" | "sistema";

export interface NavGroup {
  id: NavGroupId;
  title: string;
}

export interface FeatureModule {
  id: ModuleId;
  label: string;
  path: string;
  icon: string;
  group: NavGroupId;
  /** Etapa do roadmap em que o módulo ganha motor real. */
  stage: Stage;
  /** true quando a base do módulo já está operacional nesta etapa. */
  ready: boolean;
  summary: string;
  capabilities: string[];
}

/* ---------- Preferências persistidas (Reactive Forms → store) ---------- */

export type UiLanguage = "pt-BR" | "en";
export type UiDensity = "comfortable" | "compact";
export type UiTheme = "dark" | "light";

export interface SettingsState {
  displayName: string;
  role: string;
  language: UiLanguage;
  density: UiDensity;
  reduceMotion: boolean;
  theme: UiTheme;
}

export type ToastTone = "success" | "info" | "danger";

export interface Toast {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

export interface UiState {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  toasts: Toast[];
}

/* ---------- Modelos de domínio (contratos para as próximas etapas) ---------- */

export interface Conversation {
  id: string;
  title: string;
  agentId: string | null;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  persona: string;
  tools: string[];
  createdAt: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface FileItem {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  kind: "image" | "video" | "voice";
  url: string;
  createdAt: string;
}
