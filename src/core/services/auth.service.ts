/* ============================================================
   NESSA AI — AuthService (core/services)
   Serviço de autenticação para login e cadastro de usuários.
   Integra-se com o backend FastAPI via ApiService.
   ============================================================ */

import { Injectable, signal } from "@angular/core";
import { Observable, tap, catchError, throwError } from "rxjs";

import { ApiService } from "./api.service";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AUTH_TOKEN_KEY = "nessa:auth:token";
const AUTH_USER_KEY = "nessa:auth:user";

@Injectable({ providedIn: "root" })
export class AuthService {
  readonly currentUser = signal<User | null>(this.readUser());
  readonly isAuthenticated = signal<boolean>(!!this.readToken());

  constructor(private api: ApiService) {}

  /**
   * Realiza login do usuário com e-mail e senha.
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.api.post<AuthResponse>("/auth/login", credentials).pipe(
      tap((response) => {
        this.saveToken(response.access_token);
        this.isAuthenticated.set(true);
      }),
      catchError((error) => {
        console.error("Login error:", error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Registra um novo usuário.
   */
  register(data: RegisterData): Observable<User> {
    return this.api.post<User>("/auth/register", data).pipe(
      catchError((error) => {
        console.error("Registration error:", error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout do usuário atual.
   */
  logout(): void {
    this.clearToken();
    this.clearUser();
    this.isAuthenticated.set(false);
  }

  /**
   * Busca informações do usuário autenticado.
   */
  getMe(): Observable<User> {
    return this.api.get<User>("/auth/me").pipe(
      tap((user) => {
        this.saveUser(user);
        this.currentUser.set(user);
      }),
      catchError((error) => {
        console.error("Get user error:", error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Verifica se há um token válido armazenado.
   */
  isLoggedIn(): boolean {
    return !!this.readToken();
  }

  /**
   * Salva o token de acesso no localStorage.
   */
  private saveToken(token: string): void {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch {
      /* armazenamento indisponível — o token segue em memória */
    }
  }

  /**
   * Lê o token do localStorage.
   */
  private readToken(): string | null {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Limpa o token do localStorage.
   */
  private clearToken(): void {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      /* noop */
    }
  }

  /**
   * Salva as informações do usuário no localStorage.
   */
  private saveUser(user: User): void {
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch {
      /* armazenamento indisponível — o usuário segue em memória */
    }
  }

  /**
   * Lê as informações do usuário do localStorage.
   */
  private readUser(): User | null {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      if (raw) {
        return JSON.parse(raw) as User;
      }
    } catch {
      /* noop */
    }
    return null;
  }

  /**
   * Limpa as informações do usuário do localStorage.
   */
  private clearUser(): void {
    try {
      localStorage.removeItem(AUTH_USER_KEY);
    } catch {
      /* noop */
    }
  }
}
