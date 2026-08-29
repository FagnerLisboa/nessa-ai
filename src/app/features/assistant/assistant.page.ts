import { Component, computed, inject, signal } from "@angular/core";

import { AssistantService } from "../../../core/services";
import { PageHeaderComponent } from "../../shared/components/page-header.component";

const SUGGESTIONS = [
  "Resumir os e-mails da semana",
  "Preparar pauta da próxima reunião",
  "Revisar o rascunho do artigo",
];

const QUICK_ACTIONS = [
  { id: "summarize", label: "Resumir o dia" },
  { id: "organize", label: "Organizar arquivos" },
  { id: "script", label: "Criar roteiro" },
  { id: "review", label: "Revisar texto" },
];

@Component({
  selector: "app-assistant-page",
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <section class="page">
      <app-page-header
        title="Assistente"
        description="Um espaço para a NESSA ajudar você de forma proativa."
      ></app-page-header>

      <div class="grid">
        <!-- Tarefas -->
        <section class="panel block arrive" style="animation-delay: 60ms" aria-label="Tarefas">
          <div class="block__head">
            <h2 class="block__title">Tarefas</h2>
            <span class="block__count">{{ doneCount() }} de {{ tasks().length }} concluídas</span>
          </div>

          <div class="progress" role="progressbar" [attr.aria-valuenow]="progressPct()" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso das tarefas">
            <span class="progress__fill" [style.width.%]="progressPct()"></span>
          </div>

          <ul class="tasks">
            @for (task of tasks(); track task.id) {
              <li class="task">
                <button
                  type="button"
                  class="task__check"
                  [class.is-done]="task.done"
                  (click)="service.toggleTask(task.id)"
                  [attr.aria-label]="task.done ? 'Desmarcar tarefa' : 'Concluir tarefa'"
                >
                  @if (task.done) {
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                  }
                </button>
                <span class="task__label" [class.is-done]="task.done">{{ task.label }}</span>
              </li>
            }
          </ul>
        </section>

        <div class="stack">
          <!-- Sugestões -->
          <section class="panel block arrive" style="animation-delay: 120ms" aria-label="Sugestões">
            <h2 class="block__title">Sugestões</h2>
            <ul class="suggestions">
              @for (suggestion of suggestions; track suggestion) {
                <li class="suggestion">
                  <span class="suggestion__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 3.5c.7 4.6 3.9 7.8 8.5 8.5-4.6.7-7.8 3.9-8.5 8.5-.7-4.6-3.9-7.8-8.5-8.5 4.6-.7 7.8-3.9 8.5-8.5Z" />
                    </svg>
                  </span>
                  <span class="suggestion__label">{{ suggestion }}</span>
                  <button type="button" class="btn btn--ghost btn--sm" (click)="adopt(suggestion)">Usar</button>
                </li>
              }
            </ul>
          </section>

          <!-- Ações rápidas -->
          <section class="panel block arrive" style="animation-delay: 180ms" aria-label="Ações rápidas">
            <h2 class="block__title">Ações rápidas</h2>
            <div class="quick">
              @for (action of quickActions; track action.id) {
                <button type="button" class="quick__btn" (click)="runAction(action.label)">
                  {{ action.label }}
                </button>
              }
            </div>
            <p class="quick__notice" role="status" aria-live="polite" [class.is-visible]="actionNotice().length > 0">
              {{ actionNotice() }}
            </p>
          </section>
        </div>

        <!-- Atividade recente -->
        <section class="panel block arrive" style="animation-delay: 240ms" aria-label="Atividades recentes">
          <h2 class="block__title">Atividades recentes</h2>
          <ul class="activity">
            @for (item of activities(); track item.id) {
              <li class="activity__item">
                <span class="activity__dot" aria-hidden="true"></span>
                <span class="activity__label">{{ item.label }}</span>
                <span class="activity__time">{{ item.timeLabel }}</span>
              </li>
            }
          </ul>
        </section>
      </div>
    </section>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: 1.15fr 1fr;
      gap: 16px;
      align-items: start;
    }

    .stack {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .block {
      padding: 18px 20px 20px;
    }

    .block__head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
    }

    .block__title {
      margin: 0 0 14px;
      font-family: var(--nessa-font-display);
      font-size: 15px;
      font-weight: 650;
      color: var(--nessa-text);
    }

    .block__count {
      font-size: 12px;
      font-weight: 500;
      color: var(--nessa-text-muted);
      white-space: nowrap;
    }

    .progress {
      height: 5px;
      border-radius: var(--radius-full);
      background: var(--nessa-surface-2);
      overflow: hidden;
      margin-bottom: 14px;
    }

    .progress__fill {
      display: block;
      height: 100%;
      border-radius: var(--radius-full);
      background: linear-gradient(90deg, var(--nessa-primary), var(--nessa-secondary));
      transition: width 0.5s var(--ease-out);
    }

    .tasks {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .task {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 9px 0;
    }

    .task + .task {
      border-top: 1px solid var(--nessa-hairline);
    }

    .task__check {
      display: grid;
      place-items: center;
      width: 20px;
      height: 20px;
      flex: none;
      border: 1.5px solid var(--nessa-border);
      border-radius: 6px;
      background: transparent;
      color: var(--nessa-background);
      cursor: pointer;
      transition: background var(--t-fast) var(--ease-out), border-color var(--t-fast) var(--ease-out),
        transform var(--t-fast) var(--ease-spring);
    }

    .task__check:hover {
      border-color: var(--nessa-accent);
      transform: scale(1.08);
    }

    .task__check.is-done {
      background: var(--nessa-primary);
      border-color: var(--nessa-primary);
      color: var(--nessa-text);
    }

    .task__label {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--nessa-text);
      transition: color var(--t-base) var(--ease-out), opacity var(--t-base) var(--ease-out);
    }

    .task__label.is-done {
      color: var(--nessa-text-muted);
      text-decoration: line-through;
      text-decoration-color: color-mix(in srgb, var(--nessa-text-muted) 60%, transparent);
    }

    .suggestions {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .suggestion {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 4px;
    }

    .suggestion__icon {
      display: grid;
      place-items: center;
      width: 26px;
      height: 26px;
      flex: none;
      border-radius: var(--radius-full);
      background: var(--nessa-primary-soft);
      color: var(--nessa-accent);
    }

    .suggestion__label {
      flex: 1;
      min-width: 0;
      font-size: 13px;
      font-weight: 500;
      color: var(--nessa-text);
    }

    .quick {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .quick__btn {
      padding: 10px 12px;
      border: 1px solid var(--nessa-border);
      border-radius: var(--radius-sm);
      background: var(--nessa-surface-2);
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--nessa-text);
      cursor: pointer;
      transition: border-color var(--t-fast) var(--ease-out), background var(--t-fast) var(--ease-out),
        transform var(--t-fast) var(--ease-out);
    }

    .quick__btn:hover {
      border-color: var(--nessa-accent);
      background: var(--nessa-surface-hover);
      transform: translateY(-1px);
    }

    .quick__btn:active {
      transform: scale(0.97);
    }

    .quick__notice {
      margin: 12px 0 0;
      min-height: 17px;
      font-size: 12px;
      color: var(--nessa-accent);
      opacity: 0;
      transform: translateY(4px);
      transition: opacity var(--t-base) var(--ease-out), transform var(--t-base) var(--ease-out);
    }

    .quick__notice.is-visible {
      opacity: 1;
      transform: none;
    }

    .activity {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .activity__item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 9px 0;
    }

    .activity__item + .activity__item {
      border-top: 1px solid var(--nessa-hairline);
    }

    .activity__dot {
      width: 7px;
      height: 7px;
      flex: none;
      border-radius: var(--radius-full);
      background: var(--nessa-accent);
      box-shadow: 0 0 0 3px var(--nessa-primary-soft);
    }

    .activity__label {
      flex: 1;
      min-width: 0;
      font-size: 13px;
      font-weight: 500;
      color: var(--nessa-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .activity__time {
      flex: none;
      font-size: 11.5px;
      color: var(--nessa-text-muted);
    }

    @media (max-width: 980px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class AssistantPage {
  protected readonly service = inject(AssistantService);

  protected readonly suggestions = SUGGESTIONS;
  protected readonly quickActions = QUICK_ACTIONS;
  protected readonly actionNotice = signal("");

  protected readonly tasks = this.service.tasks;
  protected readonly activities = this.service.activities;

  protected readonly doneCount = computed(() => this.tasks().filter((task) => task.done).length);

  protected readonly progressPct = computed(() => {
    const all = this.tasks();
    if (all.length === 0) return 0;
    return Math.round((this.doneCount() / all.length) * 100);
  });

  protected adopt(suggestion: string): void {
    this.service.addTask(suggestion);
  }

  protected runAction(label: string): void {
    this.actionNotice.set(`“${label}” registrado — as automações chegam na próxima etapa.`);
  }
}
