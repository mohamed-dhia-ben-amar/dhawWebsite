import type { HomeContent } from '../types';

// Written in French, not translated word for word; to be reviewed by the owner.
// Typography: \u00a0 = no-break space (before : ; ! ? %), \u202f = narrow no-break space
// (thousands separator). Commands, file names and JSON keys stay as code.
export const home: HomeContent = {
  meta: {
    title: 'Mohamed Dhia Ben Amar · Ingénieur logiciel full-stack',
    description:
      'Ingénieur full-stack basé à Tunis\u00a0: design systems Angular et workflows de développement assistés par l’IA. Ouvert aux postes en remote ou en hybride en Europe.',
  },
  hero: {
    availability: 'Remote ou hybride en Europe · Basé à Tunis',
    headline: {
      before: 'Ingénieur full-stack, je construis des ',
      accent: 'design systems',
      after: ' et des workflows assistés par l’IA.',
    },
    intro:
      'Je suis Mohamed Dhia Ben Amar. Je développe des bibliothèques de composants Angular dans des monorepos Nx pour la finance de marché, je pilote le développement assisté par l’IA avec des agents Claude Code, et je livre aussi en React, Node.js et Golang.',
    cta: {
      contact: 'Me contacter',
      cv: {
        label: 'Télécharger le CV',
        files: [
          {
            short: 'EN',
            srLabel: 'Télécharger le CV en anglais, PDF\u00a0:',
            href: '/cv/Mohamed_Dhia_Ben_Amar_CV_2026_EN.pdf',
            hreflang: 'en',
          },
          {
            short: 'FR',
            srLabel: 'Télécharger le CV en français, PDF\u00a0:',
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
      label: 'Résumé dans le terminal',
      entries: [
        { command: 'whoami', output: 'Mohamed Dhia Ben Amar' },
        { command: 'cat role.txt', output: 'Ingénieur logiciel full-stack' },
        { command: 'echo $STACK', output: 'Angular · Nx · TypeScript · Node.js · React' },
        { command: 'status', output: 'disponible pour un nouveau poste', status: true },
      ],
    },
  },
  highlights: {
    label: 'Chiffres clés',
    stats: [
      { value: '76', caption: 'widgets réutilisables sur 8 projets' },
      { value: '~9\u202f000', caption: 'tests unitaires, 80–96\u00a0% de couverture' },
      { value: '4 jours', caption: 'pour livrer un widget, contre 1 à 2 semaines' },
      { value: '10k+', caption: 'téléchargements de l’app Converty Shop' },
    ],
  },
  work: {
    prompt: 'ls ~/featured-work',
    title: 'Projets sélectionnés',
    caseStudyLabel: 'Lire l’étude de cas',
    projects: [
      {
        slug: 'widget-library',
        title: 'Bibliothèque de widgets pour la finance de marché',
        summary:
          'Des widgets accessibles et réactifs, en RxJS et Signals, partagés entre 8 projets chez Minotore, et la migration Angular 18 → 21 / Nx 22 menée en un seul sprint.',
        file: 'widget-library/README.md',
        stack: 'Angular · Nx · Vitest',
        stats: [
          { label: 'widgets', value: '76' },
          { label: 'size_cut', value: '30–50\u00a0%' },
        ],
      },
      {
        slug: 'nova',
        title: 'NOVA\u00a0: workflow de développement assisté par l’IA',
        summary:
          'En tant que lead technique, j’ai contribué à standardiser un agent de workflow de développement utilisé par ~30 développeurs dans 4 équipes, et donné aux agents un navigateur headless pour tester les widgets sur des données réelles.',
        file: 'nova/README.md',
        stack: 'Claude Code · Playwright',
        stats: [
          { label: 'delivery', value: '4 jours' },
          { label: 'features_per_sprint', value: '+60\u00a0%' },
        ],
      },
      {
        slug: 'converty-shop',
        title: 'Application marchande Converty Shop',
        summary:
          'Co-développée avec un autre développeur\u00a0: la gestion de boutique pour les marchands sur iOS et Android, avec l’upsell/cross-sell, les statistiques et le profil.',
        file: 'converty-shop/README.md',
        stack: 'React Native · Expo',
        stats: [
          { label: 'downloads', value: '10k+' },
          { label: 'rating', value: '4,4/5' },
        ],
      },
    ],
  },
  experience: {
    prompt: 'code experience.json',
    title: 'Mon parcours',
    explorerLabel: 'Fichiers d’expérience',
    explorerHeading: 'Explorateur',
    items: [
      {
        file: 'minotore.json',
        role: 'Développeur frontend',
        company: 'Minotore',
        industry: 'Finance de marché',
        location: 'Tunis (hybride)',
        period: 'déc. 2024 – aujourd’hui',
        highlights: [
          '76 widgets partagés entre 8 projets',
          'Migration Angular 18 → 21 / Nx 22 avec 3 développeurs',
          'Lead technique de NOVA, workflow de dev assisté par l’IA',
        ],
      },
      {
        file: 'converty.json',
        role: 'Ingénieur full-stack (stage)',
        company: 'Converty',
        industry: 'E-commerce',
        location: 'Tunis (hybride)',
        period: 'févr. – août 2024',
        highlights: [
          'Co-développement de l’app marchande Converty Shop (React Native, Expo)',
          'Automatisation upsell/cross-sell\u00a0: +15\u00a0% de panier moyen',
          'Chargement du dashboard −30\u00a0%\u00a0; services Node.js et Golang',
        ],
      },
      {
        file: 'ibspace.json',
        role: 'Ingénieur logiciel (stage)',
        company: 'IBSpace',
        industry: 'Solutions numériques',
        location: 'Tunis (hybride)',
        period: 'juil. – sept. 2023',
        highlights: [
          'Schémas Firestore pour plus de 10\u202f000 utilisateurs simultanés',
          'Dashboards Angular en temps réel, ~6\u00a0h de reporting gagnées par semaine',
        ],
      },
      {
        file: 'inoteqia.json',
        role: 'Développeur mobile front-end (stage)',
        company: 'Inoteqia',
        industry: 'Deeptech',
        location: 'Tunis (hybride)',
        period: 'août – sept. 2022',
        highlights: [
          'Front end Flutter d’une DApp d’échange de véhicules',
          'Solidity, ERC-20 et MetaMask, déployée sur testnet',
        ],
      },
    ],
  },
  contact: {
    prompt: './contact.sh',
    title: 'Construisons quelque chose.',
    windowTitle: '~/contact.sh',
    body: 'Ouvert aux postes full-stack et frontend en Tunisie et en Europe, en remote ou en hybride.',
    email: 'mohameddhiabenamar@gmail.com',
  },
};
