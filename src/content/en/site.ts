import type { SiteContent } from '../types';

export const site: SiteContent = {
  locale: 'en',
  seo: {
    siteName: 'Mohamed Dhia Ben Amar',
    person: {
      name: 'Mohamed Dhia Ben Amar',
      jobTitle: 'Full-Stack Software Engineer',
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
  backToTop: 'Back to top',
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
