import { Component, computed, inject, OnInit, signal } from "@angular/core";

import { ActivatedRoute } from "@angular/router";

import {
  ConversationService,
  type ConversationDetail,
} from "../../../core/services";

import { AppState } from "../../../core/state/app.state";

import { NessaLogoComponent } from "../../shared/components/nessa-logo/nessa-logo.component";

import { NessaComposerComponent } from "../shell/nessa-composer/nessa-composer.component";

import { SuggestionsComponent } from "../shell/suggestions/suggestions.component";

/** Tela inicial — palco central com o composer como protagonista. */
@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [NessaLogoComponent, NessaComposerComponent, SuggestionsComponent],
  template: `
    <section class="stage">
      @if (messages().length > 0) {
        <div class="conversation">
          @for (message of messages(); track message.id) {
            <article
              class="message"
              [class.message--user]="message.role === 'user'"
              [class.message--assistant]="message.role === 'assistant'"
            >
              <div class="message__role">
                {{ message.role === "user" ? "Você" : "NESSA" }}
              </div>

              <div class="message__content">
                {{ message.content }}
              </div>
            </article>
          }
        </div>
      } @else {
        <app-nessa-logo class="stage__logo" [size]="56"></app-nessa-logo>

        <p class="stage__wordmark">NESSA</p>

        <h2 class="stage__title">Como posso ajudar você hoje?</h2>

        <p class="stage__subtitle">
          Converse, crie, pesquise e transforme suas ideias.
        </p>
      }

      <div class="stage__composer">
        <app-nessa-composer
          [seed]="seed()"
          [seedTick]="seedTick()"
        ></app-nessa-composer>
      </div>

      @if (messages().length === 0) {
        <app-suggestions
          class="stage__suggestions"
          (picked)="onSuggestion($event)"
        ></app-suggestions>
      }
    </section>
  `,
  styles: `
    :host {
      position: relative;
      z-index: 1;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .stage {
      width: 100%;
      max-width: 760px;
      margin: auto;
      padding: 44px 20px 56px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .stage__logo {
      margin-top: 20px;
    }

    .stage__wordmark {
      margin: 20px 0 0;
      font-family: var(--nessa-font-display);
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.46em;
      text-indent: 0.46em;
      color: var(--nessa-text);
    }

    .stage__title {
      margin: 18px 0 0;
      max-width: 18ch;
      font-family: var(--nessa-font-display);
      font-size: clamp(26px, 4.2vw, 38px);
      font-weight: 600;
      line-height: 1.16;
      letter-spacing: -0.02em;
      color: var(--nessa-text);
    }

    .stage__subtitle {
      margin: 12px 0 0;
      max-width: 42ch;
      font-size: 15px;
      line-height: 1.65;
      color: var(--nessa-text-muted);
    }

    .conversation {
      width: 100%;
      margin-bottom: 28px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      text-align: left;
    }

    .message {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .message--user {
      align-items: flex-end;
    }

    .message--assistant {
      align-items: flex-start;
    }

    .message__role {
      font-size: 12px;
      font-weight: 700;
      color: var(--nessa-text-muted);
    }

    .message__content {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 15px;
      line-height: 1.6;
      white-space: pre-wrap;
      color: var(--nessa-text);
      background: var(--nessa-surface);
      border: 1px solid var(--nessa-border);
    }

    .message--user .message__content {
      border-radius: 16px 16px 4px 16px;
    }

    .message--assistant .message__content {
      border-radius: 16px 16px 16px 4px;
    }

    .stage__composer {
      width: 100%;
      max-width: 720px;
      margin-top: 36px;
      text-align: left;
    }

    .stage__suggestions {
      margin-top: 18px;
      width: 100%;
      max-width: 100%;
    }

    @media (max-width: 479.98px) {
      .stage {
        padding: 32px 16px 44px;
      }

      .message__content {
        max-width: 92%;
      }
    }

    @keyframes stage-arrive {
      from {
        opacity: 0;
        transform: translateY(14px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .stage > * {
      animation: stage-arrive 0.65s var(--ease-out) both;
    }

    @media (prefers-reduced-motion: reduce) {
      .stage > * {
        animation: none;
      }
    }
  `,
})
export class HomePage implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly conversationService = inject(ConversationService);

  private readonly appState = inject(AppState);

  /** Texto repassado ao composer quando uma sugestão é escolhida. */
  protected readonly seed = signal("");

  protected readonly seedTick = signal(0);

  /** Mensagens da conversa atual, atualizadas automaticamente pelo AppState. */
  protected readonly messages = computed(
    () => this.appState.currentConversation()?.messages ?? [],
  );

  ngOnInit(): void {
    // Lê o query param 'id' para carregar conversa existente do histórico
    this.route.queryParams.subscribe((params) => {
      const conversationId = params["id"];

      if (conversationId) {
        this.conversationService.get(conversationId).subscribe({
          next: (detail: ConversationDetail) => {
            this.appState.setConversation(detail);
          },
          error: () => {
            // Se falhar ao carregar, limpa a conversa atual
            this.appState.setConversation(null);
          },
        });
      } else {
        // Sem ID: nova conversa
        this.appState.setConversation(null);
      }
    });
  }

  protected onSuggestion(text: string): void {
    this.seed.set(text);

    this.seedTick.update((tick) => tick + 1);
  }
}
