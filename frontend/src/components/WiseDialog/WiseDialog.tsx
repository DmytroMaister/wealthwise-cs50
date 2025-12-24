import type { FC } from 'react';
import { DialogTitle, Dialog } from '@mui/material';
import type { WiseDialogProps } from './WiseDialog.types';

export const WiseDialog: FC<WiseDialogProps> = ({
  open,
  onClose,
  title,
  children,
  fullWidth,
}) => (
  <Dialog open={open} onClose={onClose} fullWidth={fullWidth}>
    <DialogTitle>{title}</DialogTitle>
    {children}
  </Dialog>
);
