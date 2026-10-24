// Demo data for the internal styleguide only. Facts come from docs/PORTFOLIO_BRIEF.md;
// the real homepage copy moves into src/content in milestone 3.
import type { Stat } from '../../ui/stat-strip/stat-strip';
import type { ProjectStat } from '../../ui/project-card/project-card';
import { jsonToCodeLines } from '../../ui/code-view/code-line';

export const swatches: readonly { token: string; value: string }[] = [
  { token: '--bg', value: '#0A0A0B' },
  { token: '--surface', value: '#111113' },
  { token: '--surface-2', value: '#141416' },
  { token: '--surface-sunken', value: '#0D0D0F' },
  { token: '--surface-raised', value: '#18181B' },
  { token: '--border', value: '#1C1C20' },
  { token: '--border-strong', value: '#27272A' },
  { token: '--decor', value: '#3F3F46' },
  { token: '--text', value: '#D4D4D8' },
  { token: '--text-strong', value: '#F4F4F5' },
  { token: '--text-muted', value: '#A1A1AA' },
  { token: '--text-faint', value: '#82828B' },
  { token: '--line-number', value: '#52525B' },
  { token: '--accent', value: '#C6F432' },
  { token: '--warm', value: '#FDBA74' },
];

export const terminalLines: readonly { command: string; output: string; warm?: boolean }[] = [
  { command: 'whoami', output: 'Mohamed Dhia Ben Amar' },
  { command: 'cat role.txt', output: 'Full-Stack Software Engineer' },
  { command: 'echo $STACK', output: 'Angular · Nx · TypeScript · Node.js · React' },
  { command: 'status', output: 'available for new roles', warm: true },
];

export const stats: readonly Stat[] = [
  { value: '76', caption: 'reusable widgets across 8 projects' },
  { value: '~9,000', caption: 'unit tests, 80–96% coverage' },
  { value: '4 days', caption: 'widget delivery, down from 1–2 weeks' },
  { value: '10k+', caption: 'downloads on the Converty Shop app' },
];

export const projects: readonly {
  title: string;
  summary: string;
  file: string;
  stack: string;
  stats: readonly ProjectStat[];
}[] = [
  {
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
];

export const explorerFiles = ['minotore.json', 'converty.json', 'ibspace.json', 'inoteqia.json'];

export const minotoreLines = jsonToCodeLines(
  {
    role: 'Frontend Developer',
    company: 'Minotore',
    industry: 'Market finance',
    period: 'Dec 2024 – present',
    highlights: [
      '76 widgets shared across 8 projects',
      'Angular 18 → 21 / Nx 22 migration, 3 developers',
      'Tech lead, NOVA: AI-assisted dev workflow',
    ],
  },
  { dateKeys: ['period'] },
);
