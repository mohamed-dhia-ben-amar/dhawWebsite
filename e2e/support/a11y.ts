import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/** WCAG 2.2 AA plus axe best practices, as required by the brief (§8). */
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

export async function expectNoA11yViolations(page: Page): Promise<void> {
  // Let fade-ins finish first: half-faded text fails contrast. Some start a frame or two late
  // (scroll reveal), so wait until nothing finite is running. Looping animations (the cursor
  // blink) never finish and are ignored.
  await page.evaluate(async () => {
    const frames = () =>
      new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    for (let round = 0; round < 10; round++) {
      await frames();
      const running = document
        .getAnimations()
        .filter((a) => a.playState === 'running' && a.effect?.getTiming().iterations !== Infinity);
      if (!running.length) return;
      await Promise.all(running.map((a) => a.finished.catch(() => undefined)));
    }
  });
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const summary = violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    targets: v.nodes.map((n) => n.target.join(' ')),
  }));
  expect(summary).toEqual([]);
}

/** Fails if the page body scrolls horizontally at the current viewport width. */
export async function expectNoHorizontalScroll(page: Page): Promise<void> {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}
