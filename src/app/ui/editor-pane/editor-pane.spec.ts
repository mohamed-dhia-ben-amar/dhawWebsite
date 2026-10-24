import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EditorPane, EditorTab } from './editor-pane';

@Component({
  imports: [EditorPane],
  template: `<app-editor-pane [tabs]="tabs">
    @if (withExplorer) {
      <nav paneExplorer aria-label="Files">explorer</nav>
    }
    <p class="projected">body</p>
  </app-editor-pane>`,
})
class Host {
  tabs: EditorTab[] = [
    { label: 'widget-library/README.md', active: true },
    { label: 'Angular · Nx · Vitest' },
  ];
  withExplorer = false;
}

describe('EditorPane', () => {
  function render(changes: Partial<Host> = {}) {
    const fixture = TestBed.createComponent(Host);
    Object.assign(fixture.componentInstance, changes);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders one tab per entry and marks only the active one', () => {
    const tabs = render().querySelectorAll('.pane__tab');
    expect([...tabs].map((t) => t.textContent)).toEqual([
      'widget-library/README.md',
      'Angular · Nx · Vitest',
    ]);
    expect(tabs[0].classList).toContain('pane__tab--active');
    expect(tabs[1].classList).not.toContain('pane__tab--active');
  });

  it('omits the tab bar when there are no tabs', () => {
    expect(render({ tabs: [] }).querySelector('.pane__tabs')).toBeNull();
  });

  it('projects the body, and the explorer only when provided', () => {
    const plain = render();
    expect(plain.querySelector('.pane__body .projected')?.textContent).toBe('body');
    expect(plain.querySelector('.pane__explorer')?.children).toHaveLength(0);

    const withExplorer = render({ withExplorer: true });
    expect(withExplorer.querySelector('.pane__explorer [paneExplorer]')?.textContent).toBe(
      'explorer',
    );
  });
});
