import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkipLink } from './skip-link';

@Component({
  imports: [SkipLink],
  template: `<app-skip-link label="Skip to content" />
    <main id="main" tabindex="-1">content</main>`,
})
class Host {}

describe('SkipLink', () => {
  function render() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a link to #main on the current page', () => {
    const link = render().querySelector('a');
    expect(link?.textContent).toBe('Skip to content');
    expect(link?.getAttribute('href')).toBe('/#main');
  });

  it('moves focus to the target on click instead of navigating', () => {
    const el = render();
    const main = el.querySelector<HTMLElement>('#main');
    if (main) main.scrollIntoView = () => undefined; // not implemented in jsdom

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    el.querySelector('a')?.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(main);
  });
});
