import { Component } from "@angular/core";

@Component({
  selector: "app-home",
  standalone: true,
  template: `
    <main class="stage" aria-label="NESSA AI">
      <svg class="mark" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="nessa-wing" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stop-color="var(--nessa-primary)" />
            <stop offset="1" stop-color="var(--nessa-secondary)" />
          </linearGradient>
        </defs>
        <g fill="url(#nessa-wing)">
          <path d="M22.6 20.5C16.5 8.5 5.5 5.5 4.6 12.6 3.8 18.9 12 23.6 22.6 23.4Z" opacity=".96" />
          <path d="M25.4 20.5C31.5 8.5 42.5 5.5 43.4 12.6 44.2 18.9 36 23.6 25.4 23.4Z" opacity=".96" />
          <path d="M22.6 25.6C13.5 25 7.5 30 10 36.2 12.3 41.6 20.4 38.6 22.6 30.4Z" opacity=".8" />
          <path d="M25.4 25.6C34.5 25 40.5 30 38 36.2 35.7 41.6 27.6 38.6 25.4 30.4Z" opacity=".8" />
        </g>
        <rect x="22.7" y="14" width="2.6" height="21" rx="1.3" fill="var(--nessa-text)" opacity=".92" />
        <circle cx="24" cy="12.4" r="1.9" fill="var(--nessa-text)" opacity=".92" />
        <path
          d="M22.6 11.5C20.8 8 18.4 6.2 15.8 5.4M25.4 11.5C27.2 8 29.6 6.2 32.2 5.4"
          stroke="var(--nessa-accent)"
          stroke-width="1.3"
          stroke-linecap="round"
        />
        <circle cx="15.4" cy="5.2" r="1" fill="var(--nessa-accent)" />
        <circle cx="32.6" cy="5.2" r="1" fill="var(--nessa-accent)" />
      </svg>
      <h1 class="wordmark">NESSA</h1>
      <p class="tag">AI · fundação Angular 20</p>
    </main>
  `,
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {}
