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
    <section class="auth-container">
      <div class="auth-card">
        <app-nessa-logo [size]="48"></app-nessa-logo>
        
        <h1 class="auth-title">Entrar</h1>
        <p class="auth-subtitle">Acesse sua conta para continuar</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="field-group">
            <label for="email" class="label">E-mail</label>
            <input
              id="email"
              type="email"
              class="input"
              formControlName="email"
              [class.input--error]="email?.invalid && email?.touched"
            >
            @if (email?.invalid && email?.touched) {
              <div class="error-message">
                @if (email?.errors?.['required']) {
                  <span>E-mail é obrigatório</span>
                }
                @if (email?.errors?.['email']) {
                  <span>Formato de e-mail inválido</span>
                }
              </div>
            }
          </div>

          <div class="field-group">
            <label for="password" class="label">Senha</label>
            <input
              id="password"
              type="password"
              class="input"
              formControlName="password"
              [class.input--error]="password?.invalid && password?.touched"
            >
            @if (password?.invalid && password?.touched) {
              <div class="error-message">
                @if (password?.errors?.['required']) {
                  <span>Senha é obrigatória</span>
                }
              </div>
            }
          </div>

          @if (errorMessage()) {
            <div class="error-message error-message--global">
              {{ errorMessage() }}
            </div>
          }

          <button 
            type="submit" 
            class="btn btn--primary btn--full"
            [disabled]="loginForm.invalid || isLoading()"
          >
            @if (!isLoading()) {
              <span>Entrar</span>
            } @else {
              <span class="loading-spinner"></span>
            }
          </button>
        </form>

        <div class="auth-footer">
          Não tem uma conta? <a routerLink="/cadastro" class="link">Criar conta</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
      flex: 1;
    }

    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 60px);
      padding: 20px;
    }

    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 32px;
      border-radius: 12px;
      background: var(--surface, #1a1a1a);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      border: 1px solid var(--border, #2a2a2a);
    }

    .auth-title {
      font-size: 24px;
      font-weight: 600;
      color: var(--text, #ffffff);
      margin: 16px 0 8px;
      text-align: center;
    }

    .auth-subtitle {
      font-size: 14px;
      color: var(--text-muted, #9ca3af);
      margin-bottom: 24px;
      text-align: center;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .label {
      font-size: 13px;
      font-weight: 500;
      color: var(--text, #ffffff);
    }

    .input {
      width: 100%;
      height: 42px;
      padding: 0 14px;
      border: 1px solid var(--border, #2a2a2a);
      border-radius: 6px;
      background: var(--surface-2, #252525);
      color: var(--text, #ffffff);
      font-size: 14px;
      
      &:focus {
        outline: none;
        border-color: var(--primary, #6366f1);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
      }
      
      &.input--error {
        border-color: var(--danger, #ef4444);
      }
    }

    .error-message {
      font-size: 12px;
      color: var(--danger, #ef4444);
      min-height: 16px;

      &--global {
        text-align: center;
        margin-top: -8px;
        margin-bottom: 8px;
      }
    }

    .btn--full {
      width: 100%;
      height: 42px;
      margin-top: 8px;
    }

    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      display: inline-block;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .auth-footer {
      text-align: center;
      font-size: 14px;
      margin-top: 24px;
      color: var(--text-muted, #9ca3af);
    }

    .link {
      color: var(--primary, #6366f1);
      text-decoration: none;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }
  `,
})
export class LoginPage {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

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

  async onSubmit() {
    if (this.loginForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login({ email, password }).toPromise();
      
      // Após login bem-sucedido, redirecionar para home
      setTimeout(() => {
        this.router.navigate(["/"]);
      }, 500);
    } catch (error: any) {
      console.error("Erro no login:", error);
      if (error?.status === 401) {
        this.errorMessage.set("E-mail ou senha incorretos.");
      } else {
        this.errorMessage.set("Ocorreu um erro durante o login. Tente novamente.");
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  get email() { return this.loginForm.get("email"); }
  get password() { return this.loginForm.get("password"); }
}
