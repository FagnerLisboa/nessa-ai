import { Component, OnDestroy, signal } from "@angular/core";

import { PageHeaderComponent } from "../../shared/components/page-header.component";

@Component({
  selector: "app-voice-page",
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <section class="page">
      <app-page-header title="Voz" description="Converse com a NESSA usando voz."></app-page-header>

      <div class="booth panel arrive" style="animation-delay: 60ms">
        <div class="booth__core">
          <button
            type="button"
            class="mic"
            [class.is-recording]="recording()"
            (click)="toggleRecording()"
            [attr.aria-label]="recording() ? 'Parar gravação' : 'Iniciar gravação'"
          >
            @if (recording()) {
              <span class="mic__ring" aria-hidden="true"></span>
              <span class="mic__ring mic__ring--late" aria-hidden="true"></span>
            }
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              @if (recording()) {
                <rect x="8" y="8" width="8" height="8" rx="1.5" fill="currentColor" stroke="none" />
              } @else {
                <rect x="9.2" y="3.5" width="5.6" height="10" rx="2.8" />
                <path d="M6 11.5a6 6 0 0 0 12 0M12 17.5v3M9.5 20.5h5" />
              }
            </svg>
          </button>

          <p class="booth__status" role="status" aria-live="polite">
            @if (recording()) {
              Gravando… <span class="booth__timer">{{ timerLabel() }}</span>
            } @else if (lastNotice().length > 0) {
              {{ lastNotice() }}
            } @else {
              Toque para iniciar a gravação
            }
          </p>

          <div class="bars" [class.is-live]="recording()" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>

        <div class="booth__transcript">
          <p class="u-eyebrow booth__transcript-label">Transcrição</p>
          <p class="booth__transcript-text">
            @if (recording()) {
              Ouvindo você…
            } @else {
              A transcrição em tempo real aparece aqui.
            }
          </p>
        </div>
      </div>

      <div class="history arrive" style="animation-delay: 120ms">
        <p class="u-eyebrow history__title">Histórico de áudios</p>
        <div class="panel panel--soft history__empty">
          <span class="history__ghost" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 10v4M8 7.5v9M12 5v14M16 7.5v9M20 10v4" />
            </svg>
          </span>
          <p class="history__hint">Nenhum áudio gravado ainda.</p>
        </div>
      </div>
    </section>
  `,
  styles: `
    .booth {
      padding: 40px 20px 30px;
    }

    .booth__core {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .mic {
      position: relative;
      display: grid;
      place-items: center;
      width: 78px;
      height: 78px;
      border: 1px solid var(--nessa-primary-ring);
      border-radius: var(--radius-full);
      background: var(--nessa-primary-soft);
      color: var(--nessa-accent);
      cursor: pointer;
      transition: background var(--t-base) var(--ease-out), border-color var(--t-base) var(--ease-out),
        color var(--t-base) var(--ease-out), transform var(--t-fast) var(--ease-spring);
    }

    .mic:hover {
      transform: scale(1.04);
    }

    .mic:active {
      transform: scale(0.96);
    }

    .mic.is-recording {
      background: var(--nessa-danger-soft);
      border-color: color-mix(in srgb, var(--nessa-danger) 45%, transparent);
      color: var(--nessa-danger);
    }

    .mic__ring {
      position: absolute;
      inset: -1px;
      border-radius: var(--radius-full);
      border: 1.5px solid var(--nessa-danger);
      opacity: 0;
      animation: ring-out 1.8s var(--ease-out) infinite;
    }

    .mic__ring--late {
      animation-delay: 0.9s;
    }

    @keyframes ring-out {
      0% { transform: scale(1); opacity: 0.55; }
      100% { transform: scale(1.65); opacity: 0; }
    }

    .booth__status {
      margin: 0;
      font-size: 13.5px;
      font-weight: 500;
      color: var(--nessa-text-muted);
      text-align: center;
    }

    .booth__timer {
      font-variant-numeric: tabular-nums;
      font-weight: 700;
      color: var(--nessa-text);
    }

    .bars {
      display: flex;
      align-items: center;
      gap: 5px;
      height: 26px;
    }

    .bars span {
      width: 3.5px;
      height: 8px;
      border-radius: var(--radius-full);
      background: var(--nessa-text-muted);
      opacity: 0.4;
      transition: background var(--t-base) var(--ease-out);
    }

    .bars.is-live span {
      background: var(--nessa-danger);
      opacity: 1;
      animation: bar-dance 0.9s var(--ease-out) infinite;
    }

    .bars.is-live span:nth-child(1) { animation-delay: 0s; }
    .bars.is-live span:nth-child(2) { animation-delay: 0.12s; }
    .bars.is-live span:nth-child(3) { animation-delay: 0.24s; }
    .bars.is-live span:nth-child(4) { animation-delay: 0.36s; }
    .bars.is-live span:nth-child(5) { animation-delay: 0.48s; }

    @keyframes bar-dance {
      0%, 100% { height: 8px; }
      50% { height: 24px; }
    }

    .booth__transcript {
      margin-top: 30px;
      padding: 16px 18px;
      border: 1px solid var(--nessa-hairline);
      border-radius: var(--radius-sm);
      background: var(--nessa-surface-2);
    }

    .booth__transcript-label {
      margin-bottom: 7px;
    }

    .booth__transcript-text {
      margin: 0;
      min-height: 22px;
      font-size: 14px;
      line-height: 1.6;
      color: var(--nessa-text);
    }

    .history {
      margin-top: 30px;
    }

    .history__title {
      margin-bottom: 12px;
    }

    .history__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 40px 20px;
    }

    .history__ghost {
      color: var(--nessa-text-muted);
      opacity: 0.55;
    }

    .history__hint {
      margin: 0;
      font-size: 13px;
      color: var(--nessa-text-muted);
    }

    @media (prefers-reduced-motion: reduce) {
      .mic__ring,
      .bars.is-live span {
        animation: none;
      }
    }
  `,
})
export class VoicePage implements OnDestroy {
  protected readonly recording = signal(false);
  protected readonly timerLabel = signal("00:00");
  protected readonly lastNotice = signal("");

  private timerId: number | null = null;
  private startedAt = 0;

  protected toggleRecording(): void {
    if (this.recording()) {
      this.stop();
    } else {
      this.start();
    }
  }

  private start(): void {
    this.lastNotice.set("");
    this.recording.set(true);
    this.startedAt = Date.now();
    this.timerLabel.set("00:00");
    this.timerId = window.setInterval(() => this.tick(), 250);
  }

  private stop(): void {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.recording.set(false);
    this.lastNotice.set(`Gravação de ${this.timerLabel()} concluída — o processamento chega com o motor de voz.`);
  }

  private tick(): void {
    const totalSeconds = Math.floor((Date.now() - this.startedAt) / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    this.timerLabel.set(`${minutes}:${seconds}`);
  }

  ngOnDestroy(): void {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
    }
  }
}
