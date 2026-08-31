/* ============================================================
   NESSA AI — Modelos de domínio (core/models)
   Contratos tipados das áreas da plataforma. Conversas e chat
   são persistidos pelo backend FastAPI; as demais áreas seguem
   com dados de demonstração em core/services.
   ============================================================ */

/** Mensagem individual dentro de uma conversa. */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messageCount: number;
  /** Data já formatada (pt-BR) para exibição. */
  displayDate: string;
  /** Mensagens da conversa (presentes quando carregadas em detalhe). */
  messages?: ChatMessage[];
}

export type AgentStatus = "ativo" | "pausado";

export interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  status: AgentStatus;
  /** Letra exibida no monograma do avatar. */
  monogram: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  fileCount: number;
  conversationCount: number;
  displayUpdate: string;
}

export type FileKind = "pdf" | "docx" | "txt" | "csv" | "xlsx" | "png" | "jpg" | "webp";
export type FileStatus = "pronto" | "processando";

export interface FileItem {
  id: string;
  name: string;
  kind: FileKind;
  sizeLabel: string;
  displayDate: string;
  status: FileStatus;
}

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3";

export interface ImageGeneration {
  id: string;
  prompt: string;
  ratio: AspectRatio;
  createdAt: string;
}

export type VideoDuration = "5s" | "10s" | "20s";

export interface VideoGeneration {
  id: string;
  prompt: string;
  duration: VideoDuration;
  ratio: AspectRatio;
  createdAt: string;
}

export interface VoiceSession {
  id: string;
  durationLabel: string;
  transcription: string;
  displayDate: string;
}

export interface ResearchSource {
  title: string;
  origin: string;
}

export interface ResearchResult {
  query: string;
  sources: ResearchSource[];
}

export interface AssistantTask {
  id: string;
  label: string;
  done: boolean;
}

export interface AssistantActivity {
  id: string;
  label: string;
  timeLabel: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  plan: string;
}

export type ProviderStatus = "nao_configurado";

export interface AIProvider {
  id: string;
  name: string;
  model: string;
  status: ProviderStatus;
}

/* ------------------------------------------------------------
   Modelos de IA selecionáveis no composer.
   O `id` é o identificador que será enviado à API quando o
   backend expuser o roteamento de motores (AI Gateway).
   ------------------------------------------------------------ */
export interface AiModel {
  id: string;
  label: string;
}

export const AI_MODELS: AiModel[] = [
  { id: "nessa", label: "NESSA" },
  { id: "qwen", label: "Qwen" },
  { id: "gemini", label: "Gemini" },
];

export const DEFAULT_AI_MODEL_ID = "nessa";
