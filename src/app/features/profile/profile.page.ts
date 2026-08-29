import { Component, computed, inject, signal } from "@angular/core";

import { ProfileService, ThemeService } from "../../../core/services";
import { PageHeaderComponent } from "../../shared/components/page-header.component";

@Component({
  selector: "app-profile-page",
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <section class="page">
      <app-page-header title="Perfil" description="Suas informações e preferências na NESSA."></app-page-header>

      <div class="grid">
        <!-- Cartão do perfil -->
        <section class="panel card arrive" style="animation-delay: 60ms" aria-label="Dados do perfil">
          <span class="card__avatar" aria-hidden="true">{{ initials() }}</span>

          <h2 class="card__name">{{ profile().name }}</h2>
          <p class="card__email">{{ profile().email }}</p>

          <div class="card__badges">
            <span class="badge badge--info">
              <span class="badge__dot"></span>
              {{ profile().plan }}
            </span>
            <span class="badge badge--muted">{{ profile().role }}</span>
          </div>

          <div class="card__prefs">
            <p class="u-eyebrow card__prefs-title">Preferências ativas</p>
            <ul class="card__prefs-list">
              <li>
                <span>Tema</span>
                <strong>{{ themeService.theme() === "dark" ? "Escuro" : "Claro" }}</strong>
              </li>
              <li>
                <span>Idioma</span>
                <strong>Português (BR)</strong>
              </li>
              <li>
                <span>Autenticação</span>
                <strong>Chega na Etapa 4</strong>
              </li>
            </ul>
          </div>
        </section>

        <!-- Edição -->
        <form class="panel form arrive" style="animation-delay: 120ms" (ngSubmit)="save()" aria-label="Editar perfil">
          <h2 class="form__title">Editar perfil</h2>

          <label class="field">
            <span class="field__label">Nome</span>
            <input class="input" name="name" [value]="formName()" (input)="onName($event)" autocomplete="name" />
            @if (nameError().length > 0) {
              <span class="field__error" role="alert">{{ nameError() }}</span>
            }
          </label>

          <label class="field">
            <span class="field__label">E-mail</span>
            <input class="input" name="email" type="email" [value]="formEmail()" (input)="onEmail($event)" autocomplete="email" />
            @if (emailError().length > 0) {
              <span class="field__error" role="alert">{{ emailError() }}</span>
            }
          </label>

          <label class="field">
            <span class="field__label">Função</span>
            <input class="input" name="role" [value]="formRole()" (input)="onRole($event)" placeholder="ex. Pesquisadora" />
          </label>

          <div class="form__foot">
            <p class="form__saved" role="status" aria-live="polite" [class.is-visible]="saved()">Salvo ✓</p>
            <button type="submit" class="btn btn--primary" [disabled]="!canSave()">Salvar alterações</button>
          </div>
        </form>
      </div>
    </section>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 16px;
      align-items: start;
    }

    .card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 34px 24px 26px;
    }

    .card__avatar {
      display: grid;
      place-items: center;
      width: 76px;
      height: 76px;
      border-radius: var(--radius-full);
      border: 1px solid var(--nessa-primary-ring);
      background: var(--nessa-primary-soft);
      font-family: var(--nessa-font-display);
      font-size: 26px;
      font-weight: 700;
      color: var(--nessa-accent);
      box-shadow: var(--shadow-glow);
    }

    .card__name {
      margin: 16px 0 0;
      font-family: var(--nessa-font-display);
      font-size: 19px;
      font-weight: 650;
      letter-spacing: -0.01em;
      color: var(--nessa-text);
    }

    .card__email {
      margin: 4px 0 0;
      font-size: 13px;
      color: var(--nessa-text-muted);
      word-break: break-all;
    }

    .card__badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 14px;
    }

    .card__prefs {
      width: 100%;
      margin-top: 24px;
      padding-top: 18px;
      border-top: 1px solid var(--nessa-hairline);
      text-align: left;
    }

    .card__prefs-title {
      margin-bottom: 10px;
    }

    .card__prefs-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .card__prefs-list li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      font-size: 12.5px;
      color: var(--nessa-text-muted);
    }

    .card__prefs-list strong {
      font-weight: 600;
      color: var(--nessa-text);
    }

    .form {
      padding: 24px;
    }

    .form__title {
      margin: 0 0 18px;
      font-family: var(--nessa-font-display);
      font-size: 15px;
      font-weight: 650;
      color: var(--nessa-text);
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
    }

    .field__label {
      font-size: 12px;
      font-weight: 600;
      color: var(--nessa-text-muted);
    }

    .field__error {
      font-size: 12px;
      font-weight: 500;
      color: var(--nessa-danger);
    }

    .form__foot {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 14px;
      margin-top: 6px;
    }

    .form__saved {
      margin: 0;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--nessa-success);
      opacity: 0;
      transform: translateY(3px);
      transition: opacity var(--t-base) var(--ease-out), transform var(--t-base) var(--ease-out);
    }

    .form__saved.is-visible {
      opacity: 1;
      transform: none;
    }

    @media (max-width: 900px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class ProfilePage {
  protected readonly themeService = inject(ThemeService);
  private readonly profileService = inject(ProfileService);

  protected readonly profile = this.profileService.profile;

  protected readonly formName = signal(this.profile().name);
  protected readonly formEmail = signal(this.profile().email);
  protected readonly formRole = signal(this.profile().role);
  protected readonly saved = signal(false);

  private savedTimeout: number | null = null;

  protected readonly initials = computed(() => {
    const parts = this.profile().name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "N";
    const first = parts[0]?.charAt(0) ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.charAt(0) ?? "" : "";
    return (first + last).toUpperCase();
  });

  protected readonly nameError = computed(() => {
    const value = this.formName().trim();
    if (value.length > 0 && value.length < 2) return "Use ao menos 2 caracteres.";
    return "";
  });

  protected readonly emailError = computed(() => {
    const value = this.formEmail().trim();
    if (value.length > 0 && !value.includes("@")) return "Informe um e-mail válido.";
    return "";
  });

  protected readonly canSave = computed(() => {
    const changed =
      this.formName() !== this.profile().name ||
      this.formEmail() !== this.profile().email ||
      this.formRole() !== this.profile().role;
    const valid = this.nameError().length === 0 && this.emailError().length === 0;
    return changed && valid && this.formName().trim().length > 0;
  });

  protected onName(event: Event): void {
    this.formName.set((event.target as HTMLInputElement).value);
  }

  protected onEmail(event: Event): void {
    this.formEmail.set((event.target as HTMLInputElement).value);
  }

  protected onRole(event: Event): void {
    this.formRole.set((event.target as HTMLInputElement).value);
  }

  protected save(): void {
    if (!this.canSave()) return;
    this.profileService.save({
      ...this.profile(),
      name: this.formName().trim(),
      email: this.formEmail().trim(),
      role: this.formRole().trim(),
    });
    this.saved.set(true);
    if (this.savedTimeout !== null) {
      window.clearTimeout(this.savedTimeout);
    }
    this.savedTimeout = window.setTimeout(() => this.saved.set(false), 2600);
  }
}
