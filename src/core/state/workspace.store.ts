/* ============================================================
   NESSA AI — Store do workspace (estado global via signals)
   Persistência real em localStorage + efeitos no <html>.
   ============================================================ */
import type { SettingsState, Toast, ToastTone, UiState, UiTheme } from "../models";
import { STORAGE_KEYS } from "../utils/tokens";
import { computed, createSignal, useSignal } from "./signal";

/* ---------- Configurações ---------- */

export const DEFAULT_SETTINGS: SettingsState = {
  displayName: "",
  role: "",
  language: "pt-BR",
  density: "comfortable",
  reduceMotion: false,
  theme: "dark",
};

function loadSettings(): SettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<SettingsState>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function loadSidebarCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.sidebar) === "1";
  } catch {
    return false;
  }
}

export const settingsSignal = createSignal<SettingsState>(loadSettings());

function applySettingsEffects(settings: SettingsState) {
  try {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  } catch {
    /* armazenamento indisponível — estado segue em memória */
  }
  const root = document.documentElement;
  root.dataset.density = settings.density;
  root.dataset.reduceMotion = String(settings.reduceMotion);
  root.dataset.theme = settings.theme;
}

settingsSignal.subscribe((settings) => applySettingsEffects(settings));
applySettingsEffects(settingsSignal.get());

/* ---------- UI efêmera ---------- */

export const uiSignal = createSignal<UiState>({
  sidebarCollapsed: loadSidebarCollapsed(),
  mobileNavOpen: false,
  toasts: [],
});

/* ---------- Derivações ---------- */

export const operatorName = computed(
  () => settingsSignal.get().displayName.trim() || "Operador",
  [settingsSignal],
);

export function useSettings(): SettingsState {
  return useSignal(settingsSignal);
}

export function useUi(): UiState {
  return useSignal(uiSignal);
}

export function useOperatorName(): string {
  return useSignal(operatorName);
}

export function useTheme(): UiTheme {
  return useSignal(settingsSignal).theme;
}

/* ---------- Ações ---------- */

export function updateSettings(patch: Partial<SettingsState>) {
  settingsSignal.set((prev) => ({ ...prev, ...patch }));
}

export function resetSettings() {
  settingsSignal.set(DEFAULT_SETTINGS);
}

export function toggleTheme() {
  settingsSignal.set((prev) => ({ ...prev, theme: prev.theme === "dark" ? "light" : "dark" }));
}

export function toggleSidebar() {
  uiSignal.set((prev) => {
    const next = !prev.sidebarCollapsed;
    try {
      localStorage.setItem(STORAGE_KEYS.sidebar, next ? "1" : "0");
    } catch {
      /* noop */
    }
    return { ...prev, sidebarCollapsed: next };
  });
}

export function setMobileNav(open: boolean) {
  uiSignal.set((prev) => (prev.mobileNavOpen === open ? prev : { ...prev, mobileNavOpen: open }));
}

let toastSeq = 0;

export function dismissToast(id: number) {
  uiSignal.set((prev) => ({ ...prev, toasts: prev.toasts.filter((t) => t.id !== id) }));
}

export function toast(title: string, tone: ToastTone = "success", description?: string) {
  const id = ++toastSeq;
  uiSignal.set((prev) => ({ ...prev, toasts: [...prev.toasts.slice(-2), { id, title, description, tone }] }));
  window.setTimeout(() => dismissToast(id), 4200);
}
