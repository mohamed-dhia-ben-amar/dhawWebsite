import type { NotFoundContent } from '../types';

export const notFound: NotFoundContent = {
  meta: {
    title: 'Page not found · Mohamed Dhia Ben Amar',
    description: 'This page does not exist.',
  },
  prompt: 'cd',
  title: 'Page not found',
  body: 'The page you are looking for does not exist or has moved.',
  terminal: { title: 'mohamed@tunis — zsh', error: 'zsh: command not found' },
  links: [
    { label: 'cd ~', fragment: undefined },
    { label: 'ls ~/featured-work', fragment: 'work' },
    { label: './contact.sh', fragment: 'contact' },
  ],
};
