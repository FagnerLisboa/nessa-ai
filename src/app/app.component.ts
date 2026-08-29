import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import styles from "./app.component.scss?inline";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: [styles],
})
export class AppComponent {}
