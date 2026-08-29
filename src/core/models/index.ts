/* ============================================================
   NESSA AI — Modelos de domínio (core/models)
   Contratos tipados das áreas da plataforma. Os dados desta
   etapa são mockados em core/services — sem backend, sem banco.
   ============================================================ */

export interface Conversation {
  id: string;
  title: string;
  messageCount: number;
  /** Data já formatada (pt-BR) para exibição. */
  displayDate: string;
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
