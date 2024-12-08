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

    //Format the color of the amount
    const formatColor = (value: number) => {
        return (
            <span style={{ color: 'blue' }}>{value}</span>
        );
    };

    //Return the columns
    return useMemo(() => [
        { 
            field: 'id', 
            headerName: t.datagrid.columns.id, 
            type: 'number',
            maxWidth: 50,
        },
        { 
            field: 'fromAccount', 
            headerName: t.datagrid.columns.from, 
            minWidth: 150,

        },
        { 
            field: 'toAccount', 
            headerName: t.datagrid.columns.to,
            minWidth: 150,

        },
        { 
            field: 'amount', 
            headerName: t.datagrid.columns.amount, 
            renderCell: (params) => formatColor(params.value),
            minWidth: 110,

        },
        {
            field: 'date',
            headerName: t.datagrid.columns.date,
            minWidth: 110,

        },
        {
            field: 'description',
            headerName: t.datagrid.columns.description,
            minWidth: 130,

        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',

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