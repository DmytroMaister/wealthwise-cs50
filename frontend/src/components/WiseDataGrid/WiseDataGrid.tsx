import { Paper } from '@mui/material';
import type { FC } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { WiseDataGridProps } from './WiseDataGrid.types';
import './WiseDataGrid.css';

export const WiseDataGrid: FC<WiseDataGridProps> = ({
  rows,
  columns,
  loading = false,
  noRowsLabel = 'No rows',
}: WiseDataGridProps) => {
  return (
    <Paper className="wise-grid">
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        autoHeight
        hideFooter
        localeText={{ noRowsLabel }}
      />
    </Paper>
  );
};
