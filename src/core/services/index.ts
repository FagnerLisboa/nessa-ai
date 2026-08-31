/* ============================================================
   NESSA AI — Serviços (core/services)
   Dados mockados apenas para demonstrar a interface (Etapa 3).
   Nenhum backend, banco ou API é acessado.
   ============================================================ */
import { Injectable, signal } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

import type {
  AIProvider,
  Agent,
  AssistantActivity,
  AssistantTask,
  FileItem,
  Project,
  UserProfile,
} from "../models";

/* ============================================================
   Tema — estado único compartilhado (header + configurações).
   ============================================================ */
export type Theme = "dark" | "light";

const THEME_KEY = "nessa:theme";

@Injectable({ providedIn: "root" })
export class ThemeService {
  readonly theme = signal<Theme>(this.readInitial());

  setTheme(value: Theme): void {
    this.theme.set(value);
    document.documentElement.setAttribute("data-theme", value);
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch {
      /* armazenamento indisponível — o tema segue em memória */
    }
  }

  toggle(): void {
    this.setTheme(this.theme() === "dark" ? "light" : "dark");
  }

  private readInitial(): Theme {
    const fromDom = document.documentElement.getAttribute("data-theme");
    if (fromDom === "light" || fromDom === "dark") return fromDom;
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch {
      /* noop */
    }
    return "dark";
  }
}

/* ============================================================
   Conversas — persistidas pelo backend FastAPI.
   O acesso real vive em core/services/conversation.service.ts
   (ConversationService); o chat em core/services/chat.service.ts.
   ============================================================ */
export { ConversationService } from "./conversation.service";
export { ChatService } from "./chat.service";

/* ============================================================
   Agentes
   ============================================================ */
const AGENT_SEED: Agent[] = [
  {
    id: "a1",
    name: "Redatora",
    description: "Escreve e reescreve textos com tom de marca consistente.",
    model: "GPT-4o",
    status: "ativo",
    monogram: "R",
  },
  {
    id: "a2",
    name: "Analista de Dados",
    description: "Explora planilhas, cruza métricas e resume indicadores.",
    model: "Gemini 2.5 Pro",
    status: "ativo",
    monogram: "A",
  },
  {
    id: "a3",
    name: "Revisora Técnica",
    description: "Revisa documentação e código com foco em clareza.",
    model: "Claude Sonnet 4",
    status: "pausado",
    monogram: "R",
  },
  {
    id: "a4",
    name: "Pesquisadora Web",
    description: "Varre fontes públicas e devolve sínteses com citações.",
    model: "DeepSeek V3",
    status: "ativo",
    monogram: "P",
  },
];

@Injectable({ providedIn: "root" })
export class AgentsService {
  private items: Agent[] = [...AGENT_SEED];

  list(): Observable<Agent[]> {
    return of([...this.items]).pipe(delay(550));
  }

  add(agent: Omit<Agent, "id" | "monogram">): void {
    this.items.unshift({
      ...agent,
      id: `a-${Date.now().toString(36)}`,
      monogram: agent.name.trim().charAt(0).toUpperCase() || "N",
    });
  }

  toggleStatus(id: string): void {
    this.items = this.items.map((item) =>
      item.id === id
        ? { ...item, status: item.status === "ativo" ? "pausado" : "ativo" }
        : item,
    );
  }

  remove(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }
}

/* ============================================================
   Projetos
   ============================================================ */
const PROJECT_SEED: Project[] = [
  {
    id: "p1",
    name: "Lançamento NESSA",
    description: "Campanha, site e materiais do lançamento público.",
    fileCount: 12,
    conversationCount: 34,
    displayUpdate: "Atualizado hoje, 13:40",
  },
  {
    id: "p2",
    name: "TCC — Redes Neurais",
    description: "Pesquisa, capítulos e experimentos do trabalho final.",
    fileCount: 27,
    conversationCount: 58,
    displayUpdate: "Atualizado ontem, 21:12",
  },
  {
    id: "p3",
    name: "Cliente Aurora",
    description: "Proposta, cronograma e entregáveis do projeto Aurora.",
    fileCount: 8,
    conversationCount: 16,
    displayUpdate: "Atualizado em 2 fev, 10:05",
  },
];

@Injectable({ providedIn: "root" })
export class ProjectsService {
  private items: Project[] = [...PROJECT_SEED];

  list(): Observable<Project[]> {
    return of([...this.items]).pipe(delay(550));
  }

  add(project: Pick<Project, "name" | "description">): void {
    this.items.unshift({
      ...project,
      id: `p-${Date.now().toString(36)}`,
      fileCount: 0,
      conversationCount: 0,
      displayUpdate: "Criado agora",
    });
  }

  remove(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }
}

/* ============================================================
   Arquivos
   ============================================================ */
