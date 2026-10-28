import type { HomeContent } from '../types';

// Written in French, not translated word for word; to be reviewed by the owner.
// Typography: \u00a0 = no-break space (before : ; ! ? %), \u202f = narrow no-break space
// (thousands separator). Commands, file names and JSON keys stay as code.
export const home: HomeContent = {
  meta: {
    title: 'Mohamed Dhia Ben Amar · Ingénieur logiciel full-stack',
    description:
      'Ingénieur full-stack basé à Tunis\u00a0: bibliothèques de widgets Angular configurables et workflows de développement assistés par IA. Ouvert aux postes en remote ou en hybride en Europe.',
  },
  hero: {
    availability: 'Remote ou hybride en Europe · Basé à Tunis',
    headline: {
      before: 'Ingénieur full-stack\u00a0: bibliothèques de ',
      accent: 'widgets configurables',
      after: ' et workflows assistés par IA.',
    },
    intro:
      'Je suis Mohamed Dhia Ben Amar. Je développe des widgets Angular configurables qui alimentent le page builder d’un CMS, je pilote le développement assisté par IA avec des agents Claude Code, et je livre aussi avec React, Node.js et Golang.',
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
    stack: {
      label: 'Stack principale',
      items: ['Angular', 'Nx', 'TypeScript', 'RxJS', 'Node.js', 'React', 'Golang', 'Claude Code'],
    },
  },
  highlights: {
    label: 'Chiffres clés',
    stats: [
      {
        value: '21',
        caption: 'widgets dont je suis l’auteur, sur 81 dans la bibliothèque de l’équipe',
      },
      {
        value: '~9\u202f000',
        caption: 'tests unitaires depuis l’adoption de Vitest que j’ai pilotée',
      },
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
        title: 'Bibliothèque de widgets configurables pour le page builder d’un CMS',
        summary:
          'J’ai développé 21 des 81 widgets Angular accessibles (produit, contenu, document, recherche) de la bibliothèque de l’équipe. Les webmasters les configurent via des formulaires générés depuis un schéma JSON et les ajoutent à leurs sites. J’ai aussi supervisé la migration Angular 18 → 21 / Nx 22 en un sprint.',
        file: 'widget-library/README.md',
        stack: 'Angular · Nx · Vitest',
        stats: [
          { label: 'my_widgets', value: '21' },
          { label: 'team_widgets', value: '81' },
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
    title: 'Où j’ai travaillé',
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
          'Auteur de 21 des 81 widgets de l’équipe, utilisés sur 8 projets',
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
  journey: {
    prompt: 'git log --oneline ~/journey',
    title: 'Mon parcours jusqu’ici',
    kinds: { work: 'emploi', education: 'formation', community: 'communauté' },
    entries: [
      {
        kind: 'work',
        period: 'déc. 2024 – aujourd’hui',
        title: 'Développeur frontend',
        org: 'Minotore',
        note: 'Widgets Angular configurables pour le page builder d’un CMS\u00a0; lead technique de NOVA.',
      },
      {
        kind: 'work',
        period: 'févr. – août 2024',
        title: 'Ingénieur full-stack (stage)',
        org: 'Converty',
        note: 'Co-développement de l’app marchande Converty Shop (React Native, Expo).',
      },
      {
        kind: 'work',
        period: 'juil. – sept. 2023',
        title: 'Ingénieur logiciel (stage)',
        org: 'IBSpace',
        note: 'Dashboards Angular d’administration et d’analyse en temps réel sur Firestore.',
      },
      {
        kind: 'community',
        period: 'sept. 2022 – déc. 2024',
        title: 'Responsable de département, puis mentor',
        org: 'Google Developer Student Clubs (GDSC), ESPRIT',
        note: 'Responsable du département Blockchain, puis du département Développement\u00a0; ateliers et hackathon organisés avec GDSC Budapest.',
      },
      {
        kind: 'work',
        period: 'août – sept. 2022',
        title: 'Développeur mobile front-end (stage)',
        org: 'Inoteqia',
        note: 'Front end Flutter d’une DApp d’échange de véhicules, déployée sur testnet.',
      },
      {
        kind: 'education',
        period: '2019 – 2024',
        title: 'Diplôme d’ingénieur en génie logiciel full-stack',
        org: 'ESPRIT',
        note: 'Spécialité développement mobile.',
      },
    ],
  },
  contact: {
    prompt: './contact.sh',
    title: 'Construisons quelque chose.',
    windowTitle: '~/contact.sh',
    body: 'Ouvert aux postes full-stack et frontend en Tunisie et en Europe, en remote ou en hybride.',
    email: 'contact@mohameddhia.dev',
    form: {
      label: 'Formulaire de contact',
      labels: { name: 'nom\u00a0:', email: 'email\u00a0:', message: 'message\u00a0:' },
      requiredNote: 'Tous les champs sont obligatoires.',
      honeypotLabel: 'Laissez ce champ vide',
      submit: 'Envoyer le message',
      sending: 'Envoi…',
      summaryTitle: 'Merci de corriger les points suivants\u00a0:',
      errors: {
        name: {
          required: 'Indiquez votre nom.',
          too_short: 'Votre nom doit compter au moins 2 caractères.',
          too_long: 'Votre nom doit compter moins de 100 caractères.',
          invalid: 'Indiquez votre nom.',
        },
        email: {
          required: 'Indiquez votre adresse email.',
          too_short: 'Indiquez une adresse email valide, par exemple nom@exemple.com.',
          too_long: 'Indiquez une adresse email valide, par exemple nom@exemple.com.',
          invalid: 'Indiquez une adresse email valide, par exemple nom@exemple.com.',
        },
        message: {
          required: 'Écrivez votre message.',
          too_short: 'Votre message doit compter au moins 10 caractères.',
          too_long: 'Votre message doit compter moins de 5\u202f000 caractères.',
          invalid: 'Écrivez votre message.',
        },
      },
      success: {
        title: 'Message envoyé.',
        body: 'Merci pour votre message. Je vous répondrai à l’adresse email indiquée.',
        again: 'Envoyer un autre message',
      },
      failure: {
        generic:
          'Votre message n’a pas été envoyé. Réessayez, ou écrivez-moi à contact@mohameddhia.dev.',
        rateLimited:
          'Trop de messages en peu de temps. Réessayez dans quelques minutes, ou écrivez-moi à contact@mohameddhia.dev.',
      },
    },
  },
};
