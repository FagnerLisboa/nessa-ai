/* ============================================================
   NESSA AI — Estado global (core/state)
   Signals nativos do Angular — sem NgRx.

   Contém apenas o estado global realmente necessário:
   currentUser, currentConversation e theme.
   Nenhum dado fictício: sinais iniciam vazios (null).
   ============================================================ */

import { Injectable, computed, inject, signal } from "@angular/core";

import {
  AI_MODELS,
  DEFAULT_AI_MODEL_ID,
  type AiModel,
  type Conversation,
  type UserProfile,
} from "../models";
import { ThemeService } from "../services";

@Injectable({ providedIn: "root" })
export class AppState {
  private readonly themeService = inject(ThemeService);

  /** Usuário autenticado — preenchido quando houver auth (backend). */
  readonly currentUser = signal<UserProfile | null>(null);

  /** Conversa aberta no momento — preenchida pelo fluxo de chat. */
  readonly currentConversation = signal<Conversation | null>(null);

  /**
   * Tema ativo (dark/light).
   * É o MESMO signal do ThemeService — fonte única de verdade,
   * sem duplicação de estado.
   */
  readonly theme = this.themeService.theme;

  /**
   * Modelo de IA selecionado no composer (id estável, ex.: "nessa").
   * Quando o backend expuser o roteamento de motores, este id é o
   * valor a ser enviado no payload do chat — o estado já está aqui.
   */
  readonly selectedModelId = signal<string>(DEFAULT_AI_MODEL_ID);

  /** Modelo selecionado resolvido (rótulo + id) para exibição. */
  readonly selectedModel = computed<AiModel>(() => {
    const id = this.selectedModelId();
    return AI_MODELS.find((model) => model.id === id) ?? AI_MODELS[0];
  });

  setUser(user: UserProfile | null): void {
    this.currentUser.set(user);
  }

  selectModel(modelId: string): void {
    if (AI_MODELS.some((model) => model.id === modelId)) {
      this.selectedModelId.set(modelId);
    }
  }

  setConversation(conversation: Conversation | null): void {
    this.currentConversation.set(conversation);
  }

  clear(): void {
    this.currentUser.set(null);
    this.currentConversation.set(null);
  }
}
