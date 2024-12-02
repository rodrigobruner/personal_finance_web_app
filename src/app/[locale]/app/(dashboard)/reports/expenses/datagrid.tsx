// React & Next
import { useMemo } from 'react';
//Material UI
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
            <span style={{ color: 'red' }}>{value}</span>
        );
    };
        
    //Return the columns
    return useMemo(() => [
        { 
            field: 'id', 
            headerName: t.datagrid.columns.id, 
            type: 'number',
            width: 50,
            align: 'center'
        },
        { 
            field: 'from', 
            headerName: t.datagrid.columns.from, 
            width: 150
        },
        { 
            field: 'to', 
            headerName: t.datagrid.columns.to, 
            width: 150
        },
        { 
            field: 'amount', 
            headerName: t.datagrid.columns.amount, 
            renderCell: (params) => formatColor(params.value),
            width: 100
        },
        {
            field: 'date',
            headerName: t.datagrid.columns.date,
            width: 100
        },
        {
            field: 'description',
            headerName: t.datagrid.columns.description,
            width: 400
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