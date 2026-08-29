import type { Routes } from "@angular/router";

import { ShellComponent } from "./features/shell/shell.component";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: ShellComponent,
  },
  {
    path: "**",
    redirectTo: "",
  },
];
