"use client";
//React & Next
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import { useMessages } from "next-intl";
//Material UI
import DescriptionIcon from '@mui/icons-material/Description';
//Types, components and helpers
import { UserSession } from "@/types/UserSession";
import { checkUserSession, getSession } from "@/helpers/userSession";
import Loading from "@/components/Layout/loading";
import { useDialogs } from "@toolpad/core/useDialogs";
import axios from "axios";
import getDatagridColumns from "./datagrid";
import { AddButton } from "@/components/Layout/Datagrid/addButton";
import { Box, Divider, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";


export default function TransferListPage(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
    //Loading
    const [loading, setLoading] = useState(true);

    //Get translations
    const messages = useMessages();

    //Translate the page components
    const t = useMemo(() => (messages as any).Pages.TransferReport, [messages]);

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
        if(!checkUserSession()){
            router.push(`/${locale}/`);
        }
        setSession(getSession());
    }, []);


    //Define the row interface
    interface Row {
        id: number;
        fromAccount: string;
        toAccount: string;
        amount: string;
        date: string;
        description: string;
    }

    //Define the rows state
    const [rows, setRows] = useState<Row[]>([]);

    //Fetch all the transfers method
    const fetchAll = async (): Promise<void> => {
        try {
            //Get all the transfers from the API
            const response = await axios.get(`http://localhost:8080/Transfers/user/${session?.uid}`);
            //Map the transfers to the rows state
            const transfers = response.data.map((transfer: any) => ({
                id: transfer.id,
                fromAccount: transfer.fromAccount.name,
                toAccount: transfer.toAccount.name,
                amount: new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(transfer.value),
                date: transfer.date,
                description: transfer.notes,
            }));
            //Set the rows state
            setRows(transfers);
        } catch (error) {
            //Handle the error
            console.error('Error insert:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        } finally {
            //Stop the loading
            setLoading(false);
        }
    };

    //Fetch all the transfers
    useEffect(() => {        
        fetchAll();
    }, [session, locale, configs]);

    // Handle add account
    const handleAddButton = useCallback(() => {
        // Redirect to the new account page
        router?.push(`/${locale}/app/reports/transfers/form/0`);
    }, [router, locale]);

    // Handle edit account
    const handleEditButton = useCallback((id: number) => {
        // Redirect to the edit account page
        router?.push(`/${locale}/app/reports/transfers/form/${id}`);
    }, [router, locale]);

    // Handle delete 
    const handleDeleteButton = useCallback(async (id: number) => {

        // Show a confirmation dialog
        const confirmed = await dialogs.confirm(t.alerts.delete.message, {
            title: t.alerts.delete.title,
            okText: t.alerts.delete.delete,
            cancelText: t.alerts.delete.cancel,
        });

        if (!confirmed) {
            return;
        }

        if (id) {
            try{
                //Delete the category through the API
                await axios.delete(`http://localhost:8080/Transfers/${id}`);
                //Remove the row from the datagrid
                setRows(prevRows => prevRows.filter(row => row.id !== id));
                //Fetch all the categories again
                fetchAll();
            } catch (error) {
                console.error('Error delete:', error);
                if (axios.isAxiosError(error) && error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                }
            }
        } else {
            console.error('Category not found');
        }
    }, [dialogs, t, rows]);

    // Get datagrid columns
    const columns = getDatagridColumns({ t, editAction: handleEditButton, deleteAction: handleDeleteButton });
    // Add the custom toolbar
    const CustomToolbar = () => {
        return <AddButton onClick={handleAddButton} text={t.datagrid.actions.edit} />;
    };

    //Loading
    if (loading) {
        return (<Loading />);
    }
    
    //Render the page
    return (
        <Box>
            <h1><DescriptionIcon /> { t.title }</h1>

            <Divider sx={{margin:"20px"}} />

            <Paper sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    localeText={translationForDatagrid}
                    pagination
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                    sx={{ border: 0 }}
                    slotProps={translationForPagination}
                />
            </Paper>

        </Box>
    );
}