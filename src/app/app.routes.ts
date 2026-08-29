import type { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    loadComponent: () =>
      import("./features/shell/shell.component").then((m) => m.ShellComponent),
  },
  {
    path: "**",
    redirectTo: "",
  },
];
