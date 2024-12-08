"use client";

//React & Next
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useMessages } from "next-intl";
import { useRouter } from "next/navigation";
// Material UI
import { Box, Divider, Paper } from "@mui/material";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import { useDialogs } from '@toolpad/core/useDialogs';
//Othes
import axios from 'axios';
//Types and helpers
import { UserSession } from "@/types/UserSession";
import { checkUserSession, getSession } from "@/helpers/userSession";
import Loading from "@/components/Layout/loading";
import { AddButton } from "@/components/Layout/Datagrid/addButton";
import getDatagridColumns from "./datagrid";
import appConfig from "@/config";


export default function ListAccountPage(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {

    //App Config
    const config = useMemo(() => appConfig, []);

    //Loading
    const [loading, setLoading] = React.useState(true);

    //Get translations
    const messages = useMessages();

    //Translate the page components
    const t = useMemo(() => (messages as any).Pages.AccountList, [messages]);

    // Translate the datagrid components
    const configs = useMemo(() => (messages as any).Configs, [messages]);
    const translationForDatagrid = useMemo(() => configs.Datagrid, [configs]);
    const translationForPagination = useMemo(() => configs.DatagridPagination, [configs]);

    //Create a dialog instance
    const dialogs = useDialogs();

    //Get the router instance
    const router = useRouter();

    //Get the user session
    const [session, setSession] = useState<UserSession | null>(null);

    //Check if the user is logged in
    useEffect(() => {
        fetchAll();
        if(!checkUserSession()){
            router.push(`/${locale}/`);
        }
        setSession(getSession());
    }, []);

    // Fetch accounts
    interface AccountRow {
        id: number;
        name: string;
        accountType: string;
        status: string;
        initialAmount: string;
        updatedAmount: string;
    }

    // Fetch all accounts
    const [rows, setRows] = useState<AccountRow[]>([]);

    // create a function to fetch all accounts
    const fetchAll = async () => {
        try {
            if (!session) return; // No session, no fetch
            // Fetch accounts
            const response = await axios.get(`${config.api.url}/Accounts/user/${session?.uid}`);
            // Map the response data to the rows state
            const accounts = response.data.map((account: any) => ({
                id: account.id,
                name: account.name,
                accountType: account.accountType.type,
                status: account.status,
                initialAmount: new Intl.NumberFormat(locale, { style: 'currency', currency: configs.Currency.name }).format(account.initialAmount),
                updatedAmount: new Intl.NumberFormat(locale, { style: 'currency', currency: configs.Currency.name }).format(account.updatedAmount)
            }));
            setRows(accounts);
        } catch (error) {
            // Log the error
            console.error('Error fetching accounts:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        } finally {
            // Stop loading
            setLoading(false);
        }
    };

    useEffect(() => {        
        fetchAll(); // Fetch accounts
    }, [session, locale, configs]);

    // Save selected rows
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

    // Handle add account
    const handleAddButton = useCallback(() => {
        // Redirect to the new account page
        router?.push(`/${locale}/app/accounts/form/0`);
    }, [router, locale]);

    // Handle edit account
    const handleEditButton = useCallback((id: number) => {
        // Redirect to the edit account page
        router?.push(`/${locale}/app/accounts/form/${id}`);
    }, [router, locale]);

    // Handle delete account
    const handleDeleteButton = useCallback(async (id: number) => {
    
        // Find the account in the rows array
        const account = rows.find(row => row.id === id);    

        // Show a confirmation dialog
        const confirmed = await dialogs.confirm(t.alerts.updateStatus.message, {
            title: t.alerts.updateStatus.title,
            okText: t.alerts.updateStatus.delete,
            cancelText: t.alerts.updateStatus.cancel,
        });
    
        // If the user did not confirm, do nothing
        if (!confirmed) {
            return;
        }

        // If the account is found
        if (account) {
            // Update the account status
            const data = {
                status: account.status === 'Active' ? 'Inactive' : 'Active'
            }
            // send for api to update the account status
            await axios.put(`${config.api.url}/Accounts/${id}/status`, data);
            fetchAll();
        } else {
            console.error('Account not found');
        }
    }, [dialogs, t, rows]);

    // Get datagrid columns
    const columns = getDatagridColumns({ t, editAction: handleEditButton, deleteAction: handleDeleteButton });
    // Custom toolbar
    const CustomToolbar = () => {
        return <AddButton onClick={handleAddButton} text={t.datagrid.actions.edit} />;
    };

    // If loading, show loading component
    if (loading) {
        return (<Loading />);
    }

    // If not loading, show the page with datagrid
    return (
        <Box sx={{ width: '100%', padding: '5px' }} >
            <h1><AccountBalanceIcon /> { t.title }</h1>
            <Divider sx={{marginBottom:3}}/>
            <Paper sx={{ width: { xs: '42%', sm: '87%', md: '100%' } }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    localeText={translationForDatagrid}
                    pagination
                    slots={{
                        toolbar: CustomToolbar,
                    }}
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