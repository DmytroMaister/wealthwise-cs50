import type { ReactNode } from 'react';

export interface WiseDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  fullWidth?: boolean;
}
