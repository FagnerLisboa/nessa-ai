import { Component, inject, signal } from "@angular/core";

import type { AIProvider } from "../../../core/models";
import { ProvidersService, ThemeService } from "../../../core/services";
import { PageHeaderComponent } from "../../shared/components/page-header.component";
import { SegmentedComponent, ToggleComponent } from "../../shared/components/controls.component";

interface SectionDef {
  id: string;
  label: string;
}

const SECTIONS: SectionDef[] = [
  { id: "aparencia", label: "Aparência" },
  { id: "geral", label: "Geral" },
  { id: "privacidade", label: "Privacidade" },
  { id: "notificacoes", label: "Notificações" },
  { id: "modelos", label: "Modelos de IA" },
  { id: "integracoes", label: "Integrações" },
];

const INTEGRATIONS = ["Google Drive", "Notion", "Slack", "GitHub"];

const PREFS_KEY = "nessa:prefs";

interface Prefs {
  history: boolean;
  shareUsage: boolean;
  personalized: boolean;
  news: boolean;
  taskDone: boolean;
  language: string;
}

const PREFS_DEFAULT: Prefs = {
  history: true,
  shareUsage: false,
  personalized: true,
  news: true,
  taskDone: false,
  language: "pt-BR",
};

@Component({
  selector: "app-settings-page",
  standalone: true,
  imports: [PageHeaderComponent, SegmentedComponent, ToggleComponent],
  template: `
    <section class="page">
      <app-page-header title="Configurações" description="Preferências da plataforma — tudo é salvo neste navegador."></app-page-header>

      <div class="layout">
        <!-- Navegação das seções -->
        <nav class="nav arrive" aria-label="Seções de configurações">
          @for (section of sections; track section.id) {
            <button
              type="button"
              class="nav__item"
              [class.is-active]="activeSection() === section.id"
              (click)="goTo(section.id)"
            >
              {{ section.label }}
            </button>
          }
        </nav>

        <div class="content">
          <!-- Aparência -->
          <section class="panel block arrive" id="aparencia" style="animation-delay: 60ms">
            <h2 class="block__title">Aparência</h2>
            <div class="setting">
              <div class="setting__text">
                <p class="setting__label">Tema</p>
                <p class="setting__desc">O tema escuro é a identidade da NESSA; o claro está disponível quando preferir.</p>
              </div>
              <app-segmented
                class="setting__control"
                [options]="[{ value: 'dark', label: 'Escuro' }, { value: 'light', label: 'Claro' }]"
                [value]="themeService.theme()"
                (valueChange)="onTheme($event)"
                ariaLabel="Tema da interface"
              ></app-segmented>
            </div>
          </section>

          <!-- Geral -->
          <section class="panel block arrive" id="geral" style="animation-delay: 100ms">
            <h2 class="block__title">Geral</h2>
            <div class="setting">
              <div class="setting__text">
                <p class="setting__label">Idioma</p>
                <p class="setting__desc">Aplica-se à formatação de datas, números e textos da interface.</p>
              </div>
              <select class="input setting__select" [value]="prefs().language" (change)="onLanguage($event)" aria-label="Idioma da interface">
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en">English</option>
              </select>
            </div>
          </section>

          <!-- Privacidade -->
          <section class="panel block arrive" id="privacidade" style="animation-delay: 140ms">
            <h2 class="block__title">Privacidade</h2>
            <app-toggle label="Salvar histórico de conversas" description="Suas conversas ficam disponíveis na página Conversas." [checked]="prefs().history" (checkedChange)="setPref('history', $event)"></app-toggle>
            <div class="rule"></div>
            <app-toggle label="Compartilhar dados de uso" description="Ajuda a melhorar a NESSA com métricas anônimas." [checked]="prefs().shareUsage" (checkedChange)="setPref('shareUsage', $event)"></app-toggle>
            <div class="rule"></div>
            <app-toggle label="Respostas personalizadas" description="A NESSA considera seu contexto para responder melhor." [checked]="prefs().personalized" (checkedChange)="setPref('personalized', $event)"></app-toggle>
          </section>

          <!-- Notificações -->
          <section class="panel block arrive" id="notificacoes" style="animation-delay: 180ms">
            <h2 class="block__title">Notificações</h2>
            <app-toggle label="Novidades da NESSA" description="Novos recursos e melhorias da plataforma." [checked]="prefs().news" (checkedChange)="setPref('news', $event)"></app-toggle>
            <div class="rule"></div>
            <app-toggle label="Conclusão de tarefas" description="Avisar quando o Assistente concluir uma tarefa." [checked]="prefs().taskDone" (checkedChange)="setPref('taskDone', $event)"></app-toggle>
          </section>

          <!-- Modelos de IA -->
          <section class="panel block arrive" id="modelos" style="animation-delay: 220ms">
            <div class="block__head">
              <h2 class="block__title">Modelos de IA</h2>
              <span class="badge badge--muted">{{ providers().length }} provedores</span>
            </div>

            @if (providerNotice().length > 0) {
              <p class="provider-notice" role="status">{{ providerNotice() }}</p>
            }

            <ul class="providers">
              @for (provider of providers(); track provider.id) {
                <li class="provider">
                  <span class="provider__mark" aria-hidden="true">{{ provider.name.charAt(0) }}</span>
                  <div class="provider__body">
                    <p class="provider__name">{{ provider.name }}</p>
                    <p class="provider__model">{{ provider.model }}</p>
                  </div>
                  <span class="badge badge--warn provider__status">
                    <span class="badge__dot"></span>
                    Não configurado
                  </span>
                  <button type="button" class="btn btn--ghost btn--sm" (click)="configure(provider)">Configurar</button>
                </li>
              }
            </ul>

            <p class="block__foot">
              Nenhuma chave de API é solicitada nesta etapa — a configuração será feita pelo backend Python.
            </p>
          </section>

          <!-- Integrações -->
          <section class="panel block arrive" id="integracoes" style="animation-delay: 260ms">
            <h2 class="block__title">Integrações</h2>
            <ul class="integrations">
              @for (integration of integrations; track integration) {
                <li class="integration">
                  <span class="integration__name">{{ integration }}</span>
                  <span class="badge badge--muted">Em breve</span>
                </li>
              }
            </ul>
          </section>
        </div>
      </div>
    </section>
  `,
  styles: `
    .layout {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 26px;
      align-items: start;
    }

    .nav {
      position: sticky;
      top: calc(var(--header-h, 60px) + 16px);
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav__item {
      padding: 9px 12px;
      border: 0;
      border-radius: var(--radius-sm);
      background: transparent;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      text-align: left;
      color: var(--nessa-text-muted);
      cursor: pointer;
      transition: background var(--t-fast) var(--ease-out), color var(--t-fast) var(--ease-out);
    }

    .nav__item:hover {
      background: var(--nessa-surface-hover);
      color: var(--nessa-text);
    }

    .nav__item.is-active {
      background: var(--nessa-primary-soft);
      color: var(--nessa-accent);
      font-weight: 600;
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 0;
    }

    .block {
      padding: 20px 22px;
      scroll-margin-top: 90px;
    }

    .block__head {
      display: flex;
      align-items: center;
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

    .block__head .block__title {
      margin-bottom: 14px;
    }

    .setting {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      flex-wrap: wrap;
    }

    .setting__label {
      margin: 0;
      font-size: 13.5px;
      font-weight: 600;
      color: var(--nessa-text);
    }

    .setting__desc {
      margin: 3px 0 0;
      font-size: 12.5px;
      line-height: 1.5;
      color: var(--nessa-text-muted);
      max-width: 46ch;
    }

    .setting__control {
      min-width: 200px;
      flex: none;
    }

    .setting__select {
      width: auto;
      min-width: 200px;
    }

    .rule {
      height: 1px;
      background: var(--nessa-hairline);
      margin: 4px 0;
    }

    .provider-notice {
      margin: 0 0 14px;
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      background: var(--nessa-primary-soft);
      border: 1px solid var(--nessa-primary-ring);
      font-size: 12.5px;
      line-height: 1.5;
      color: var(--nessa-accent);
      animation: notice-in 0.25s var(--ease-out) both;
    }

    @keyframes notice-in {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: none; }
    }

    .providers {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .provider {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 2px;
    }

    .provider + .provider {
      border-top: 1px solid var(--nessa-hairline);
    }

    .provider__mark {
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      flex: none;
      border-radius: var(--radius-sm);
      border: 1px solid var(--nessa-hairline);
      background: var(--nessa-surface-2);
      font-family: var(--nessa-font-display);
      font-size: 15px;
      font-weight: 700;
      color: var(--nessa-accent);
    }

    .provider__body {
      flex: 1;
      min-width: 0;
    }

    .provider__name {
      margin: 0;
      font-size: 13.5px;
      font-weight: 600;
      color: var(--nessa-text);
    }

    .provider__model {
      margin: 2px 0 0;
      font-size: 12px;
      color: var(--nessa-text-muted);
    }

    .provider__status {
      flex: none;
    }

    .block__foot {
      margin: 14px 0 0;
      padding-top: 12px;
      border-top: 1px solid var(--nessa-hairline);
      font-size: 12px;
      line-height: 1.55;
      color: var(--nessa-text-muted);
    }

    .integrations {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .integration {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 11px 2px;
    }

    .integration + .integration {
      border-top: 1px solid var(--nessa-hairline);
    }

    .integration__name {
      font-size: 13.5px;
      font-weight: 500;
      color: var(--nessa-text);
    }

    @media (max-width: 900px) {
      .layout {
        grid-template-columns: 1fr;
      }

      .nav {
        position: static;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 6px;
      }

      .nav__item {
        padding: 7px 12px;
        border: 1px solid var(--nessa-border);
        border-radius: var(--radius-full);
      }

      .nav__item.is-active {
        border-color: var(--nessa-primary-ring);
      }

      .provider__status {
        display: none;
      }
    }
  `,
})
export class SettingsPage {
  protected readonly themeService = inject(ThemeService);
  private readonly providersService = inject(ProvidersService);

