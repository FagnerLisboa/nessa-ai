import { Component, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../core/services/auth.service";
import { NessaLogoComponent } from "../../shared/components/nessa-logo/nessa-logo.component";

@Component({
  selector: "app-login-page",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NessaLogoComponent],
  template: `
    <div class="auth-page">
      <div class="auth-background">
        <div class="ambient-gradient ambient-gradient--top"></div>
        <div class="ambient-gradient ambient-gradient--bottom"></div>
        <div class="grid-overlay"></div>
      </div>
      
      <div class="auth-card route-anim">
        <div class="auth-header">
          <app-nessa-logo [size]="56"></app-nessa-logo>
          <h1 class="auth-title">N E S S A</h1>
          <p class="auth-subtitle">SEU AGENTE DE IA</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="field-group">
            <label for="email" class="field-label">
              <span class="field-icon">@</span>
              Identificador (Email)*
            </label>
            <input
              id="email"
              type="email"
              class="field-input"
              formControlName="email"
              [class.field-input--error]="email?.invalid && email?.touched"
              autocomplete="email"
              aria-label="Identificador (Email)"
            >
            @if (email?.invalid && email?.touched) {
              <div class="field-error">
                @if (email?.errors?.['required']) {
                  <span>Identificador é obrigatório</span>
                }
                @if (email?.errors?.['email']) {
                  <span>Formato de e-mail inválido</span>
                }
              </div>
            }
          </div>

          <div class="field-group">
            <label for="password" class="field-label">
              <span class="field-icon">🔒</span>
              Codificação (Senha)*
            </label>
            <div class="password-wrapper">
              <input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                class="field-input field-input--with-toggle"
                formControlName="password"
                [class.field-input--error]="password?.invalid && password?.touched"
                autocomplete="current-password"
                aria-label="Codificação (Senha)"
              >
              <button
                type="button"
                class="password-toggle"
                (click)="togglePassword()"
                [attr.aria-label]="showPassword() ? 'Ocultar senha' : 'Mostrar senha'"
              >
                @if (showPassword()) {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                } @else {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                }
              </button>
            </div>
            @if (password?.invalid && password?.touched) {
              <div class="field-error">
                @if (password?.errors?.['required']) {
                  <span>Codificação é obrigatória</span>
                }
              </div>
            }
          </div>

          <div class="form-extras">
            <button type="button" class="link-button link-button--small">
              Recuperar credencial
            </button>
          </div>

          @if (errorMessage()) {
            <div class="global-error">
              {{ errorMessage() }}
            </div>
          }

          <button 
            type="submit" 
            class="btn-submit"
            [disabled]="loginForm.invalid || isLoading()"
          >
            @if (!isLoading()) {
              <span>SINCRONIZAR ACESSO</span>
            } @else {
              <span class="loading-spinner"></span>
            }
          </button>
        </form>

        <div class="auth-divider">
          <span>INTERNAL PROTOCOL</span>
        </div>

        <button type="button" class="btn-google" disabled aria-label="Conectar via Google Auth (em breve)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.795-1.674-4.186-2.701-6.735-2.701-5.541 0-10.033 4.492-10.033 10.033s4.492 10.033 10.033 10.033c8.718 0 10.033-7.37 10.033-11.189 0-0.753-0.066-1.479-0.186-2.143h-9.84z"/>
          </svg>
          <span>Conectar via Google Auth</span>
        </button>

        <div class="auth-footer">
          <span>Sem autorização prévia?</span>
          <a routerLink="/cadastro" class="auth-link">Solicitar Registro</a>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
    }

    .auth-page {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      overflow: hidden;
    }

    .auth-background {
      position: absolute;
      inset: 0;
      z-index: 0;
      background: #080812;
    }

    .ambient-gradient {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.5;
      animation: ambient-drift 20s ease-in-out infinite alternate;
    }

    .ambient-gradient--top {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%);
      top: -150px;
      left: 50%;
      transform: translateX(-50%);
    }

    .ambient-gradient--bottom {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
      bottom: -100px;
      right: 10%;
      animation-delay: -5s;
    }

    @keyframes ambient-drift {
      0% { transform: translateX(-50%) scale(1); }
      100% { transform: translateX(-45%) scale(1.05); }
    }

    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 70%);
    }

    .auth-card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 480px;
      padding: 48px 40px;
      background: linear-gradient(180deg, rgba(17, 17, 24, 0.95) 0%, rgba(11, 11, 16, 0.98) 100%);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 24px;
      border: 1px solid rgba(139, 92, 246, 0.15);
      box-shadow: 
        0 0 0 1px rgba(139, 92, 246, 0.05),
        0 32px 80px rgba(0, 0, 0, 0.6),
        0 0 60px rgba(139, 92, 246, 0.1);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .auth-header app-nessa-logo {
      display: inline-flex;
      margin-bottom: 16px;
      filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.4));
    }

    .auth-title {
      font-family: var(--nessa-font-display);
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.25em;
      color: var(--nessa-text);
      margin: 0 0 8px 0;
      text-transform: uppercase;
      background: linear-gradient(135deg, var(--nessa-primary) 0%, var(--nessa-accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .auth-subtitle {
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.2em;
      color: var(--nessa-text-muted);
      margin: 0;
      text-transform: uppercase;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .field-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.08em;
      color: var(--nessa-text-muted);
      text-transform: uppercase;
    }

    .field-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      font-size: 14px;
      color: var(--nessa-primary);
    }

    .field-input {
      width: 100%;
      height: 52px;
      padding: 0 16px;
      background: rgba(23, 23, 32, 0.6);
      border: 1px solid rgba(41, 41, 54, 0.6);
      border-radius: 12px;
      color: var(--nessa-text);
      font-size: 14px;
      font-family: inherit;
      transition: all 0.2s var(--ease-out);
      outline: none;
    }

    .field-input::placeholder {
      color: rgba(161, 161, 170, 0.5);
    }

    .field-input:hover {
      border-color: rgba(139, 92, 246, 0.3);
    }

    .field-input:focus {
      border-color: var(--nessa-primary);
      background: rgba(23, 23, 32, 0.8);
      box-shadow: 
        0 0 0 3px rgba(139, 92, 246, 0.12),
        0 0 20px rgba(139, 92, 246, 0.08);
    }

    .field-input--with-toggle {
      padding-right: 52px;
    }

    .field-input--error {
      border-color: var(--nessa-danger);
    }

    .field-input--error:focus {
      box-shadow: 
        0 0 0 3px rgba(239, 68, 68, 0.12),
        0 0 20px rgba(239, 68, 68, 0.08);
    }

    .password-wrapper {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: transparent;
      border: none;
      border-radius: 8px;
      color: var(--nessa-text-muted);
      cursor: pointer;
      transition: all 0.2s var(--ease-out);
    }

    .password-toggle:hover {
      background: rgba(139, 92, 246, 0.1);
      color: var(--nessa-primary);
    }

    .field-error {
      font-size: 11px;
      color: var(--nessa-danger);
      min-height: 16px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .form-extras {
      display: flex;
      justify-content: flex-end;
      margin-top: -8px;
    }

    .link-button {
      background: transparent;
      border: none;
      color: var(--nessa-primary);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      padding: 4px 0;
      transition: color 0.2s var(--ease-out);
    }

    .link-button:hover {
      color: var(--nessa-accent);
    }

    .link-button--small {
      font-size: 11px;
      letter-spacing: 0.05em;
    }

    .global-error {
      padding: 12px 16px;
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 10px;
      font-size: 12px;
      color: var(--nessa-danger);
      text-align: center;
    }

    .btn-submit {
      position: relative;
      width: 100%;
      height: 52px;
      background: linear-gradient(135deg, var(--nessa-primary) 0%, var(--nessa-primary-hover) 100%);
      border: none;
      border-radius: 12px;
      color: white;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s var(--ease-out);
      overflow: hidden;
    }

    .btn-submit::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
      transform: translateX(-100%);
      transition: transform 0.6s var(--ease-out);
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 
        0 8px 30px rgba(139, 92, 246, 0.4),
        0 0 40px rgba(139, 92, 246, 0.2);
    }

    .btn-submit:hover:not(:disabled)::before {
      transform: translateX(100%);
    }

    .btn-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .loading-spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .auth-divider {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 28px 0;
    }

    .auth-divider::before,
    .auth-divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: calc(50% - 80px);
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent);
    }

    .auth-divider::before {
      left: 0;
    }

    .auth-divider::after {
      right: 0;
    }

    .auth-divider span {
      padding: 0 16px;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.2em;
      color: var(--nessa-text-muted);
      text-transform: uppercase;
      background: linear-gradient(180deg, rgba(17, 17, 24, 0.95) 0%, rgba(11, 11, 16, 0.98) 100%);
    }

    .btn-google {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      width: 100%;
      height: 48px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      color: var(--nessa-text-muted);
      font-size: 13px;
      font-weight: 500;
      cursor: not-allowed;
      transition: all 0.2s var(--ease-out);
      opacity: 0.6;
    }

    .btn-google svg {
      opacity: 0.7;
    }

    .auth-footer {
      text-align: center;
      margin-top: 28px;
      font-size: 13px;
      color: var(--nessa-text-muted);
    }

    .auth-footer span {
      display: block;
      margin-bottom: 8px;
    }

    .auth-link {
      color: var(--nessa-primary);
      text-decoration: none;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 12px;
      transition: color 0.2s var(--ease-out);
    }

    .auth-link:hover {
      color: var(--nessa-accent);
      text-decoration: underline;
    }

    @media (max-width: 520px) {
      .auth-card {
        padding: 36px 24px;
      }

      .auth-title {
        font-size: 24px;
        letter-spacing: 0.2em;
      }

      .auth-subtitle {
        font-size: 11px;
      }

      .field-input {
        height: 48px;
      }

      .btn-submit {
        height: 48px;
        font-size: 12px;
      }
    }
  `,
})
export class LoginPage {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  async onSubmit() {
    if (this.loginForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login({ email, password }).toPromise();
      
      setTimeout(() => {
        this.router.navigate(["/"]);
      }, 500);
    } catch (error: any) {
      console.error("Erro no login:", error);
      if (error?.status === 401) {
        this.errorMessage.set("Credenciais inválidas.");
      } else {
        this.errorMessage.set("Falha na sincronização. Tente novamente.");
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  get email() { return this.loginForm.get("email"); }
  get password() { return this.loginForm.get("password"); }
}
