"use client";

// Material UI
import { Box, Button, Divider, Paper } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef, GridRowSelectionModel, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { useDialogs } from '@toolpad/core/useDialogs';
//React & Next
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useMessages } from "next-intl";
import { useRouter } from "next/navigation";
//Axios
import axios from 'axios';

import { UserSession } from "@/types/UserSession";
import { checkUserSession, getSession } from "@/helpers/userSession";

// Define the columns for the datagrid
function getDatagridColumns(t: any) {
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
            field: 'accountType', 
            headerName: t.datagrid.columns.types, 
            width: 130
        },
        {
            field: 'initialAmount',
            headerName: t.datagrid.columns.initialAmount,
            width: 150,
        },
    ], [t]) as GridColDef[];
}


export default function ListAccountPage(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
    //Get translations
    const messages = useMessages();

    //Translate the page components
    const t = useMemo(() => (messages as any).Pages.AccountList, [messages]);

    // Translate the datagrid components
    const configs = useMemo(() => (messages as any).Configs, [messages]);
    const translationForDatagrid = useMemo(() => configs.Datagrid, [configs]);
    const translationForPagination = useMemo(() => configs.DatagridPagination, [configs]);

    //Get the user session
    const [session, setSession] = useState<UserSession | null>(null);

    
    //Create a dialog instance
    const dialogs = useDialogs();

    //Get the router instance
    const router = useRouter();

    useEffect(() => {
        if(!checkUserSession()){
            router.push(`/${locale}/`);
        }
        setSession(getSession());
    }, []);


    //Sample data
    // const [rows, setRows] = useState([
    //     { id: 1, name: 'Nu Bank', accountType: 'Chequing', initialAmount: '$ 495.000,01' },
    //     { id: 2, name: 'Simply', accountType: 'Chequing', initialAmount: '$ 496.000,01' },
    //     { id: 3, name: 'CIBC', accountType: 'GIC', initialAmount: '$ 494.000,01' },
    //     { id: 4, name: 'Simply', accountType: 'Credit Card', initialAmount: '$ 492.000,01' },
    //     { id: 5, name: 'Simply', accountType: 'Credit Card', initialAmount: '$ 492.000,01' },
    //     { id: 6, name: 'Simply', accountType: 'Credit Card', initialAmount: '$ 492.000,01' },
    //     { id: 7, name: 'Simply', accountType: 'Credit Card', initialAmount: '$ 492.000,01' },
    // ]);

    const [rows, setRows] = useState<GridRowSelectionModel>([]);

    
    useEffect(() => {
        const fetchAccounts = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/Accounts/user/${session?.uid}`);
            const accounts = response.data.map((account: any) => ({
                id: account.id,
                name: account.name,
                accountType: account.accountType.type,
                initialAmount: new Intl.NumberFormat(locale, { style: 'currency', currency: configs.Currency.name }).format(account.initialAmount)
            }));
            setRows(accounts);
        } catch (error) {
            console.error('Error fetching accounts:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        }
        };
    
        fetchAccounts();
    }, [session, locale, configs]);

    // Save selected rows
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    // Get datagrid columns
    const columns = getDatagridColumns(t);

    // Handle add account
    const handleAddAccount = useCallback(() => {
        // Redirect to the new account page
        router?.push(`/${locale}/app/accounts/new`);
    }, [router, locale]);


    // Handle delete account
    const handleDeleteAccount = useCallback(async () => {
        // Show a confirmation dialog
        const confirmed = await dialogs.confirm(t.alerts.delete.message, {
            title: t.alerts.delete.title,
            okText: t.alerts.delete.delete,
            cancelText: t.alerts.delete.cancel,
        });

        if (confirmed) { 
            try {
                // Make DELETE request to the server
                await axios.delete('/api/accounts', {
                    data: { ids: rowSelectionModel }
                });

                // Remove the selected rows from the local state
                setRows((prevRows) => prevRows.filter((row: any) => !rowSelectionModel.includes(row.id)));
            } catch (error) {
                console.error('Erro ao deletar contas:', error);
            }
        }
    }, [dialogs, rowSelectionModel, t]);

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer>
        );
    }

    return (
        <Box>
            <h1>{t.title}</h1>
            <Divider sx={{marginBottom:3}}/>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleAddAccount}
                    startIcon={<AddIcon />}
                >
                    Nova Conta
                </Button>
                <Button
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={handleDeleteAccount}
                    disabled={rowSelectionModel.length === 0}
                >
                    Excluir Conta
                </Button>
            </Box>
            <Paper sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    localeText={translationForDatagrid}
                    pagination
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                    checkboxSelection
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                    }}
                    rowSelectionModel={rowSelectionModel}
                    sx={{ border: 0 }}
                    slotProps={translationForPagination}
                />
            </Paper>
        </Box>
    );
}