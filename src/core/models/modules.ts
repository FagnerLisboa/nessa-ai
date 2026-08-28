/* ============================================================
   NESSA AI — Registro de módulos
   Fonte única de verdade para navegação, sidebar e overview.
   ============================================================ */
import type { FeatureModule, ModuleId, NavGroup } from "./index";

export const NAV_GROUPS: NavGroup[] = [
  { id: "principal", title: "Principal" },
  { id: "estudio", title: "Estúdio" },
  { id: "midia", title: "Mídia" },
  { id: "descoberta", title: "Descoberta" },
  { id: "sistema", title: "Sistema" },
];

export const MODULES: FeatureModule[] = [
  {
    id: "home",
    label: "Início",
    path: "/",
    icon: "home",
    group: "principal",
    stage: 1,
    ready: true,
    summary: "Visão geral da plataforma, status da fundação e mapa de módulos.",
    capabilities: ["Status do sistema em tempo real", "Mapa de módulos e rotas", "Folha de tokens de design"],
  },
  {
    id: "chat",
    label: "Chat",
    path: "/chat",
    icon: "chat",
    group: "principal",
    stage: 3,
    ready: false,
    summary: "Conversa direta com o motor de IA da NESSA.",
    capabilities: ["Streaming de respostas token a token", "Contexto persistente entre sessões", "Citações e fontes verificáveis"],
  },
  {
    id: "conversations",
    label: "Conversas",
    path: "/conversations",
    icon: "stack",
    group: "principal",
    stage: 3,
    ready: false,
    summary: "Histórico organizado de todas as conversas do workspace.",
    capabilities: ["Busca semântica no histórico", "Pastas e etiquetas", "Conversas fixadas"],
  },
  {
    id: "agents",
    label: "Agentes",
    path: "/agents",
    icon: "nodes",
    group: "estudio",
    stage: 2,
    ready: false,
    summary: "Agentes especializados com personas, ferramentas e memória.",
    capabilities: ["Personas configuráveis", "Ferramentas e ações", "Memória de longo prazo"],
  },
  {
    id: "projects",
    label: "Projetos",
    path: "/projects",
    icon: "folder",
    group: "estudio",
    stage: 2,
    ready: false,
    summary: "Espaços de trabalho com contexto e recursos próprios.",
    capabilities: ["Contexto isolado por projeto", "Quadro de tarefas", "Colaboração em equipe"],
  },
  {
    id: "files",
    label: "Arquivos",
    path: "/files",
    icon: "doc",
    group: "estudio",
    stage: 2,
    ready: false,
    summary: "Documentos indexados para a base de conhecimento da plataforma.",
    capabilities: ["Upload e versionamento", "Indexação vetorial", "Permissões granulares"],
  },
  {
    id: "images",
    label: "Imagens",
    path: "/images",
    icon: "image",
    group: "midia",
    stage: 3,
    ready: false,
    summary: "Geração e curadoria de imagens a partir de prompts.",
    capabilities: ["Geração por prompt", "Estilos e presets", "Biblioteca com busca visual"],
  },
  {
    id: "videos",
    label: "Vídeos",
    path: "/videos",
    icon: "play",
    group: "midia",
    stage: 3,
    ready: false,
    summary: "Geração e edição de vídeo com direção textual.",
    capabilities: ["Texto para vídeo", "Storyboards automáticos", "Exportação em alta resolução"],
  },
  {
    id: "voice",
    label: "Voz",
    path: "/voice",
    icon: "wave",
    group: "midia",
    stage: 3,
    ready: false,
    summary: "Voz neural natural em tempo real.",
    capabilities: ["Síntese com prosódia natural", "Transcrição precisa", "Voz conversacional em tempo real"],
  },
  {
    id: "research",
    label: "Pesquisa",
    path: "/research",
    icon: "compass",
    group: "descoberta",
    stage: 3,
    ready: false,
    summary: "Pesquisa profunda com síntese citada e verificável.",
    capabilities: ["Varredura multi-fonte", "Relatórios estruturados", "Verificação de afirmações"],
  },
  {
    id: "assistant",
    label: "Assistente",
    path: "/assistant",
    icon: "spark",
    group: "descoberta",
    stage: 3,
    ready: false,
    summary: "Assistente proativo integrado ao seu fluxo de trabalho.",
    capabilities: ["Atalho global", "Sugestões contextuais", "Rotinas automatizadas"],
  },
  {
    id: "settings",
    label: "Configurações",
    path: "/settings",
    icon: "gear",
    group: "sistema",
    stage: 1,
    ready: true,
    summary: "Preferências do operador e da interface, persistidas localmente.",
    capabilities: ["Perfil do operador", "Densidade e movimento", "Preferências persistidas"],
  },
];

export function getModule(id: ModuleId): FeatureModule {
  const found = MODULES.find((m) => m.id === id);
  if (!found) throw new Error(`Módulo desconhecido: ${id}`);
  return found;
}

export function getModuleByPath(pathname: string): FeatureModule | undefined {
  return MODULES.find((m) => m.path === pathname);
}
