import { Component, computed, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";

import type { Project } from "../../../core/models";
import { ProjectsService } from "../../../core/services";
import { ActionMenuComponent, type MenuAction } from "../../shared/components/action-menu.component";
import { PageHeaderComponent } from "../../shared/components/page-header.component";
import { SearchBoxComponent } from "../../shared/components/search-box.component";
import { StateViewComponent } from "../../shared/components/state-view.component";

@Component({
  selector: "app-projects-page",
  standalone: true,
  imports: [FormsModule, PageHeaderComponent, SearchBoxComponent, StateViewComponent, ActionMenuComponent],
  template: `
    <section class="page">
      <app-page-header title="Projetos" description="Organize conversas, arquivos e contexto em um único espaço.">
        <button actions type="button" class="btn btn--primary" (click)="formOpen.set(!formOpen())">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Novo projeto
        </button>
      </app-page-header>

      @if (formOpen()) {
        <form class="panel form arrive" (ngSubmit)="create()">
          <div class="form__grid">
            <label class="form__field">
              <span class="form__label">Nome</span>
              <input class="input" name="name" [(ngModel)]="formName" placeholder="ex. Lançamento NESSA" required />
            </label>
            <label class="form__field">
              <span class="form__label">Descrição</span>
              <input class="input" name="description" [(ngModel)]="formDescription" placeholder="Qual o objetivo deste espaço?" />
            </label>
          </div>
          <div class="form__actions">
            <button type="button" class="btn btn--ghost btn--sm" (click)="formOpen.set(false)">Cancelar</button>
            <button type="submit" class="btn btn--primary btn--sm" [disabled]="formName.trim().length === 0">Criar projeto</button>
          </div>
        </form>
      }

      <div class="toolbar arrive" style="animation-delay: 60ms">
        <app-search-box class="toolbar__search" placeholder="Pesquisar projetos" [value]="query()" (valueChange)="query.set($event)" />
        @if (status() === 'ready') {
          <span class="toolbar__count">{{ filtered().length }} {{ filtered().length === 1 ? "projeto" : "projetos" }}</span>
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
              title="Nenhum projeto"
              description="Crie um espaço para reunir conversas, arquivos e contexto."
              actionLabel="Novo projeto"
              (action)="formOpen.set(true)"
            ></app-state-view>
          } @else {
            <div class="panel arrive" style="animation-delay: 120ms">
              @for (project of filtered(); track project.id) {
                <div class="proj row-line">
                  <span class="proj__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3.6 6.8c0-.9.7-1.6 1.6-1.6h4.1l1.9 2h7.6c.9 0 1.6.7 1.6 1.6v8.4c0 .9-.7 1.6-1.6 1.6H5.2c-.9 0-1.6-.7-1.6-1.6Z" />
                    </svg>
                  </span>

                  <div class="proj__body">
                    <p class="proj__name">{{ project.name }}</p>
                    <p class="proj__desc">{{ project.description }}</p>
                  </div>

                  <div class="proj__stats" aria-label="Estatísticas do projeto">
                    <span>{{ project.fileCount }} arquivos</span>
                    <span class="proj__stats-sep" aria-hidden="true">·</span>
                    <span>{{ project.conversationCount }} conversas</span>
                  </div>

                  <span class="proj__update">{{ project.displayUpdate }}</span>

                  <app-action-menu [actions]="menuActions" (action)="onAction(project.id, $event)"></app-action-menu>
                </div>
              }
            </div>
          }
        }
      }
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

    .proj__icon {
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      flex: none;
      border-radius: var(--radius-sm);
      border: 1px solid var(--nessa-hairline);
      background: var(--nessa-surface-2);
      color: var(--nessa-accent);
      transition: transform var(--t-fast) var(--ease-spring);
    }

    .proj:hover .proj__icon {
      transform: scale(1.06);
    }

    .proj__body {
      flex: 1;
      min-width: 0;
    }

    .proj__name {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--nessa-text);
    }

    .proj__desc {
      margin: 2px 0 0;
      font-size: 12.5px;
      color: var(--nessa-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .proj__stats {
      flex: none;
      font-size: 12.5px;
      font-weight: 500;
      color: var(--nessa-text);
      white-space: nowrap;
    }

    .proj__stats-sep {
      margin: 0 4px;
      color: var(--nessa-text-muted);
      opacity: 0.6;
    }

    .proj__update {
      flex: none;
      min-width: 150px;
      text-align: right;
      font-size: 12px;
      color: var(--nessa-text-muted);
    }

    @media (max-width: 900px) {
      .proj__update {
        display: none;
      }
    }

    @media (max-width: 640px) {
      .form__grid {
        grid-template-columns: 1fr;
      }

      .proj__stats {
        display: none;
      }

      .proj__desc {
        white-space: normal;
      }
    }
  `,
})
export class ProjectsPage {
  private readonly service = inject(ProjectsService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly status = signal<"loading" | "ready" | "error">("loading");
  protected readonly items = signal<Project[]>([]);
  protected readonly query = signal("");
  protected readonly formOpen = signal(false);

  protected formName = "";
  protected formDescription = "";

  protected readonly menuActions: MenuAction[] = [{ id: "delete", label: "Excluir", danger: true }];

  protected readonly filtered = computed(() => {
    const term = this.query().trim().toLowerCase();
    const all = this.items();
    if (!term) return all;
    return all.filter(
      (project) =>
        project.name.toLowerCase().includes(term) || project.description.toLowerCase().includes(term),
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
      description: this.formDescription.trim() || "Espaço de trabalho da NESSA.",
    });
    this.formName = "";
    this.formDescription = "";
    this.formOpen.set(false);
    this.load();
  }

  protected onAction(id: string, actionId: string): void {
    if (actionId === "delete") {
      this.service.remove(id);
      this.load();
    }
  }
}
