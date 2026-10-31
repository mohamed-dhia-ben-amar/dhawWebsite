// Token reference for the internal styleguide. Component demos use the real homepage content.

import type { TerminalEntry } from '../../../content/types';

/** Token values per theme (src/styles/_tokens.scss); the chips show the theme on screen. */
export const swatches: readonly { token: string; dark: string; light: string }[] = [
  { token: '--bg', dark: '#0E1A2B', light: '#F4F6F9' },
  { token: '--surface', dark: '#14233A', light: '#FFFFFF' },
  { token: '--surface-2', dark: '#172840', light: '#F9FAFC' },
  { token: '--surface-sunken', dark: '#0B1624', light: '#EDF1F6' },
  { token: '--surface-raised', dark: '#1B2D47', light: '#E3E9F1' },
  { token: '--border', dark: '#22354F', light: '#D5DDE7' },
  { token: '--border-strong', dark: '#2C4260', light: '#C3CFDD' },
  { token: '--decor', dark: '#3A5070', light: '#A9B6C7' },
  { token: '--text', dark: '#D9E1EC', light: '#1B2A3F' },
  { token: '--text-strong', dark: '#F1F5FA', light: '#0E1A2B' },
  { token: '--text-muted', dark: '#A3B2C6', light: '#3E4F67' },
  { token: '--text-faint', dark: '#8696AD', light: '#56677F' },
  { token: '--line-number', dark: '#4E6380', light: '#8A98AB' },
  { token: '--accent', dark: '#F2B640', light: '#8F5B00' },
  { token: '--accent-2', dark: '#86C8E8', light: '#1D5F8A' },
];

/** TerminalSession demo (the hero used it before its live config). */
export const terminal: readonly TerminalEntry[] = [
  { command: 'whoami', output: 'Mohamed Dhia Ben Amar' },
  { command: 'cat role.txt', output: 'Full-Stack Software Engineer' },
  { command: 'echo $STACK', output: 'Angular · Nx · TypeScript · Node.js · React' },
  { command: 'status', output: 'available for new roles', status: true },
];
