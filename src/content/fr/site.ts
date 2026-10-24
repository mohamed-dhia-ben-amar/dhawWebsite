import type { SiteContent } from '../types';

// French typography: \u00a0 is a no-break space (before : ; ! ? and %).
export const site: SiteContent = {
  locale: 'fr',
  skipLink: 'Aller au contenu',
  logo: {
    text: 'mdba',
    prompt: ':~$',
    srSuffix: 'Mohamed Dhia Ben Amar, accueil',
  },
  nav: {
    label: 'Principale',
    links: [
      { label: './projets', fragment: 'work' },
      { label: './parcours', fragment: 'experience' },
      { label: './contact', fragment: 'contact' },
    ],
  },
  languages: {
    label: 'Langue',
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
