import type { SiteContent } from '../types';

export const site: SiteContent = {
  locale: 'en',
  skipLink: 'Skip to content',
  logo: {
    text: 'mdba',
    prompt: ':~$',
    srSuffix: 'Mohamed Dhia Ben Amar, home',
  },
  nav: {
    label: 'Main',
    links: [
      { label: './work', fragment: 'work' },
      { label: './experience', fragment: 'experience' },
      { label: './contact', fragment: 'contact' },
    ],
  },
  languages: {
    label: 'Language',
    options: [
      { locale: 'en', short: 'EN', name: 'English' },
      { locale: 'fr', short: 'FR', name: 'Français' },
    ],
  },
  footer: {
    status: 'main ✓ · Angular SSR · Vercel',
    copyright: '© 2026 Mohamed Dhia Ben Amar',
  },
};
