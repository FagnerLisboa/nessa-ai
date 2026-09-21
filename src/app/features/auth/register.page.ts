import { Component, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-register-page",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-background">
        <div class="ambient-gradient ambient-gradient--top"></div>
        <div class="ambient-gradient ambient-gradient--bottom"></div>
        <div class="grid-overlay"></div>
      </div>
      
      <div class="auth-card route-anim">
        <div class="auth-header">
          <div class="user-icon-wrapper">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h1 class="auth-title">REGISTRO</h1>
          <p class="auth-subtitle">Crie seu perfil em segundos e junte-se à nossa comunidade exclusiva.</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="field-group">
            <label for="name" class="field-label">
              <span class="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              Nome completo*
            </label>
            <input
              id="name"
              type="text"
              class="field-input"
              formControlName="name"
              [class.field-input--error]="name?.invalid && name?.touched"
              autocomplete="name"
              aria-label="Nome completo"
              placeholder="Seu nome"
            >
            @if (name?.invalid && name?.touched) {
              <div class="field-error">
                @if (name?.errors?.['required']) {
                  <span>Nome é obrigatório</span>
                }
                @if (name?.errors?.['minlength']) {
                  <span>Mínimo de 2 caracteres</span>
                }
              </div>
            }
          </div>

          <div class="field-group">
            <label for="email" class="field-label">
              <span class="field-icon">@</span>
              Email do Bio-Perfil*
            </label>
            <input
              id="email"
              type="email"
              class="field-input"
              formControlName="email"
              [class.field-input--error]="email?.invalid && email?.touched"
              autocomplete="email"
              aria-label="Email do Bio-Perfil"
              placeholder="seu@email.com"
            >
            @if (email?.invalid && email?.touched) {
              <div class="field-error">
                @if (email?.errors?.['required']) {
                  <span>Email é obrigatório</span>
                }
                @if (email?.errors?.['email']) {
                  <span>Formato de email inválido</span>
                }
              </div>
            }
          </div>

          <div class="field-group">
            <label for="password" class="field-label">
              <span class="field-icon">🔒</span>
              Senha de Enlace*
            </label>
            <div class="password-wrapper">
              <input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                class="field-input field-input--with-toggle"
                formControlName="password"
                [class.field-input--error]="password?.invalid && password?.touched"
                autocomplete="new-password"
                aria-label="Senha de Enlace"
                placeholder="Mínimo 6 caracteres"
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
                  <span>Senha é obrigatória</span>
                }
                @if (password?.errors?.['minlength']) {
                  <span>Mínimo de 6 caracteres</span>
                }
              </div>
            }
          </div>

          <div class="field-group">
            <label for="confirmPassword" class="field-label">
              <span class="field-icon">✓</span>
              Confirmar Senha*
            </label>
            <input
              id="confirmPassword"
              type="password"
              class="field-input"
              formControlName="confirmPassword"
              [class.field-input--error]="confirmPassword?.invalid && confirmPassword?.touched"
              autocomplete="new-password"
              aria-label="Confirmar Senha"
              placeholder="Repita a senha"
            >
            @if (confirmPassword?.invalid && confirmPassword?.touched) {
              <div class="field-error">
                @if (confirmPassword?.errors?.['required']) {
                  <span>Confirmação é obrigatória</span>
                }
                @if (registerForm.errors?.['passwordsMismatch']) {
                  <span>As senhas não coincidem</span>
                }
              </div>
            }
          </div>

          @if (errorMessage()) {
            <div class="global-error">
              {{ errorMessage() }}
            </div>
          }

          <button 
            type="submit" 
            class="btn-submit"
            [disabled]="registerForm.invalid || isLoading()"
          >
            @if (!isLoading()) {
              <span>CRIAR CONTA GRATUITA</span>
            } @else {
              <span class="loading-spinner"></span>
            }
          </button>
        </form>

        <div class="auth-footer">
          <span>Já é membro?</span>
          <a routerLink="/login" class="auth-link">Fazer login</a>
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

    .user-icon-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 20px;
      margin-bottom: 20px;
      color: var(--nessa-primary);
      filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.3));
    }

    .auth-title {
      font-family: var(--nessa-font-display);
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 0.25em;
      color: var(--nessa-text);
      margin: 0 0 10px 0;
      text-transform: uppercase;
      background: linear-gradient(135deg, var(--nessa-primary) 0%, var(--nessa-accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .auth-subtitle {
      font-size: 12px;
      font-weight: 400;
      line-height: 1.6;
      letter-spacing: 0.02em;
      color: var(--nessa-text-muted);
      margin: 0;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
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
      font-size: 11px;
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
      font-size: 13px;
      color: var(--nessa-primary);
    }

    .field-icon svg {
      width: 100%;
      height: 100%;
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
      margin-top: 8px;
      background: linear-gradient(135deg, var(--nessa-primary) 0%, var(--nessa-primary-hover) 100%);
      border: none;
      border-radius: 12px;
      color: white;
      font-size: 12px;
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
        font-size: 22px;
        letter-spacing: 0.2em;
      }

      .auth-subtitle {
        font-size: 11px;
      }

      .user-icon-wrapper {
        width: 64px;
        height: 64px;
      }

      .field-input {
        height: 48px;
      }

      .btn-submit {
        height: 48px;
        font-size: 11px;
      }
    }
  `,
})
export class RegisterPage {
  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required]],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  async onSubmit() {
    if (this.registerForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { name, email, password } = this.registerForm.value;

    try {
      await this.authService.register({ name, email, password }).toPromise();
      
      setTimeout(() => {
        this.router.navigate(["/login"]);
      }, 1500);
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      if (error?.status === 400) {
        this.errorMessage.set("Dados inválidos. Verifique as informações.");
      } else if (error?.status === 409) {
        this.errorMessage.set("Já existe uma conta com este email.");
      } else {
        this.errorMessage.set("Falha no registro. Tente novamente.");
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  get name() { return this.registerForm.get("name"); }
  get email() { return this.registerForm.get("email"); }
  get password() { return this.registerForm.get("password"); }
  get confirmPassword() { return this.registerForm.get("confirmPassword"); }
}
