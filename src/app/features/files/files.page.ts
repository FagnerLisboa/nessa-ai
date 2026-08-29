import { Component, computed, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import type { FileItem, FileKind } from "../../../core/models";
import { FilesService } from "../../../core/services";
import { ActionMenuComponent, type MenuAction } from "../../shared/components/action-menu.component";
import { PageHeaderComponent } from "../../shared/components/page-header.component";
import { SearchBoxComponent } from "../../shared/components/search-box.component";
import { StateViewComponent } from "../../shared/components/state-view.component";

type TypeFilter = "todos" | FileKind | "imagens";

const FILTERS: Array<{ id: TypeFilter; label: string }> = [
  { id: "todos", label: "Todos" },
  { id: "pdf", label: "PDF" },
  { id: "docx", label: "DOCX" },
  { id: "txt", label: "TXT" },
  { id: "csv", label: "CSV" },
  { id: "xlsx", label: "XLSX" },
  { id: "imagens", label: "Imagens" },
];

const IMAGE_KINDS: FileKind[] = ["png", "jpg", "webp"];

@Component({
  selector: "app-files-page",
  standalone: true,
  imports: [PageHeaderComponent, SearchBoxComponent, StateViewComponent, ActionMenuComponent],
  template: `
    <section class="page">
      <app-page-header title="Arquivos" description="Gerencie os arquivos utilizados pela NESSA.">
        <button actions type="button" class="btn btn--primary" (click)="picker.click()">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" />
            <path d="M4.5 15.5v3a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-3" />
          </svg>
          Enviar arquivo
        </button>
        <input #picker type="file" multiple class="visually-hidden" (change)="onPicked($event)" />
      </app-page-header>

      <!-- Área de upload (preparada visualmente — upload real chega depois) -->
      <button
        type="button"
        class="dropzone arrive"
        style="animation-delay: 50ms"
        [class.is-dragging]="dragging()"
        (click)="picker.click()"
        (dragover)="onDragOver($event)"
        (dragleave)="dragging.set(false)"
        (drop)="onDrop($event)"
        aria-label="Enviar arquivos"
      >
        <span class="dropzone__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" />
            <path d="M4.5 15.5v3a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-3" />
          </svg>
        </span>
        <span class="dropzone__text">
          Arraste arquivos para cá ou <span class="link">procure no computador</span>
        </span>
        <span class="dropzone__hint">PDF, DOCX, TXT, CSV, XLSX, PNG, JPG, WEBP</span>
      </button>

      <div class="toolbar arrive" style="animation-delay: 100ms">
        <app-search-box class="toolbar__search" placeholder="Pesquisar arquivos" [value]="query()" (valueChange)="query.set($event)" />
        <div class="toolbar__filters" role="group" aria-label="Filtrar por tipo">
          @for (filter of filters; track filter.id) {
            <button
              type="button"
              class="chip"
              [class.is-on]="typeFilter() === filter.id"
              [attr.aria-pressed]="typeFilter() === filter.id"
              (click)="typeFilter.set(filter.id)"
            >
              {{ filter.label }}
            </button>
          }
        </div>
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
              title="Nenhum arquivo aqui"
              description="Envie documentos ou imagens para a base de conhecimento da NESSA."
              actionLabel="Enviar arquivo"
              (action)="picker.click()"
            ></app-state-view>
          } @else {
            <div class="panel table arrive" style="animation-delay: 160ms">
              <div class="table__head" aria-hidden="true">
                <span>Nome</span>
                <span class="col-type">Tipo</span>
                <span class="col-size">Tamanho</span>
                <span class="col-date">Data</span>
                <span class="col-status">Status</span>
                <span class="col-menu"></span>
              </div>

              @for (file of filtered(); track file.id) {
                <div class="file row-line">
                  <span class="file__ext" aria-hidden="true">{{ file.kind }}</span>

                  <div class="file__body">
                    <p class="file__name">{{ file.name }}</p>
                  </div>

                  <span class="file__cell col-type">{{ file.kind.toUpperCase() }}</span>
                  <span class="file__cell col-size">{{ file.sizeLabel }}</span>
                  <span class="file__cell col-date">{{ file.displayDate }}</span>

                  <span class="file__cell col-status">
                    <span class="badge" [class.badge--ok]="file.status === 'pronto'" [class.badge--warn]="file.status === 'processando'">
                      <span class="badge__dot" [class.is-pulsing]="file.status === 'processando'"></span>
                      {{ file.status === "pronto" ? "Pronto" : "Processando" }}
                    </span>
                  </span>

                  <span class="col-menu">
                    <app-action-menu [actions]="menuActions" (action)="onAction(file.id, $event)"></app-action-menu>
                  </span>
                </div>
              }
            </div>
          }
        }
      }
    </section>
  `,
  styles: `
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }

    .dropzone {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      width: 100%;
      padding: 30px 20px;
      margin-bottom: 20px;
      border: 1.5px dashed var(--nessa-border);
      border-radius: var(--radius-md);
      background: color-mix(in srgb, var(--nessa-surface) 65%, transparent);
      font-family: inherit;
      cursor: pointer;
      transition: border-color var(--t-base) var(--ease-out), background var(--t-base) var(--ease-out);
    }

    .dropzone:hover,
    .dropzone.is-dragging {
      border-color: var(--nessa-accent);
      background: var(--nessa-primary-soft);
    }

    .dropzone__icon {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border-radius: var(--radius-full);
      border: 1px solid var(--nessa-hairline);
      background: var(--nessa-surface-2);
      color: var(--nessa-accent);
      margin-bottom: 4px;
    }

    .dropzone__text {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--nessa-text);
    }

    .dropzone__hint {
      font-size: 11.5px;
      letter-spacing: 0.04em;
      color: var(--nessa-text-muted);
    }

    .toolbar {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      margin-bottom: 18px;
    }

    .toolbar__search {
      width: 100%;
      max-width: 300px;
    }

    .toolbar__filters {
      display: flex;
      gap: 7px;
      flex-wrap: wrap;
    }

    .table__head {
      display: grid;
      grid-template-columns: 64px 1fr 70px 84px 118px 120px 44px;
      gap: 12px;
      align-items: center;
      padding: 10px 18px;
      border-bottom: 1px solid var(--nessa-hairline);
      background: var(--nessa-surface-2);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--nessa-text-muted);
    }

    .file {
      display: grid;
      grid-template-columns: 64px 1fr 70px 84px 118px 120px 44px;
      gap: 12px;
      padding-block: 11px;
    }

    .file__ext {
      display: grid;
      place-items: center;
      width: 44px;
      height: 34px;
      border-radius: var(--radius-xs);
      border: 1px solid var(--nessa-hairline);
      background: var(--nessa-surface-2);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--nessa-accent);
    }

    .file__body {
      min-width: 0;
      display: flex;
      align-items: center;
    }

    .file__name {
      margin: 0;
      font-size: 13.5px;
      font-weight: 600;
      color: var(--nessa-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .file__cell {
      display: flex;
      align-items: center;
      font-size: 12.5px;
      color: var(--nessa-text-muted);
      white-space: nowrap;
    }

    .col-menu {
      display: flex;
      justify-content: flex-end;
    }

    .badge__dot.is-pulsing {
      animation: dot-pulse 1.2s var(--ease-out) infinite;
    }

    @keyframes dot-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.75); }
    }

    @media (max-width: 820px) {
      .table__head {
        display: none;
      }

      .file {
        display: flex;
        align-items: center;
      }

      .col-type,
      .col-date {
        display: none;
      }

      .col-size {
        margin-left: auto;
      }
    }
  `,
})
export class FilesPage {
  private readonly service = inject(FilesService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly filters = FILTERS;
  protected readonly status = signal<"loading" | "ready" | "error">("loading");
  protected readonly items = signal<FileItem[]>([]);
  protected readonly query = signal("");
  protected readonly typeFilter = signal<TypeFilter>("todos");
  protected readonly dragging = signal(false);

  protected readonly menuActions: MenuAction[] = [{ id: "delete", label: "Excluir", danger: true }];

  protected readonly filtered = computed(() => {
    const term = this.query().trim().toLowerCase();
    const type = this.typeFilter();
    return this.items().filter((file) => {
      const byType =
        type === "todos" ||
        (type === "imagens" ? IMAGE_KINDS.includes(file.kind) : file.kind === type);
      const byTerm = term.length === 0 || file.name.toLowerCase().includes(term);
      return byType && byTerm;
    });
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

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    this.addFiles(event.dataTransfer?.files);
  }

  protected onPicked(event: Event): void {
    this.addFiles((event.target as HTMLInputElement).files);
    (event.target as HTMLInputElement).value = "";
  }

  /** Demonstração visual — o upload real chega com o backend. */
  private addFiles(list: FileList | null | undefined): void {
    if (!list || list.length === 0) return;
    Array.from(list).forEach((file) => {
      const kind = this.kindFromName(file.name);
      const id = this.service.addLocal(
        file.name.replace(/\.[^.]+$/, ""),
        this.formatSize(file.size),
        kind,
      );
      this.load();
      window.setTimeout(() => {
        this.service.markReady(id);
        this.items.update((items) =>
          items.map((item) => (item.id === id ? { ...item, status: "pronto" as const } : item)),
        );
      }, 1600);
    });
  }

  private kindFromName(name: string): FileKind {
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    const known: FileKind[] = ["pdf", "docx", "txt", "csv", "xlsx", "png", "jpg", "webp"];
    return (known as string[]).includes(ext) ? (ext as FileKind) : "txt";
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    return `${(kb / 1024).toFixed(1).replace(".", ",")} MB`;
  }

  protected onAction(id: string, actionId: string): void {
    if (actionId === "delete") {
      this.service.remove(id);
      this.load();
    }
  }
}
