/* ============================================================
   NESSA AI — Estado global (core/state)
   Signals nativos do Angular — sem NgRx.

   Contém apenas o estado global realmente necessário:
   currentUser, currentConversation e theme.
   Nenhum dado fictício: sinais iniciam vazios (null).
   ============================================================ */

import { Injectable, inject, signal } from "@angular/core";

import type { Conversation, UserProfile } from "../models";
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

  setUser(user: UserProfile | null): void {
    this.currentUser.set(user);
  }

  setConversation(conversation: Conversation | null): void {
    this.currentConversation.set(conversation);
  }

  clear(): void {
    this.currentUser.set(null);
    this.currentConversation.set(null);
  }
}
