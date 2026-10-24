import type { NotFoundContent } from '../types';

export const notFound: NotFoundContent = {
  meta: {
    title: 'Page introuvable · Mohamed Dhia Ben Amar',
    description: 'Cette page n’existe pas.',
  },
  prompt: 'cd',
  title: 'Page introuvable',
  body: 'La page que vous cherchez n’existe pas ou a été déplacée.',
  terminal: { title: 'mohamed@tunis — zsh', error: 'zsh: command not found' },
  links: [
    { label: 'cd ~', fragment: undefined },
    { label: 'ls ~/featured-work', fragment: 'work' },
    { label: './contact.sh', fragment: 'contact' },
  ],
};
