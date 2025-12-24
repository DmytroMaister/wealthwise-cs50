import type { GridColDef, GridRowsProp } from '@mui/x-data-grid';

export interface WiseDataGridProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  loading?: boolean;
  noRowsLabel?: string;
}
