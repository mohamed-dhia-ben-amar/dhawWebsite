import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FileExplorer, explorerPanelId, explorerTabId } from './file-explorer';

@Component({
  imports: [FileExplorer],
  template: `<app-file-explorer
    idPrefix="exp"
    label="Experience files"
    heading="Explorer"
    [files]="files"
    [(active)]="active"
    [orientation]="orientation()"
  />`,
})
class Host {
  files = ['minotore.json', 'converty.json', 'ibspace.json', 'inoteqia.json'];
  readonly active = signal('minotore.json');
  readonly orientation = signal<'vertical' | 'horizontal'>('vertical');
}

describe('explorer ids', () => {
  it('derives stable tab and panel ids from the file name', () => {
    expect(explorerTabId('exp', 'minotore.json')).toBe('exp-tab-minotore');
    expect(explorerPanelId('exp', 'My File.v2.json')).toBe('exp-panel-my-file-v2');
  });
});

describe('FileExplorer', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const tabs = () => [...el.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const press = (key: string) => {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      (document.activeElement ?? tabs()[0]).dispatchEvent(event);
      fixture.detectChanges();
      return event;
    };
    return { fixture, el, tabs, press, host: fixture.componentInstance };
  }

  it('renders a labelled tab list with one tab per file', () => {
    const { el, tabs } = render();
    const list = el.querySelector('[role="tablist"]');
    expect(list?.getAttribute('aria-label')).toBe('Experience files');
    expect(list?.getAttribute('aria-orientation')).toBe('vertical');
    expect(tabs().map((t) => t.textContent?.replace(/\s+/g, ''))).toEqual([
      '{}minotore.json',
      '{}converty.json',
      '{}ibspace.json',
      '{}inoteqia.json',
    ]);
    tabs().forEach((t) => expect(t.tagName).toBe('BUTTON'));
  });

  it('links each tab to its panel and marks only the active one selected', () => {
    const [first, second] = render().tabs();
    expect(first.id).toBe('exp-tab-minotore');
    expect(first.getAttribute('aria-controls')).toBe('exp-panel-minotore');
    expect(first.getAttribute('aria-selected')).toBe('true');
    expect(second.getAttribute('aria-selected')).toBe('false');
  });

  it('uses a roving tabindex: only the selected tab is in the tab order', () => {
    expect(
      render()
        .tabs()
        .map((t) => t.getAttribute('tabindex')),
    ).toEqual(['0', '-1', '-1', '-1']);
  });

  it('selects a file on click and updates the two-way binding', () => {
    const { fixture, tabs, host } = render();
    tabs()[2].click();
    fixture.detectChanges();
    expect(host.active()).toBe('ibspace.json');
    expect(tabs()[2].getAttribute('aria-selected')).toBe('true');
    expect(tabs()[2].getAttribute('tabindex')).toBe('0');
  });

  it('moves focus and selection with the arrow keys, wrapping around', () => {
    const { tabs, press, host } = render();
    tabs()[0].focus();

    expect(press('ArrowDown').defaultPrevented).toBe(true);
    expect(host.active()).toBe('converty.json');
    expect(document.activeElement).toBe(tabs()[1]);

    press('ArrowRight');
    expect(host.active()).toBe('ibspace.json');

    press('ArrowUp');
    press('ArrowLeft');
    expect(host.active()).toBe('minotore.json');

    press('ArrowUp');
    expect(host.active()).toBe('inoteqia.json');
    expect(document.activeElement).toBe(tabs()[3]);

    press('ArrowDown');
    expect(host.active()).toBe('minotore.json');
  });

  it('jumps to the first and last tab with Home and End', () => {
    const { tabs, press, host } = render();
    tabs()[0].focus();
    press('End');
    expect(host.active()).toBe('inoteqia.json');
    expect(document.activeElement).toBe(tabs()[3]);
    press('Home');
    expect(host.active()).toBe('minotore.json');
    expect(document.activeElement).toBe(tabs()[0]);
  });

  it('ignores other keys', () => {
    const { tabs, press, host } = render();
    tabs()[0].focus();
    expect(press('a').defaultPrevented).toBe(false);
    expect(host.active()).toBe('minotore.json');
  });

  it('reflects a horizontal orientation', () => {
    const { fixture, el, host } = render();
    host.orientation.set('horizontal');
    fixture.detectChanges();
    expect(el.querySelector('[role="tablist"]')?.getAttribute('aria-orientation')).toBe(
      'horizontal',
    );
  });

  it('hides the decorative heading and icons from assistive technology', () => {
    const { el } = render();
    expect(el.querySelector('.explorer__heading')?.getAttribute('aria-hidden')).toBe('true');
    el.querySelectorAll('.explorer__icon').forEach((icon) =>
      expect(icon.getAttribute('aria-hidden')).toBe('true'),
    );
  });
});
