import { Component, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../core/services/auth.service";
import { NessaLogoComponent } from "../../shared/components/nessa-logo/nessa-logo.component";

@Component({
  selector: "app-register-page",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NessaLogoComponent],
  template: `
    <section class="auth-container">
      <div class="auth-card">
        <app-nessa-logo [size]="48"></app-nessa-logo>

        <h1 class="auth-title">Criar conta</h1>

        <p class="auth-subtitle">
          Preencha seus dados para começar a usar a NESSA AI
        </p>

        <form
          [formGroup]="registerForm"
          (ngSubmit)="onSubmit()"
          class="auth-form"
        >
          <!-- Nome -->
          <div class="field-group">
            <label for="name" class="label"> Nome </label>

            <input
              id="name"
              type="text"
              class="input"
              formControlName="name"
              [class.input--error]="name?.invalid && name?.touched"
            />

            @if (name?.invalid && name?.touched) {
              <div class="error-message">
                @if (name?.errors?.["required"]) {
                  <span>Nome é obrigatório</span>
                }

                @if (name?.errors?.["minlength"]) {
                  <span> Nome deve ter pelo menos 2 caracteres </span>
                }
              </div>
            }
          </div>

          <!-- E-mail -->
          <div class="field-group">
            <label for="email" class="label"> E-mail </label>

            <input
              id="email"
              type="email"
              class="input"
              formControlName="email"
              [class.input--error]="email?.invalid && email?.touched"
            />

            @if (email?.invalid && email?.touched) {
              <div class="error-message">
                @if (email?.errors?.["required"]) {
                  <span>E-mail é obrigatório</span>
                }

                @if (email?.errors?.["email"]) {
                  <span>Formato de e-mail inválido</span>
                }
              </div>
            }
          </div>

          <!-- Senha -->
          <div class="field-group">
            <label for="password" class="label"> Senha </label>

            <input
              id="password"
              type="password"
              class="input"
              formControlName="password"
              [class.input--error]="password?.invalid && password?.touched"
            />

            @if (password?.invalid && password?.touched) {
              <div class="error-message">
                @if (password?.errors?.["required"]) {
                  <span>Senha é obrigatória</span>
                }

                @if (password?.errors?.["minlength"]) {
                  <span> Senha deve ter pelo menos 6 caracteres </span>
                }
              </div>
            }
          </div>

          <!-- Confirmar senha -->
          <div class="field-group">
            <label for="confirmPassword" class="label"> Confirmar senha </label>

            <input
              id="confirmPassword"
              type="password"
              class="input"
              formControlName="confirmPassword"
              [class.input--error]="
                confirmPassword?.invalid && confirmPassword?.touched
              "
            />

            @if (confirmPassword?.invalid && confirmPassword?.touched) {
              <div class="error-message">
                @if (confirmPassword?.errors?.["required"]) {
                  <span> Confirmação de senha é obrigatória </span>
                }

                @if (registerForm.errors?.["passwordsMismatch"]) {
                  <span> As senhas não coincidem </span>
                }
              </div>
            }
          </div>

          <!-- Erro global -->
          @if (errorMessage()) {
            <div class="error-message error-message--global">
              {{ errorMessage() }}
            </div>
          }

          <!-- Botão -->
          <button
            type="submit"
            class="btn btn--primary btn--full"
            [disabled]="registerForm.invalid || isLoading()"
          >
            @if (!isLoading()) {
              <span>Criar conta</span>
            } @else {
              <span class="loading-spinner"></span>
            }
          </button>
        </form>

        <!-- Rodapé -->
        <div class="auth-footer">
          Já tem uma conta?
          <a routerLink="/login" class="link"> Fazer login </a>
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
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
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
export class RegisterPage {
  registerForm: FormGroup;

  isLoading = signal(false);

  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        name: ["", [Validators.required, Validators.minLength(2)]],

        email: ["", [Validators.required, Validators.email]],

        password: ["", [Validators.required, Validators.minLength(6)]],

        confirmPassword: ["", [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return {
        passwordsMismatch: true,
      };
    }

    return null;
  }

  async onSubmit() {
    if (this.registerForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { name, email, password } = this.registerForm.value;

    try {
      await this.authService.register({
        name,
        email,
        password,
      });

      // Cadastro realizado com sucesso.
      // Redireciona para o login.
      setTimeout(() => {
        this.router.navigate(["/login"]);
      }, 1500);
    } catch (error: any) {
      console.error("Erro no cadastro:", error);

      if (error?.status === 400) {
        this.errorMessage.set(
          "Dados inválidos. Verifique as informações fornecidas.",
        );
      } else if (error?.status === 409) {
        this.errorMessage.set("Já existe uma conta com este e-mail.");
      } else {
        this.errorMessage.set(
          "Ocorreu um erro durante o cadastro. Tente novamente.",
        );
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  get name() {
    return this.registerForm.get("name");
  }

  get email() {
    return this.registerForm.get("email");
  }

  get password() {
    return this.registerForm.get("password");
  }

  get confirmPassword() {
    return this.registerForm.get("confirmPassword");
  }
}
