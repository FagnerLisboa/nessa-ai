import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { firstValueFrom } from "rxjs";

import { AuthService } from "../../../../core/services/auth.service";
import { NessaLogoComponent } from "../../../shared/components/nessa-logo/nessa-logo.component";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NessaLogoComponent],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  loginForm: FormGroup;

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid || this.isLoading()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    try {
      await firstValueFrom(
        this.authService.login({
          email,
          password,
        }),
      );

      await this.router.navigate(["/"]);
    } catch (error: any) {
      console.error("Erro no login:", error);

      if (error?.status === 401) {
        this.errorMessage.set("Credenciais inválidas.");
      } else if (error?.status === 400) {
        this.errorMessage.set("Dados inválidos. Verifique as informações.");
      } else {
        this.errorMessage.set("Falha na sincronização. Tente novamente.");
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }
}
