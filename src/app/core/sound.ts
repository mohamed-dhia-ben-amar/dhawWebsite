import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export type SoundName = 'click' | 'wave' | 'success';

/** localStorage key for the visitor's choice. */
export const SOUND_STORAGE_KEY = 'sound';

/** Elements whose clicks make a sound; `data-sound` picks another one, or `off` for none. */
const SOUNDING = 'a[href], button, [role="tab"]';

/**
 * Optional sound effects, off by default (brief: never surprise a visitor with audio). The header
 * toggle turns them on; the choice is remembered. While on, one delegated click listener plays a
 * short tick for links, buttons and tabs, so components need no wiring; `data-sound="wave"` or
 * `"success"` on an element picks another sound and `data-sound="off"` silences it. Sounds are
 * synthesised with Web Audio (no files to download), and the audio context is created on the first
 * click, as browsers require.
 */
@Injectable({ providedIn: 'root' })
export class Sound {
  readonly enabled = signal(false);

  private readonly document = inject(DOCUMENT);
  private context: AudioContext | null = null;
  private started = false;

  /** Restores the visitor's choice and starts listening for clicks. Browser only. */
  init(): void {
    const view = this.document.defaultView;
    if (this.started || !view) return;
    this.started = true;
    this.enabled.set(this.read() === 'on');
    this.document.addEventListener('click', (event) => this.onClick(event), { capture: true });
  }

  setEnabled(on: boolean): void {
    this.enabled.set(on);
    try {
      this.document.defaultView?.localStorage.setItem(SOUND_STORAGE_KEY, on ? 'on' : 'off');
    } catch {
      // Storage blocked: the choice lasts for this page only.
    }
  }

  /** Plays a sound if sound is on. */
  play(name: SoundName): void {
    if (!this.enabled()) return;
    const ctx = this.audio();
    if (!ctx) return;
    if (ctx.state === 'suspended') void ctx.resume();
    const t = ctx.currentTime;
    if (name === 'click') this.tone(ctx, t, 1100, 700, 0.045, 0.05, 'triangle');
    if (name === 'success') {
      this.tone(ctx, t, 660, 660, 0.12, 0.05, 'triangle');
      this.tone(ctx, t + 0.11, 990, 990, 0.18, 0.05, 'triangle');
    }
    if (name === 'wave') this.sweep(ctx, t);
  }

  private onClick(event: Event): void {
    if (!this.enabled()) return;
    const target = (event.target as Element | null)?.closest?.(SOUNDING);
    if (!target || target.getAttribute('aria-disabled') === 'true') return;
    const choice = target.getAttribute('data-sound');
    if (choice === 'off') return;
    this.play(choice === 'wave' || choice === 'success' ? choice : 'click');
  }

  private read(): string | null {
    try {
      return this.document.defaultView?.localStorage.getItem(SOUND_STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }

  private audio(): AudioContext | null {
    if (this.context) return this.context;
    const view = this.document.defaultView as (Window & typeof globalThis) | null;
    if (!view || typeof view.AudioContext !== 'function') return null;
    this.context = new view.AudioContext();
    return this.context;
  }

  /** A short pitched blip that glides from `from` to `to` Hz. */
  private tone(
    ctx: AudioContext,
    t: number,
    from: number,
    to: number,
    duration: number,
    volume: number,
    type: OscillatorType,
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(to, t + duration);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  }

  /** The theme wave: filtered noise sweeping up, under a soft rising tone. */
  private sweep(ctx: AudioContext, t: number): void {
    const duration = 0.7;
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 1.4;
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.exponentialRampToValueAtTime(2600, t + duration * 0.8);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.16, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(t);
    noise.stop(t + duration);
    this.tone(ctx, t, 220, 440, duration * 0.7, 0.04, 'sine');
  }
}
