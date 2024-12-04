import { useMemo } from 'react';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Define the columns for the datagrid
export default function getDatagridColumns({
    t, editAction, deleteAction}: { 
        t: any, 
        editAction: (id: number) => void, 
        deleteAction: (id: number) => void }) {

    // Format the color of the category type
    const formatColor = (value: string) => {
        return (
            <div style={{ color: value.toUpperCase() == 'EXPENSE' ? 'red' : 'green' }}>
                {value}
            </div>
        );
    };

    // Return the columns
    return useMemo(() => [
        { 
            field: 'id', 
            headerName: t.datagrid.columns.id, 
            type: 'number',
            width: 70,
            align: 'center'
        },
        { 
            field: 'name', 
            headerName: t.datagrid.columns.accountName, 
            width: 200
        },
        { 
            field: 'categoryType', 
            headerName: t.datagrid.columns.categoryType, 
            renderCell: (params) => formatColor(params.value),
            width: 200
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    className="textPrimary"
                    onClick={() => editAction(Number(id))}
                    color="inherit"
                    />,
                    <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => deleteAction(Number(id))}
                    color="inherit"
                    />,
                ];
            },
        },
    ], [t]) as GridColDef[];
}