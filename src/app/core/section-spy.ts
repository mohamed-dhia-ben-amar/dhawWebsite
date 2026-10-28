import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export interface SectionMark {
  readonly id: string;
  /** Scroll progress (0–1) at which the section becomes the active one. */
  readonly at: number;
}

/**
 * Tracks which homepage section is being read, for the header nav and the section stepper.
 * One passive scroll listener (batched per animation frame) while a page is tracked.
 * A section is active once its top passes a line 30% down the viewport, below the sticky header.
 */
@Injectable({ providedIn: 'root' })
export class SectionSpy {
  /** Id of the section being read, or null when no page is tracked. */
  readonly active = signal<string | null>(null);
  /** How far the page is scrolled, 0–1. */
  readonly progress = signal(0);
  readonly marks = signal<readonly SectionMark[]>([]);

  private readonly document = inject(DOCUMENT);

  /** Starts tracking the given section ids; returns a function that stops it. */
  track(ids: readonly string[]): () => void {
    const view = this.document.defaultView;
    if (!view) return () => undefined;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const root = this.document.documentElement;
      const max = Math.max(1, root.scrollHeight - view.innerHeight);
      const header =
        parseFloat(view.getComputedStyle(root).getPropertyValue('--header-height')) || 0;
      const line = header + view.innerHeight * 0.3;

      let active: string | null = null;
      const marks: SectionMark[] = [];
      for (const id of ids) {
        const element = this.document.getElementById(id);
        if (!element) continue;
        const top = element.getBoundingClientRect().top;
        if (top <= line || active === null) active = id;
        const at = (top + view.scrollY - line) / max;
        marks.push({ id, at: Math.min(1, Math.max(0, at)) });
      }
      // At the very bottom the last section may never reach the line: it is the one being read.
      if (view.scrollY >= max - 2 && marks.length) active = marks[marks.length - 1].id;

      this.progress.set(Math.min(1, Math.max(0, view.scrollY / max)));
      this.marks.set(marks);
      this.active.set(active);
    };
    const schedule = () => {
      if (!frame) frame = view.requestAnimationFrame(measure);
    };

    view.addEventListener('scroll', schedule, { passive: true });
    view.addEventListener('resize', schedule, { passive: true });
    measure();

    return () => {
      view.removeEventListener('scroll', schedule);
      view.removeEventListener('resize', schedule);
      if (frame) view.cancelAnimationFrame(frame);
      this.active.set(null);
      this.marks.set([]);
      this.progress.set(0);
    };
  }
}
