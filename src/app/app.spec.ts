import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter(routes)] }));

  function render() {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('creates the root component', () => {
    expect(TestBed.createComponent(App).componentInstance).toBeTruthy();
  });

  it('renders the shell in order: skip link, header, main, footer', () => {
    const el = render();
    const order = [...el.children].map((child) => child.tagName.toLowerCase());
    expect(order).toEqual([
      'app-skip-link',
      'app-site-header',
      'main',
      'app-site-footer',
      'app-back-to-top',
    ]);
  });

  it('makes main the focusable skip-link target around the router outlet', () => {
    const main = render().querySelector('main');
    expect(main?.id).toBe('main');
    expect(main?.getAttribute('tabindex')).toBe('-1');
    expect(main?.querySelector('router-outlet')).not.toBeNull();
  });
});
