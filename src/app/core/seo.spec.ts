import { DOCUMENT } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { Seo, ogImageUrl } from './seo';

describe('Seo', () => {
  function setup(localeId = 'en-US') {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: localeId }] });
    return {
      seo: TestBed.inject(Seo),
      meta: TestBed.inject(Meta),
      head: TestBed.inject(DOCUMENT).head,
      prop: (name: string) => TestBed.inject(Meta).getTag(`property="${name}"`)?.content,
      name: (name: string) => TestBed.inject(Meta).getTag(`name="${name}"`)?.content,
    };
  }

  afterEach(() => TestBed.inject(DOCUMENT).head.querySelector('link[rel="canonical"]')?.remove());

  it('builds absolute share image URLs per locale', () => {
    expect(ogImageUrl('fr', 'nova')).toBe('https://dhaw-website.vercel.app/fr/og/nova.png');
  });

  it('sets title, description, canonical, Open Graph and Twitter tags', () => {
    const { seo, head, prop, name } = setup();
    seo.setPage({
      title: 'T',
      description: 'D',
      path: '/work/nova',
      image: 'nova',
      type: 'article',
    });

    expect(TestBed.inject(Title).getTitle()).toBe('T');
    expect(name('description')).toBe('D');
    expect(name('robots')).toBeUndefined();
    expect(head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://dhaw-website.vercel.app/en/work/nova',
    );
    expect(prop('og:type')).toBe('article');
    expect(prop('og:site_name')).toBe('Mohamed Dhia Ben Amar');
    expect(prop('og:title')).toBe('T');
    expect(prop('og:description')).toBe('D');
    expect(prop('og:url')).toBe('https://dhaw-website.vercel.app/en/work/nova');
    expect(prop('og:locale')).toBe('en_US');
    expect(prop('og:locale:alternate')).toBe('fr_FR');
    expect(prop('og:image')).toBe('https://dhaw-website.vercel.app/en/og/nova.png');
    expect(prop('og:image:width')).toBe('1200');
    expect(prop('og:image:height')).toBe('630');
    expect(name('twitter:card')).toBe('summary_large_image');
    expect(name('twitter:image')).toBe('https://dhaw-website.vercel.app/en/og/nova.png');
  });

  it('defaults to the homepage image and website type, in French for the fr build', () => {
    const { seo, prop } = setup('fr');
    seo.setPage({ title: 'T', description: 'D', path: '/' });
    expect(prop('og:image')).toBe('https://dhaw-website.vercel.app/fr/og/home.png');
    expect(prop('og:type')).toBe('website');
    expect(prop('og:locale')).toBe('fr_FR');
    expect(prop('og:locale:alternate')).toBe('en_US');
  });

  it('drops the canonical URL and sets robots for noindex pages, and resets them after', () => {
    const { seo, head, name } = setup();
    seo.setPage({ title: 'A', description: 'a', path: '/' });
    seo.setPage({ title: 'B', description: 'b', path: '/404', robots: 'noindex' });
    expect(name('robots')).toBe('noindex');
    expect(head.querySelector('link[rel="canonical"]')).toBeNull();

    seo.setPage({ title: 'C', description: 'c', path: '/' });
    expect(name('robots')).toBeUndefined();
    expect(head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  });
});
