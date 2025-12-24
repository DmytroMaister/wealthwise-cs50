import { IconButton } from '@mui/material';
import { DeleteForever, Edit } from '@mui/icons-material';
import { type GridColDef } from '@mui/x-data-grid';
import type { Expense } from './Expenses.types';

// Columns configuration for expenses DataGrid
export const expensesHeader = (
  handleDelete: (id: number) => void,
  handleEdit: (row: Expense) => void
): GridColDef[] => {
  return [
    { field: 'spent_at', headerName: 'Date', flex: 1, minWidth: 120 },
    { field: 'category', headerName: 'Category', flex: 1, minWidth: 140 },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 200,
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      flex: 1,
      minWidth: 120,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value) => `$${Number(value).toFixed(2)}`,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      flex: 1,
      minWidth: 140,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <div>
          {/* Edit expense */}
          <IconButton
            size="small"
            className="expense-edit-btn"
            onClick={() => handleEdit(params.row)}
          >
            <Edit />
          </IconButton>

          {/* Delete expense */}
          <IconButton
            size="small"
            className="expense-delete-btn"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteForever />
          </IconButton>
        </div>
      ),
    },
  ];
};
