import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { NotFound } from './not-found';

describe('NotFound', () => {
  function render() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('renders a terminal-styled "command not found" page', () => {
    const { el } = render();
    expect(el.querySelector('h1')?.textContent).toBe('Page not found');
    expect(el.querySelector('.missing__error')?.textContent).toContain('zsh: command not found');
  });

  it('links home and to the homepage sections', () => {
    const links = [...render().el.querySelectorAll('.missing__links a')];
    expect(links.map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
      ['cd ~', '/'],
      ['ls ~/featured-work', '/#work'],
      ['./contact.sh', '/#contact'],
    ]);
  });

  it('is noindex and has its own title', () => {
    render();
    expect(TestBed.inject(Title).getTitle()).toBe('Page not found · Mohamed Dhia Ben Amar');
    expect(TestBed.inject(Meta).getTag('name="robots"')?.content).toBe('noindex');
  });

  it('shows the requested path once rendered in the browser', async () => {
    window.history.pushState({}, '', '/en/does/not/exist');
    const { fixture, el } = render();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(el.querySelector('.missing__error')?.textContent).toContain('/does/not/exist');
    window.history.pushState({}, '', '/');
  });
});
