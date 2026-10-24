import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Mohamed Dhia Ben Amar',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    // Internal component showcase (noindex). Revisit in milestone 9.
    path: 'styleguide',
    title: 'Styleguide · mdba',
    loadComponent: () => import('./pages/styleguide/styleguide').then((m) => m.Styleguide),
  },
];