const FILE_SEED: FileItem[] = [
  { id: "f1", name: "relatorio-vendas-janeiro", kind: "pdf", sizeLabel: "2,4 MB", displayDate: "Hoje, 10:22", status: "pronto" },
  { id: "f2", name: "whitepaper-transformers", kind: "docx", sizeLabel: "812 KB", displayDate: "Hoje, 09:03", status: "pronto" },
  { id: "f3", name: "notas-reuniao-kickoff", kind: "txt", sizeLabel: "14 KB", displayDate: "Ontem, 17:48", status: "pronto" },
  { id: "f4", name: "leads-2026", kind: "csv", sizeLabel: "1,1 MB", displayDate: "Ontem, 14:31", status: "pronto" },
  { id: "f5", name: "orcamentos-trimestre", kind: "xlsx", sizeLabel: "640 KB", displayDate: "3 fev, 11:19", status: "pronto" },
  { id: "f6", name: "capa-site-v2", kind: "png", sizeLabel: "3,8 MB", displayDate: "2 fev, 16:44", status: "pronto" },
  { id: "f7", name: "retrato-fundadora", kind: "jpg", sizeLabel: "2,1 MB", displayDate: "1 fev, 12:08", status: "pronto" },
  { id: "f8", name: "banner-lancamento", kind: "webp", sizeLabel: "920 KB", displayDate: "28 jan, 09:37", status: "pronto" },
];

@Injectable({ providedIn: "root" })
export class FilesService {
  private items: FileItem[] = [...FILE_SEED];

  list(): Observable<FileItem[]> {
    return of([...this.items]).pipe(delay(600));
  }

  /** Upload real chega nas próximas etapas — aqui o arquivo entra como demonstração. */
  addLocal(name: string, sizeLabel: string, kind: FileItem["kind"]): string {
    const id = `f-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    this.items.unshift({
      id,
      name,
      kind,
      sizeLabel,
      displayDate: "Agora",
      status: "processando",
    });
    return id;
  }

  markReady(id: string): void {
    this.items = this.items.map((item) => (item.id === id ? { ...item, status: "pronto" } : item));
  }

  remove(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }
}

/* ============================================================
   Assistente
   ============================================================ */
@Injectable({ providedIn: "root" })
export class AssistantService {
  readonly tasks = signal<AssistantTask[]>([
    { id: "t1", label: "Revisar o resumo do artigo de transformers", done: true },
    { id: "t2", label: "Enviar roteiro do vídeo para aprovação", done: false },
    { id: "t3", label: "Consolidar métricas da semana em um relatório", done: false },
    { id: "t4", label: "Agendar revisão do plano de estudos", done: true },
  ]);

  readonly activities = signal<AssistantActivity[]>([
    { id: "v1", label: "Resumo do artigo concluído", timeLabel: "há 26 min" },
    { id: "v2", label: "Roteiro do vídeo atualizado", timeLabel: "há 2 h" },
    { id: "v3", label: "Análise do CSV de vendas finalizada", timeLabel: "ontem" },
    { id: "v4", label: "Plano de estudos revisado", timeLabel: "ontem" },
  ]);

  toggleTask(id: string): void {
    this.tasks.update((tasks) => tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  addTask(label: string): void {
    this.tasks.update((tasks) => [...tasks, { id: `t-${Date.now().toString(36)}`, label, done: false }]);
  }
}

/* ============================================================
   Perfil — persistido neste navegador.
   ============================================================ */
const PROFILE_KEY = "nessa:profile";

const PROFILE_DEFAULT: UserProfile = {
  name: "Ana Ribeiro",
  email: "ana@nessa.ai",
  role: "Fundadora",
  plan: "Plano Fundador",
};

@Injectable({ providedIn: "root" })
export class ProfileService {
  readonly profile = signal<UserProfile>(this.read());

  save(next: UserProfile): void {
    this.profile.set(next);
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    } catch {
      /* armazenamento indisponível — o perfil segue em memória */
    }
  }

  private read(): UserProfile {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) return { ...PROFILE_DEFAULT, ...(JSON.parse(raw) as Partial<UserProfile>) };
    } catch {
      /* noop */
    }
    return PROFILE_DEFAULT;
  }
}

/* ============================================================
   Modelos de IA — nenhuma chave é solicitada nesta etapa.
   ============================================================ */
const PROVIDER_SEED: AIProvider[] = [
  { id: "openai", name: "OpenAI", model: "GPT-4o", status: "nao_configurado" },
  { id: "gemini", name: "Google Gemini", model: "Gemini 2.5 Pro", status: "nao_configurado" },
  { id: "claude", name: "Anthropic Claude", model: "Claude Sonnet 4", status: "nao_configurado" },
  { id: "qwen", name: "Qwen", model: "Qwen3-Max", status: "nao_configurado" },
  { id: "kimi", name: "Kimi", model: "Kimi K2", status: "nao_configurado" },
  { id: "grok", name: "Grok", model: "Grok 4", status: "nao_configurado" },
  { id: "deepseek", name: "DeepSeek", model: "DeepSeek V3", status: "nao_configurado" },
];

@Injectable({ providedIn: "root" })
export class ProvidersService {
  readonly providers = signal<AIProvider[]>([...PROVIDER_SEED]);
}
