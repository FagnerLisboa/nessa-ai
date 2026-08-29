import { Component, computed, DestroyRef, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";

import type { Conversation } from "../../../core/models";
import { ConversationsService } from "../../../core/services";
import { ActionMenuComponent, type MenuAction } from "../../shared/components/action-menu.component";
import { PageHeaderComponent } from "../../shared/components/page-header.component";
import { SearchBoxComponent } from "../../shared/components/search-box.component";
import { StateViewComponent } from "../../shared/components/state-view.component";

@Component({
  selector: "app-conversations-page",
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, SearchBoxComponent, StateViewComponent, ActionMenuComponent],
  templateUrl: "./conversations.page.html",
  styleUrl: "./conversations.page.scss",
})
export class ConversationsPage {
  private readonly service = inject(ConversationsService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly status = signal<"loading" | "ready" | "error">("loading");
  protected readonly items = signal<Conversation[]>([]);
  protected readonly query = signal("");

  protected readonly filtered = computed(() => {
    const term = this.query().trim().toLowerCase();
    const all = this.items();
    if (!term) return all;
    return all.filter((item) => item.title.toLowerCase().includes(term));
  });

  protected readonly menuActions: MenuAction[] = [
    { id: "duplicate", label: "Duplicar" },
    { id: "delete", label: "Excluir", danger: true },
  ];

  constructor() {
    this.load();
  }

  protected retry(): void {
    this.load();
  }

  protected onAction(id: string, actionId: string): void {
    if (actionId === "duplicate") {
      this.service.duplicate(id);
    } else if (actionId === "delete") {
      this.service.remove(id);
    }
    this.items.set([...this.items()]);
    void this.service.list().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => this.items.set(data));
  }

  private load(): void {
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
}
