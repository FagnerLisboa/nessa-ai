/* ============================================================
   NESSA AI — Roteador raiz
   Rotas lazy por módulo, guard de autenticação conectado e
   shell único. Nenhum conteúdo é simulado.
   ============================================================ */
import { lazy } from "react";
import { HashRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { authGuard, runGuards } from "./core/guards/auth.guard";
import { Shell } from "./layout/shell/Shell";
import { EmptyState } from "./shared/components/EmptyState";

const HomePage = lazy(() => import("./features/home/HomePage"));
const ChatPage = lazy(() => import("./features/chat/ChatPage"));
const ConversationsPage = lazy(() => import("./features/conversations/ConversationsPage"));
const AgentsPage = lazy(() => import("./features/agents/AgentsPage"));
const ProjectsPage = lazy(() => import("./features/projects/ProjectsPage"));
const FilesPage = lazy(() => import("./features/files/FilesPage"));
const ImagesPage = lazy(() => import("./features/images/ImagesPage"));
const VideosPage = lazy(() => import("./features/videos/VideosPage"));
const VoicePage = lazy(() => import("./features/voice/VoicePage"));
const ResearchPage = lazy(() => import("./features/research/ResearchPage"));
const AssistantPage = lazy(() => import("./features/assistant/AssistantPage"));
const SettingsPage = lazy(() => import("./features/settings/SettingsPage"));

function GuardedShell() {
  if (!runGuards([authGuard])) {
    return <Navigate to="/" replace />;
  }
  return <Shell />;
}

function NotFoundPage() {
  return (
    <EmptyState
      title="Página não encontrada"
      description="Este caminho não faz parte da NESSA. Verifique o endereço ou volte para o início."
    >
      <Link
        to="/"
        className="inline-flex h-9 items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--nessa-primary)] px-4 text-[13px] font-semibold text-[var(--nessa-text)] transition-all duration-[var(--t-fast)] ease-[var(--ease-out)] hover:bg-[var(--nessa-primary-hover)] active:scale-[0.97]"
        aria-label="Voltar para o início"
      >
        Voltar ao início
      </Link>
    </EmptyState>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<GuardedShell />}>
          <Route index element={<HomePage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="conversations" element={<ConversationsPage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="images" element={<ImagesPage />} />
          <Route path="videos" element={<VideosPage />} />
          <Route path="voice" element={<VoicePage />} />
          <Route path="research" element={<ResearchPage />} />
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
