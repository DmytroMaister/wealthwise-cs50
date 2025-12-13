import type { ReactNode } from 'react';
import type { User } from '../../types/commonTypes';

export type MainLayoutProps = {
  user: User;
  onLogout: () => void;
  children: ReactNode;
};
