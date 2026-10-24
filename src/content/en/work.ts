import type { WorkContent } from '../types';

// Facts only from docs/PORTFOLIO_BRIEF.md §6 and the approved design. Anything missing is an
// owner placeholder. Confidential: no Minotore code, screenshots, client names or internal URLs.
export const work: WorkContent = {
  ui: {
    sections: {
      context: 'Context',
      problem: 'Problem',
      approach: 'What I did',
      stack: 'Stack',
      results: 'Results',
      next: 'What I’d do next',
    },
    facts: {
      label: 'Project facts',
      role: 'role',
      company: 'company',
      period: 'period',
      location: 'location',
    },
    ownerLabel: 'OWNER',
    linksLabel: 'Get the app',
    navLabel: 'More work',
    back: 'Back to selected projects',
    nextStudy: 'Next case study',
  },
  caseStudies: [
    {
      slug: 'widget-library',
      meta: {
        title: 'Shared widget library for market finance · Mohamed Dhia Ben Amar',
        description:
          'Case study: 76 accessible Angular widgets shared across 8 market-finance projects, an Angular 18 → 21 / Nx 22 migration in one sprint, and ~9,000 Vitest tests.',
      },
      file: 'widget-library/README.md',
      title: 'Shared widget library for market finance',
      summary:
        'Accessible, reactive widgets with RxJS and Signals, shared across 8 projects at Minotore, plus the Angular 18 → 21 / Nx 22 migration in one sprint.',
      facts: {
        role: 'Frontend Developer',
        company: 'Minotore',
        period: 'Dec 2024 – present',
        location: 'Tunis (hybrid)',
      },
      stack: ['Angular', 'Nx', 'RxJS', 'Signals', 'Vitest', 'Storybook', 'Keycloak'],
      context: [
        'Minotore builds software for market finance. I work on the frontend team, where a shared library of widgets serves 8 projects from an Nx monorepo.',
      ],
      problem: [
        {
          owner:
            'describe the situation before the shared library (for example duplicated widgets, inconsistent behaviour or heavy bundles), without client names',
        },
      ],
      approach: [
        'Built 76 reusable, accessible widgets with RxJS and Signals, shared across the 8 projects.',
        'Cut widget size by 30–50%.',
        'Supervised the migration of 68 widgets and 8 libraries from Angular 18 to Angular 21 / Nx 22 in one 3-week sprint, leading 3 developers, and contributed to the Angular 22 / Nx 23 migration.',
        'Introduced Vitest: about 9,000 tests with 80–96% coverage.',
        'Built a Storybook skeleton library and the Keycloak authentication screens.',
        'Mentored 2 new team members and 1 intern.',
      ],
      diagram: {
        caption: 'How the shared widgets reach the products',
        steps: [
          { label: 'Nx monorepo', detail: '8 libraries' },
          { label: 'Widget library', detail: '76 accessible widgets' },
          { label: 'Tests', detail: 'Vitest · ~9,000' },
          { label: 'Products', detail: '8 projects' },
        ],
      },
      results: {
        metrics: [
          { label: 'widgets', value: '76' },
          { label: 'size_cut', value: '30–50%' },
          { label: 'tests', value: '~9,000' },
          { label: 'coverage', value: '80–96%' },
        ],
        notes: ['Angular 18 → 21 / Nx 22 migration delivered in a single 3-week sprint.'],
      },
      next: [{ owner: 'what you would improve or do next on the library' }],
    },
    {
      slug: 'nova',
      meta: {
        title: 'NOVA: AI-assisted development workflow · Mohamed Dhia Ben Amar',
        description:
          'Case study: as technical lead, standardizing a Claude Code dev-workflow agent for ~30 developers, with a headless browser to test widgets against real data.',
      },
      file: 'nova/README.md',
      title: 'NOVA: AI-assisted development workflow',
      summary:
        'As technical lead, helped standardize a dev-workflow agent used by ~30 developers across 4 teams, and gave agents a headless browser to test widgets against real data.',
      facts: {
        role: 'Technical Lead',
        company: 'Minotore',
        period: { owner: 'add when you started leading NOVA' },
        location: 'Tunis (hybrid)',
      },
      stack: ['Claude Code', 'Playwright'],
      context: [
        'NOVA is an AI-assisted development workflow used by about 30 developers across 4 teams. I am its technical lead.',
      ],
      problem: [
        'Delivering a widget took 1 to 2 weeks.',
        { owner: 'add what slowed delivery down, in general terms' },
      ],
      approach: [
        'Helped standardize a dev-workflow agent built on Claude Code agents, shared by the 4 teams.',
        'Gave the agents a headless browser (Playwright) so they could test widgets against real data.',
      ],
      diagram: {
        caption: 'The NOVA loop',
        steps: [
          { label: 'Developers', detail: '~30 across 4 teams' },
          { label: 'Claude Code agent', detail: 'standardized workflow' },
          { label: 'Headless browser', detail: 'Playwright' },
          { label: 'Widget', detail: 'tested against real data' },
        ],
      },
      results: {
        metrics: [
          { label: 'delivery', value: '4 days' },
          { label: 'before', value: '1–2 weeks' },
          { label: 'features_per_sprint', value: '+60%' },
          { label: 'developers', value: '~30' },
        ],
        notes: [],
      },
      next: [{ owner: 'what you would do next with NOVA' }],
    },
    {
      slug: 'converty-shop',
      meta: {
        title: 'Converty Shop merchant app · Mohamed Dhia Ben Amar',
        description:
          'Case study: co-building the Converty Shop merchant app in React Native and Expo, with upsell/cross-sell automation (+15% average order value) and Node.js and Golang services.',
      },
      file: 'converty-shop/README.md',
      title: 'Converty Shop merchant app',
      summary:
        'Co-built with one other developer: store management for merchants on iOS and Android, including upsell/cross-sell, statistics and profile features.',
      facts: {
        role: 'Full-Stack Engineer Intern',
        company: 'Converty',
        period: 'Feb – Aug 2024',
        location: 'Tunis (hybrid)',
      },
      stack: ['React Native', 'Expo', 'Redux', 'Zustand', 'Node.js', 'Express', 'Golang'],
      context: [
        'Converty is an e-commerce platform. Converty Shop is its merchant app for iOS and Android, which I co-developed with one other developer, working with a designer and a product manager.',
      ],
      problem: [{ owner: 'describe what merchants needed that the app solved' }],
      approach: [
        'Co-developed the app in React Native and Expo, with Redux and Zustand for state.',
        'Built the statistics and profile screens.',
        'Built upsell/cross-sell automation on web and mobile.',
        'Cut dashboard load time by 30%.',
        'Built REST APIs in Node.js/Express and a Golang order-processing microservice.',
      ],
      diagram: {
        caption: 'Converty Shop, from the app to the orders',
        steps: [
          { label: 'Merchant app', detail: 'React Native · Expo' },
          { label: 'REST APIs', detail: 'Node.js · Express' },
          { label: 'Order processing', detail: 'Golang microservice' },
        ],
      },
      results: {
        metrics: [
          { label: 'average_order_value', value: '+15%' },
          { label: 'dashboard_load', value: '−30%' },
        ],
        notes: [
          'Today the app has 10k+ downloads and a 4.4/5 rating. These are the app’s current figures, not results of my internship alone.',
        ],
      },
      next: [{ owner: 'what you would do next on the app' }],
      links: [
        { label: 'App Store', href: 'https://apps.apple.com/dz/app/converty-shop/id6466304252' },
        {
          label: 'Google Play',
          href: 'https://play.google.com/store/apps/details?id=com.converty.app',
        },
      ],
    },
  ],
};
