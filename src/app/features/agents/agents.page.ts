import { Component, computed, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";

import type { Agent } from "../../../core/models";
import { AgentsService } from "../../../core/services";
import { ActionMenuComponent, type MenuAction } from "../../shared/components/action-menu.component";
import { PageHeaderComponent } from "../../shared/components/page-header.component";
import { SearchBoxComponent } from "../../shared/components/search-box.component";
import { StateViewComponent } from "../../shared/components/state-view.component";

const MODEL_OPTIONS = ["GPT-4o", "Gemini 2.5 Pro", "Claude Sonnet 4", "Qwen3-Max", "DeepSeek V3"];

@Component({
  selector: "app-agents-page",
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, SearchBoxComponent, StateViewComponent, ActionMenuComponent],
  template: `
    <section class="page">
      <app-page-header title="Agentes" description="Crie assistentes especializados para diferentes tarefas.">
        <button actions type="button" class="btn btn--primary" (click)="formOpen.set(!formOpen())">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Novo agente
        </button>
      </app-page-header>

      @if (formOpen()) {
        <form class="panel form arrive" (ngSubmit)="create()">
          <div class="form__grid">
            <label class="form__field">
              <span class="form__label">Nome</span>
              <input class="input" name="name" [(ngModel)]="formName" placeholder="ex. Redatora" required />
            </label>
            <label class="form__field">
              <span class="form__label">Modelo</span>
              <select class="input" name="model" [(ngModel)]="formModel">
                @for (model of models; track model) {
                  <option [value]="model">{{ model }}</option>
                }
              </select>
            </label>
            <label class="form__field form__field--wide">
              <span class="form__label">Descrição</span>
              <input class="input" name="description" [(ngModel)]="formDescription" placeholder="O que este agente faz?" />
            </label>
          </div>
          <div class="form__actions">
            <button type="button" class="btn btn--ghost btn--sm" (click)="formOpen.set(false)">Cancelar</button>
            <button type="submit" class="btn btn--primary btn--sm" [disabled]="formName.trim().length === 0">Criar agente</button>
          </div>
        </form>
      }

      <div class="toolbar arrive" style="animation-delay: 60ms">
        <app-search-box class="toolbar__search" placeholder="Pesquisar agentes" [value]="query()" (valueChange)="query.set($event)" />
        @if (status() === 'ready') {
          <span class="toolbar__count">{{ filtered().length }} {{ filtered().length === 1 ? "agente" : "agentes" }}</span>
        }
      </div>

      @switch (status()) {
        @case ("loading") {
          <app-state-view kind="loading"></app-state-view>
        }
        @case ("error") {
          <app-state-view kind="error" (retry)="load()"></app-state-view>
        }
        @case ("ready") {
          @if (filtered().length === 0) {
            <app-state-view
              kind="empty"
              title="Nenhum agente encontrado"
              description="Crie um agente especializado para começar a delegar tarefas."
              actionLabel="Novo agente"
              (action)="formOpen.set(true)"
            ></app-state-view>
          } @else {
            <div class="panel arrive" style="animation-delay: 120ms">
              @for (agent of filtered(); track agent.id) {
                <div class="agent row-line">
                  <span class="agent__avatar" aria-hidden="true">{{ agent.monogram }}</span>

                  <div class="agent__body">
                    <p class="agent__name">{{ agent.name }}</p>
                    <p class="agent__desc">{{ agent.description }}</p>
                  </div>

                  <span class="agent__model">{{ agent.model }}</span>

                  <span class="badge" [class.badge--ok]="agent.status === 'ativo'" [class.badge--warn]="agent.status === 'pausado'">
                    <span class="badge__dot"></span>
                    {{ agent.status === "ativo" ? "Ativo" : "Pausado" }}
                  </span>

                  <button type="button" class="btn btn--ghost btn--sm agent__open" (click)="openAgent(agent)">Abrir</button>

                  <app-action-menu [actions]="menuActions" (action)="onAction(agent.id, $event)"></app-action-menu>
                </div>
              }
            </div>
          }
        }
      }

      <p class="notice" role="status" aria-live="polite" [class.is-visible]="notice().length > 0">{{ notice() }}</p>
    </section>
  `,
  styles: `
    .toolbar {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      margin-bottom: 18px;
    }

    .toolbar__search {
      width: 100%;
      max-width: 340px;
    }

    .toolbar__count {
      margin-left: auto;
      font-size: 12.5px;
      font-weight: 500;
      color: var(--nessa-text-muted);
    }

    .form {
      padding: 18px;
      margin-bottom: 18px;
    }

    .form__grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .form__field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form__field--wide {
      grid-column: 1 / -1;
    }

    .form__label {
      font-size: 12px;
      font-weight: 600;
      color: var(--nessa-text-muted);
    }

    .form__actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 16px;
    }

    .agent__avatar {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      flex: none;
      border-radius: var(--radius-full);
      border: 1px solid var(--nessa-primary-ring);
      background: var(--nessa-primary-soft);
      color: var(--nessa-accent);
      font-family: var(--nessa-font-display);
      font-size: 15px;
      font-weight: 700;
    }

    .agent__body {
      flex: 1;
      min-width: 0;
    }

    .agent__name {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--nessa-text);
    }

    .agent__desc {
      margin: 2px 0 0;
      font-size: 12.5px;
      color: var(--nessa-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .agent__model {
      flex: none;
      font-size: 12px;
      font-weight: 600;
      color: var(--nessa-text-muted);
      padding: 4px 10px;
      border: 1px solid var(--nessa-border);
      border-radius: var(--radius-full);
      white-space: nowrap;
    }

    .agent__open {
      flex: none;
    }

    .notice {
      margin: 16px 2px 0;
      min-height: 18px;
      font-size: 12.5px;
      color: var(--nessa-accent);
      opacity: 0;
      transform: translateY(4px);
      transition: opacity var(--t-base) var(--ease-out), transform var(--t-base) var(--ease-out);
    }

    .notice.is-visible {
      opacity: 1;
      transform: none;
    }

    @media (max-width: 900px) {
      .agent__model {
        display: none;
      }
    }

    @media (max-width: 640px) {
      .form__grid {
        grid-template-columns: 1fr;
      }

      .agent__open {
        display: none;
      }

      .agent__desc {
        white-space: normal;
      }
    }
  `,
})
export class AgentsPage {
  private readonly service = inject(AgentsService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly models = MODEL_OPTIONS;
  protected readonly status = signal<"loading" | "ready" | "error">("loading");
  protected readonly items = signal<Agent[]>([]);
  protected readonly query = signal("");
  protected readonly formOpen = signal(false);
  protected readonly notice = signal("");

  protected formName = "";
  protected formDescription = "";
  protected formModel = MODEL_OPTIONS[0];

  protected readonly menuActions: MenuAction[] = [
    { id: "toggle", label: "Pausar / Ativar" },
    { id: "delete", label: "Excluir", danger: true },
  ];

  protected readonly filtered = computed(() => {
    const term = this.query().trim().toLowerCase();
    const all = this.items();
    if (!term) return all;
    return all.filter(
      (agent) =>
        agent.name.toLowerCase().includes(term) ||
        agent.description.toLowerCase().includes(term) ||
        agent.model.toLowerCase().includes(term),
    );
  });

  constructor() {
    this.load();
  }

  protected load(): void {
    this.status.set("loading");
    this.service
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.items.set(data);
          this.status.set("ready");
        },
        error: () => this.status.set("error"),
      });
  }

  protected create(): void {
    if (this.formName.trim().length === 0) return;
    this.service.add({
      name: this.formName.trim(),
      description: this.formDescription.trim() || "Agente personalizado da NESSA.",
      model: this.formModel,
      status: "ativo",
    });
    this.formName = "";
    this.formDescription = "";
    this.formOpen.set(false);
    this.load();
  }

  protected openAgent(agent: Agent): void {
    this.notice.set(`Conversas com ${agent.name} começam quando o motor de IA for conectado.`);
  }

  protected onAction(id: string, actionId: string): void {
    if (actionId === "toggle") {
      this.service.toggleStatus(id);
    } else if (actionId === "delete") {
      this.service.remove(id);
    }
    this.load();
  }
}
