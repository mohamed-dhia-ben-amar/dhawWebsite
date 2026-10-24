import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HOME_CONTENT } from './home-content';
import { APP_LOCALE } from './locale';
import { SITE_CONTENT } from './site-content';

describe('locale-aware content', () => {
  function setup(localeId: string) {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: localeId }] });
  }

  it('defaults to English', () => {
    setup('en-US');
    expect(TestBed.inject(APP_LOCALE)).toBe('en');
    expect(TestBed.inject(SITE_CONTENT).locale).toBe('en');
    expect(TestBed.inject(HOME_CONTENT).work.title).toBe('Selected projects');
  });

  it('serves the French content in the fr build', () => {
    setup('fr');
    expect(TestBed.inject(APP_LOCALE)).toBe('fr');
    expect(TestBed.inject(SITE_CONTENT).locale).toBe('fr');
    expect(TestBed.inject(HOME_CONTENT).work.title).toBe('Projets sélectionnés');
  });
});
