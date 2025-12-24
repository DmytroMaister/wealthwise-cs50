import type { ReactNode } from 'react';
import type { User } from '../../types/commonTypes';

export type MainLayoutProps = {
  user: User;
  onLogout: () => void;
  children: ReactNode;
};

export interface MenuButton {
  label: string;
  path: string;
}
