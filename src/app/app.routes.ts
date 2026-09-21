import type { Routes } from "@angular/router";

import { LoginComponent } from "./features/auth/login/login.component";
import { RegisterComponent } from "./features/auth/register/register.component";

import { AgentsPage } from "./features/agents/agents.page";
import { AssistantPage } from "./features/assistant/assistant.page";
import { ConversationsPage } from "./features/conversations/conversations.page";
import { FilesPage } from "./features/files/files.page";
import { HomePage } from "./features/home/home.page";
import { ImagesPage } from "./features/images/images.page";
import { ProfilePage } from "./features/profile/profile.page";
import { ProjectsPage } from "./features/projects/projects.page";
import { ResearchPage } from "./features/research/research.page";
import { SettingsPage } from "./features/settings/settings.page";
import { ShellComponent } from "./features/shell/shell.component";
import { VideosPage } from "./features/videos/videos.page";
import { VoicePage } from "./features/voice/voice.page";

export const routes: Routes = [
  // Área principal da aplicação
  {
    path: "",
    component: ShellComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        component: HomePage,
      },
      {
        path: "conversations",
        component: ConversationsPage,
      },
      {
        path: "agents",
        component: AgentsPage,
      },
      {
        path: "projects",
        component: ProjectsPage,
      },
      {
        path: "files",
        component: FilesPage,
      },
      {
        path: "images",
        component: ImagesPage,
      },
      {
        path: "videos",
        component: VideosPage,
      },
      {
        path: "voice",
        component: VoicePage,
      },
      {
        path: "research",
        component: ResearchPage,
      },
      {
        path: "assistant",
        component: AssistantPage,
      },
      {
        path: "settings",
        component: SettingsPage,
      },
      {
        path: "profile",
        component: ProfilePage,
      },
    ],
  },

  // Autenticação
  {
    path: "login",
    component: LoginComponent,
    title: "Login - NESSA AI",
  },
  {
    path: "cadastro",
    component: RegisterComponent,
    title: "Criar conta - NESSA AI",
  },

  // Rota não encontrada
  {
    path: "**",
    redirectTo: "",
  },
];
