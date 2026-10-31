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
  theme: { toLight: 'Switch to light theme', toDark: 'Switch to dark theme' },
  backToTop: 'Back to top',
  skipLink: 'Skip to content',
  logo: {
    text: 'mdba',
    prompt: ':~$',
    srSuffix: 'Mohamed Dhia Ben Amar, home',
  },
  nav: {
    label: 'Main',
    sectionsLabel: 'Page sections',
    links: [
      { label: 'Home', fragment: 'home', icon: 'home' },
      { label: 'Work', fragment: 'work', icon: 'work' },
      { label: 'Experience', fragment: 'experience', icon: 'experience' },
      { label: 'Journey', fragment: 'journey', icon: 'journey' },
      { label: 'Contact', fragment: 'contact', icon: 'contact' },
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
