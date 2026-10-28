import { TestBed } from '@angular/core/testing';
import { TECH_ICONS } from './tech-icons';
import { TechTags } from './tech-tags';

describe('TechTags', () => {
  function render(items: string[], label?: string, animate = false) {
    const fixture = TestBed.createComponent(TechTags);
    fixture.componentRef.setInput('items', items);
    if (label) fixture.componentRef.setInput('label', label);
    fixture.componentRef.setInput('animate', animate);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a labelled list with one tag per item', () => {
    const el = render(['Angular', 'Nx'], 'Main stack');
    expect(el.querySelector('ul')?.getAttribute('aria-label')).toBe('Main stack');
    expect([...el.querySelectorAll('li')].map((li) => li.textContent?.trim())).toEqual([
      'Angular',
      'Nx',
    ]);
  });

  it('draws a decorative logo when there is one, and the › mark otherwise', () => {
    const [angular, signals] = render(['Angular', 'Signals']).querySelectorAll('li');
    expect(angular.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    expect(angular.querySelector('path')?.getAttribute('d')).toBe(TECH_ICONS['Angular']);
    expect(signals.querySelector('svg')).toBeNull();
    expect(signals.querySelector('.tag__mark')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('has a logo for every technology the site lists', () => {
    for (const name of [
      'Angular',
      'Nx',
      'TypeScript',
      'RxJS',
      'Node.js',
      'React',
      'Golang',
      'Claude Code',
    ]) {
      expect(TECH_ICONS[name], name).toBeTruthy();
    }
  });

  it('staggers the tags when animated', () => {
    const fixture = TestBed.createComponent(TechTags);
    fixture.componentRef.setInput('items', ['Angular', 'Nx']);
    fixture.componentRef.setInput('animate', true);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.classList).toContain('tags--animate');
    expect(host.querySelectorAll('li')[1].style.getPropertyValue('--i')).toBe('1');
  });
});
