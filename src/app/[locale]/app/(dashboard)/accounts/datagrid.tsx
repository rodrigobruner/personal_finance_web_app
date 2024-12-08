import { useMemo } from 'react';
import { GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdjustIcon from '@mui/icons-material/Adjust';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';



// Define the columns for the datagrid
export default function getDatagridColumns({
    t, editAction, deleteAction}: { 
        t: any, 
        editAction: (id: number) => void, 
        deleteAction: (id: number) => void }) {
        
    // Define the status icon
    const statusIcon = (status: string) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'  }}>
                {status === 'Active' ? <RemoveRedEyeIcon color="success" /> : <VisibilityOffIcon color="error" />}
            </div>
        );
    };

    // Define the format color
    const formatColor = (value: number) => {
        return (
            <div style={{ color: value.toString()[0] === '-' ? 'red' : 'green' }}>
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
            maxWidth: 50,
        },
        { 
            field: 'name', 
            headerName: t.datagrid.columns.accountName, 
            minWidth: 150
        },
        { 
            field: 'accountType', 
            headerName: t.datagrid.columns.types, 
            minWidth: 150
        },
        {
            field: 'initialAmount',
            headerName: t.datagrid.columns.initialAmount,
            minWidth: 130

        },
        {
            field: 'updatedAmount',
            headerName: t.datagrid.columns.updatedAmount,
            renderCell: (params) => formatColor(params.value),
            minWidth: 130
        },
        {
            field: 'status',
            headerName: t.datagrid.columns.status,
            minWidth: 50,
            renderCell: (params) => statusIcon(params.value),
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
                    icon={<AdjustIcon />}
                    label="Delete"
                    onClick={() => deleteAction(Number(id))}
                    color="inherit"
                    />,
                ];
            },
        },
    ], [t, editAction, deleteAction]) as GridColDef[];
}
