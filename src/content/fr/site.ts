import type { SiteContent } from '../types';

// French typography: \u00a0 is a no-break space (before : ; ! ? and %).
export const site: SiteContent = {
  locale: 'fr',
  seo: {
    siteName: 'Mohamed Dhia Ben Amar',
    person: {
      name: 'Mohamed Dhia Ben Amar',
      jobTitle: 'Ingénieur logiciel full-stack',
      email: 'contact@mohameddhia.dev',
      locality: 'Tunis',
      countryCode: 'TN',
      worksFor: 'Minotore',
      knowsAbout: [
        'Angular',
        'Nx',
        'TypeScript',
        'RxJS',
        'Node.js',
        'React',
        'React Native',
        'Golang',
        'Vitest',
        'Accessibility',
      ],
      sameAs: [
        'https://github.com/mohamed-dhia-ben-amar',
        'https://linkedin.com/in/mohameddhia-benamar',
      ],
    },
  },
  backToTop: 'Retour en haut de page',
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
