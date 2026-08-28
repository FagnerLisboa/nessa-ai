/* ============================================================
   NESSA AI — Guards de rota (core/guards)
   Etapa 1: sem autenticação. O guard já está conectado ao
   roteador; a sessão real será validada na Etapa 2.
   ============================================================ */

export type GuardResult = boolean;

export type RouteGuard = () => GuardResult;

/**
 * Guard de autenticação.
 * Hoje aprova todas as rotas (não existe backend de identidade).
 * Na Etapa 2 passa a verificar token de sessão e redirecionar.
 */
export const authGuard: RouteGuard = () => true;

/** Executa uma lista de guards em ordem; primeiro `false` bloqueia. */
export function runGuards(guards: RouteGuard[]): boolean {
  return guards.every((guard) => guard());
}
