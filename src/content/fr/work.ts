import type { WorkContent } from '../types';

// Written in French, not translated word for word; to be reviewed by the owner.
// \u00a0 = no-break space (before : ; ! ? %), \u202f = narrow no-break space (thousands).
export const work: WorkContent = {
  ui: {
    sections: {
      context: 'Contexte',
      problem: 'Problème',
      approach: 'Ce que j’ai fait',
      stack: 'Stack',
      results: 'Résultats',
      next: 'Et ensuite',
    },
    facts: {
      label: 'Fiche projet',
      role: 'poste',
      company: 'entreprise',
      period: 'période',
      location: 'lieu',
    },
    ownerLabel: 'OWNER',
    linksLabel: 'Télécharger l’app',
    navLabel: 'Autres projets',
    back: 'Retour aux projets sélectionnés',
    nextStudy: 'Étude de cas suivante',
  },
  caseStudies: [
    {
      slug: 'widget-library',
      meta: {
        title: 'Bibliothèque de widgets pour la finance de marché · Mohamed Dhia Ben Amar',
        description:
          'Étude de cas\u00a0: 76 widgets Angular accessibles partagés entre 8 projets de finance de marché, une migration Angular 18 → 21 / Nx 22 en un sprint et ~9\u202f000 tests Vitest.',
      },
      file: 'widget-library/README.md',
      title: 'Bibliothèque de widgets pour la finance de marché',
      summary:
        'Des widgets accessibles et réactifs, en RxJS et Signals, partagés entre 8 projets chez Minotore, et la migration Angular 18 → 21 / Nx 22 menée en un seul sprint.',
      facts: {
        role: 'Développeur frontend',
        company: 'Minotore',
        period: 'déc. 2024 – aujourd’hui',
        location: 'Tunis (hybride)',
      },
      stack: ['Angular', 'Nx', 'RxJS', 'Signals', 'Vitest', 'Storybook', 'Keycloak'],
      context: [
        'Minotore conçoit des logiciels pour la finance de marché. Je fais partie de l’équipe frontend, où une bibliothèque de widgets partagée alimente 8 projets depuis un monorepo Nx.',
      ],
      problem: [],
      approach: [
        'Développé 76 widgets réutilisables et accessibles, en RxJS et Signals, partagés entre les 8 projets.',
        'Réduit la taille des widgets de 30 à 50\u00a0%.',
        'Supervisé la migration de 68 widgets et 8 bibliothèques d’Angular 18 vers Angular 21 / Nx 22 en un sprint de 3 semaines, à la tête de 3 développeurs, et contribué à la migration vers Angular 22 / Nx 23.',
        'Introduit Vitest\u00a0: environ 9\u202f000 tests, avec 80 à 96\u00a0% de couverture.',
        'Créé une bibliothèque de skeletons sous Storybook et les écrans d’authentification Keycloak.',
        'Accompagné 2 nouveaux membres de l’équipe et 1 stagiaire.',
      ],
      diagram: {
        caption: 'Comment les widgets partagés arrivent dans les produits',
        steps: [
          { label: 'Monorepo Nx', detail: '8 bibliothèques' },
          { label: 'Bibliothèque de widgets', detail: '76 widgets accessibles' },
          { label: 'Tests', detail: 'Vitest · ~9\u202f000' },
          { label: 'Produits', detail: '8 projets' },
        ],
      },
      results: {
        metrics: [
          { label: 'widgets', value: '76' },
          { label: 'size_cut', value: '30–50\u00a0%' },
          { label: 'tests', value: '~9\u202f000' },
          { label: 'coverage', value: '80–96\u00a0%' },
        ],
        notes: ['Migration Angular 18 → 21 / Nx 22 livrée en un seul sprint de 3 semaines.'],
      },
      next: [],
    },
    {
      slug: 'nova',
      meta: {
        title: 'NOVA\u00a0: workflow de développement assisté par l’IA · Mohamed Dhia Ben Amar',
        description:
          'Étude de cas\u00a0: en tant que lead technique, standardiser un agent de workflow Claude Code pour ~30 développeurs, avec un navigateur headless pour tester les widgets sur des données réelles.',
      },
      file: 'nova/README.md',
      title: 'NOVA\u00a0: workflow de développement assisté par l’IA',
      summary:
        'En tant que lead technique, j’ai contribué à standardiser un agent de workflow de développement utilisé par ~30 développeurs dans 4 équipes, et donné aux agents un navigateur headless pour tester les widgets sur des données réelles.',
      facts: {
        role: 'Lead technique',
        company: 'Minotore',
        location: 'Tunis (hybride)',
      },
      stack: ['Claude Code', 'Playwright'],
      context: [
        'NOVA est un workflow de développement assisté par l’IA, utilisé par environ 30 développeurs dans 4 équipes. J’en suis le lead technique.',
      ],
      problem: ['Livrer un widget prenait 1 à 2 semaines.'],
      approach: [
        'Contribué à standardiser un agent de workflow de développement fondé sur des agents Claude Code, partagé par les 4 équipes.',
        'Donné aux agents un navigateur headless (Playwright) pour tester les widgets sur des données réelles.',
      ],
      diagram: {
        caption: 'La boucle NOVA',
        steps: [
          { label: 'Développeurs', detail: '~30 dans 4 équipes' },
          { label: 'Agent Claude Code', detail: 'workflow standardisé' },
          { label: 'Navigateur headless', detail: 'Playwright' },
          { label: 'Widget', detail: 'testé sur des données réelles' },
        ],
      },
      results: {
        metrics: [
          { label: 'delivery', value: '4 jours' },
          { label: 'before', value: '1–2 semaines' },
          { label: 'features_per_sprint', value: '+60\u00a0%' },
          { label: 'developers', value: '~30' },
        ],
        notes: [],
      },
      next: [],
    },
    {
      slug: 'converty-shop',
      meta: {
        title: 'Application marchande Converty Shop · Mohamed Dhia Ben Amar',
        description:
          'Étude de cas\u00a0: co-développer l’app marchande Converty Shop en React Native et Expo, avec l’automatisation upsell/cross-sell (+15\u00a0% de panier moyen) et des services Node.js et Golang.',
      },
      file: 'converty-shop/README.md',
      title: 'Application marchande Converty Shop',
      summary:
        'Co-développée avec un autre développeur\u00a0: la gestion de boutique pour les marchands sur iOS et Android, avec l’upsell/cross-sell, les statistiques et le profil.',
      facts: {
        role: 'Ingénieur full-stack (stage)',
        company: 'Converty',
        period: 'févr. – août 2024',
        location: 'Tunis (hybride)',
      },
      stack: ['React Native', 'Expo', 'Redux', 'Zustand', 'Node.js', 'Express', 'Golang'],
      context: [
        'Converty est une plateforme e-commerce. Converty Shop est son application marchande pour iOS et Android, que j’ai co-développée avec un autre développeur, en lien étroit avec le design et le produit.',
      ],
      problem: [],
      approach: [
        'Co-développé l’app en React Native et Expo, avec Redux et Zustand pour l’état.',
        'Développé les écrans de statistiques et de profil.',
        'Mis en place l’automatisation upsell/cross-sell sur le web et le mobile.',
        'Réduit le temps de chargement du dashboard de 30\u00a0%.',
        'Développé des API REST en Node.js/Express et un microservice Golang de traitement des commandes.',
      ],
      diagram: {
        caption: 'Converty Shop, de l’app aux commandes',
        steps: [
          { label: 'App marchande', detail: 'React Native · Expo' },
          { label: 'API REST', detail: 'Node.js · Express' },
          { label: 'Traitement des commandes', detail: 'microservice Golang' },
        ],
      },
      results: {
        metrics: [
          { label: 'average_order_value', value: '+15\u00a0%' },
          { label: 'dashboard_load', value: '−30\u00a0%' },
        ],
        notes: [
          'Aujourd’hui, l’app compte plus de 10k téléchargements et une note de 4,4/5. Ce sont les chiffres actuels de l’app, pas les résultats de mon seul stage.',
        ],
      },
      next: [],
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
