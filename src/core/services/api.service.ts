/* ============================================================
   NESSA AI — Serviços de API (core/services)
   Contratos tipados por recurso. Nada é chamado na Etapa 1 —
   estes serviços serão consumidos pelas features nas Etapas 2/3.
   ============================================================ */
import { http } from "../interceptors/http";
import type { Agent, Conversation, FileItem, ProjectItem } from "../models";

export const API_ROUTES = {
  conversations: "/conversations",
  agents: "/agents",
  projects: "/projects",
  files: "/files",
} as const;

export const ConversationsService = {
  list: () => http.get<Conversation[]>(API_ROUTES.conversations),
};

export const AgentsService = {
  list: () => http.get<Agent[]>(API_ROUTES.agents),
};

export const ProjectsService = {
  list: () => http.get<ProjectItem[]>(API_ROUTES.projects),
};

export const FilesService = {
  list: () => http.get<FileItem[]>(API_ROUTES.files),
};
