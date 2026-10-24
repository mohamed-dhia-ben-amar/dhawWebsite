import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { AlternateLinks, localizedUrl } from './alternate-links';

describe('localizedUrl', () => {
  it('prefixes the locale and drops query and fragment', () => {
    expect(localizedUrl('fr', '/')).toBe('https://mohameddhia.dev/fr/');
    expect(localizedUrl('en', '/work/nova?x=1#top')).toBe('https://mohameddhia.dev/en/work/nova');
  });
});

describe('AlternateLinks', () => {
  function hreflangs() {
    return [...TestBed.inject(DOCUMENT).head.querySelectorAll('link[rel="alternate"]')].map((l) => [
      l.getAttribute('hreflang'),
      l.getAttribute('href'),
    ]);
  }

  it('writes one alternate per locale plus x-default for the given page', () => {
    TestBed.inject(AlternateLinks).update('/styleguide');
    expect(hreflangs()).toEqual([
      ['en', 'https://mohameddhia.dev/en/styleguide'],
      ['fr', 'https://mohameddhia.dev/fr/styleguide'],
      ['x-default', 'https://mohameddhia.dev/en/styleguide'],
    ]);
  });

  it('replaces the previous tags on navigation', () => {
    const links = TestBed.inject(AlternateLinks);
    links.update('/styleguide');
    links.update('/');
    expect(hreflangs()).toHaveLength(3);
    expect(hreflangs()[0][1]).toBe('https://mohameddhia.dev/en/');
  });
});
