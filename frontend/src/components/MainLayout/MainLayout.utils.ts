import { links } from '../../utils/links';
import type { MenuButton } from './MainLayout.types';

export const menuButtons: MenuButton[] = [
  {
    label: 'Home',
    path: links.home,
  },
  {
    label: 'Expenses',
    path: links.expenses,
  },
  {
    label: 'Stats',
    path: links.stats,
  },
  {
    label: 'Profile',
    path: links.profile,
  },
];
