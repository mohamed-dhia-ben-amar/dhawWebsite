import { APP_BASE_HREF } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { SkipLink } from './skip-link';

@Component({
  imports: [SkipLink],
  template: `<app-skip-link label="Skip to content" />
    <main id="main" tabindex="-1">content</main>`,
})
class Host {}

describe('SkipLink', () => {
  function render(baseHref = '/') {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: APP_BASE_HREF, useValue: baseHref }],
    });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a link to #main on the current page', () => {
    const link = render().querySelector('a');
    expect(link?.textContent).toBe('Skip to content');
    expect(link?.getAttribute('href')).toBe('/#main');
  });

  it('includes the locale base href', () => {
    expect(render('/fr/').querySelector('a')?.getAttribute('href')).toBe('/fr/#main');
  });

  it('follows navigation to other pages', async () => {
    @Component({ template: '' })
    class Page {}
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'styleguide', component: Page }])],
    });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/styleguide');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('a')?.getAttribute('href')).toBe(
      '/styleguide#main',
    );
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