  protected readonly sections = SECTIONS;
  protected readonly integrations = INTEGRATIONS;
  protected readonly providers = this.providersService.providers;

  protected readonly activeSection = signal("aparencia");
  protected readonly providerNotice = signal("");
  protected readonly prefs = signal<Prefs>(this.readPrefs());

  protected goTo(id: string): void {
    this.activeSection.set(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  protected onTheme(value: string): void {
    this.themeService.setTheme(value === "light" ? "light" : "dark");
  }

  protected onLanguage(event: Event): void {
    this.setPref("language", (event.target as HTMLSelectElement).value);
  }

  protected setPref<K extends keyof Prefs>(key: K, value: Prefs[K]): void {
    const next = { ...this.prefs(), [key]: value };
    this.prefs.set(next);
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    } catch {
      /* armazenamento indisponível — segue em memória */
    }
  }

  protected configure(provider: AIProvider): void {
    this.providerNotice.set(
      `${provider.name} será configurado pelo backend Python — nenhuma chave de API é solicitada agora.`,
    );
  }

  private readPrefs(): Prefs {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) return { ...PREFS_DEFAULT, ...(JSON.parse(raw) as Partial<Prefs>) };
    } catch {
      /* noop */
    }
    return PREFS_DEFAULT;
  }
}
