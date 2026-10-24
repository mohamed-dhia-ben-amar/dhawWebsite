import type { HomeContent } from '../types';

// All facts from docs/PORTFOLIO_BRIEF.md §6 and the approved docs/design-reference.html.
export const home: HomeContent = {
  meta: {
    title: 'Mohamed Dhia Ben Amar · Full-Stack Software Engineer',
    description:
      'Full-stack engineer in Tunis building Angular design systems and AI-assisted workflows. Open to EU remote and hybrid roles.',
  },
  hero: {
    availability: 'Open to EU remote/hybrid · Based in Tunis',
    headline: {
      before: 'Full-stack engineer building ',
      accent: 'design systems',
      after: ' and AI-assisted workflows.',
    },
    intro:
      "I'm Mohamed Dhia Ben Amar. I build Angular component libraries in Nx monorepos for market finance, lead AI-assisted development with Claude Code agents, and ship with React, Node.js and Golang.",
    cta: {
      contact: 'Get in touch',
      cv: {
        label: 'Download CV',
        files: [
          {
            short: 'EN',
            srLabel: 'Download CV in English, PDF:',
            href: '/cv/Mohamed_Dhia_Ben_Amar_CV_2026_EN.pdf',
            hreflang: 'en',
          },
          {
            short: 'FR',
            srLabel: 'Download CV in French, PDF:',
            href: '/cv/Mohamed_Dhia_Ben_Amar_CV_2026_FR.pdf',
            hreflang: 'fr',
          },
        ],
      },
      profiles: [
        { label: 'GitHub', href: 'https://github.com/mohamed-dhia-ben-amar' },
        { label: 'LinkedIn', href: 'https://linkedin.com/in/mohameddhia-benamar' },
      ],
    },
    terminal: {
      title: 'mohamed@tunis — zsh',
      label: 'Terminal summary',
      entries: [
        { command: 'whoami', output: 'Mohamed Dhia Ben Amar' },
        { command: 'cat role.txt', output: 'Full-Stack Software Engineer' },
        { command: 'echo $STACK', output: 'Angular · Nx · TypeScript · Node.js · React' },
        { command: 'status', output: 'available for new roles', status: true },
      ],
    },
  },
  highlights: {
    label: 'Highlights',
    stats: [
      { value: '76', caption: 'reusable widgets across 8 projects' },
      { value: '~9,000', caption: 'unit tests, 80–96% coverage' },
      { value: '4 days', caption: 'widget delivery, down from 1–2 weeks' },
      { value: '10k+', caption: 'downloads on the Converty Shop app' },
    ],
  },
  work: {
    prompt: 'ls ~/featured-work',
    title: 'Selected projects',
    caseStudyLabel: 'Read case study',
    projects: [
      {
        slug: 'widget-library',
        title: 'Shared widget library for market finance',
        summary:
          'Accessible, reactive widgets with RxJS and Signals, shared across 8 projects at Minotore, plus the Angular 18 → 21 / Nx 22 migration in one sprint.',
        file: 'widget-library/README.md',
        stack: 'Angular · Nx · Vitest',
        stats: [
          { label: 'widgets', value: '76' },
          { label: 'size_cut', value: '30–50%' },
        ],
      },
      {
        slug: 'nova',
        title: 'NOVA: AI-assisted development workflow',
        summary:
          'As technical lead, helped standardize a dev-workflow agent used by ~30 developers across 4 teams, and gave agents a headless browser to test widgets against real data.',
        file: 'nova/README.md',
        stack: 'Claude Code · Playwright',
        stats: [
          { label: 'delivery', value: '4 days' },
          { label: 'features_per_sprint', value: '+60%' },
        ],
      },
      {
        slug: 'converty-shop',
        title: 'Converty Shop merchant app',
        summary:
          'Co-built with one other developer: store management for merchants on iOS and Android, including upsell/cross-sell, statistics and profile features.',
        file: 'converty-shop/README.md',
        stack: 'React Native · Expo',
        stats: [
          { label: 'downloads', value: '10k+' },
          { label: 'rating', value: '4.4/5' },
        ],
      },
    ],
  },
  experience: {
    prompt: 'code experience.json',
    title: "Where I've worked",
    explorerLabel: 'Experience files',
    explorerHeading: 'Explorer',
    items: [
      {
        file: 'minotore.json',
        role: 'Frontend Developer',
        company: 'Minotore',
        industry: 'Market finance',
        location: 'Tunis (hybrid)',
        period: 'Dec 2024 – present',
        highlights: [
          '76 widgets shared across 8 projects',
          'Angular 18 → 21 / Nx 22 migration, 3 developers',
          'Tech lead, NOVA: AI-assisted dev workflow',
        ],
      },
      {
        file: 'converty.json',
        role: 'Full-Stack Engineer Intern',
        company: 'Converty',
        industry: 'E-commerce',
        location: 'Tunis (hybrid)',
        period: 'Feb – Aug 2024',
        highlights: [
          'Co-built the Converty Shop merchant app (React Native, Expo)',
          'Upsell/cross-sell automation: +15% average order value',
          'Dashboard load time −30%; Node.js and Golang services',
        ],
      },
      {
        file: 'ibspace.json',
        role: 'Software Engineer Intern',
        company: 'IBSpace',
        industry: 'E-solutions',
        location: 'Tunis (hybrid)',
        period: 'Jul – Sep 2023',
        highlights: [
          'Firestore schemas for 10,000+ concurrent users',
          'Real-time Angular dashboards, ~6 hours/week of reporting saved',
        ],
      },
      {
        file: 'inoteqia.json',
        role: 'Front-End Mobile Developer Intern',
        company: 'Inoteqia',
        industry: 'Deeptech',
        location: 'Tunis (hybrid)',
        period: 'Aug – Sep 2022',
        highlights: [
          'Flutter front end of a vehicle-trading DApp',
          'Solidity, ERC-20 and MetaMask, deployed to testnet',
        ],
      },
    ],
  },
  contact: {
    prompt: './contact.sh',
    title: "Let's build something.",
    windowTitle: '~/contact.sh',
    body: 'Open to full-stack and frontend roles in Tunisia and the EU, remote or hybrid.',
    email: 'mohameddhiabenamar@gmail.com',
  },
};
