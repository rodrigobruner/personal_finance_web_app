"use client";
//React & Next
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import { useMessages } from "next-intl";
//Material UI
import { useDialogs } from "@toolpad/core/useDialogs";
import getDatagridColumns from "./datagrid";
import { Box, Divider, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
//Axios
import axios from "axios";
//Types, components and helpers
import { UserSession } from "@/types/UserSession";
import { checkUserSession, getSession } from "@/helpers/userSession";
import Loading from "@/components/Layout/loading";
import { AddButton } from "@/components/Layout/Datagrid/addButton";
import appConfig from "@/config";
import { MdOutlineReceipt } from "react-icons/md";

//Define the row interface
interface Row {
    id: number;
    fromAccount: string;
    toAccount: string;
    amount: string;
    date: string;
    description: string;
}

export default function IncomeListPage(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
    //App Config
    const config = useMemo(() => appConfig, []);

    //Loading
    const [loading, setLoading] = useState(true);

    //Get translations
    const messages = useMessages();

    //Translate the page components
    const t = useMemo(() => (messages as any).Pages.ExpensesReport, [messages]);

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

    //Define the rows state
    const [rows, setRows] = useState<Row[]>([]);

    //Fetch all the incomes method
    const fetchAll = async (): Promise<void> => {
        try {
            //Get the incomes from the API
            if (!session) return;
            //Get the incomes from the API
            const response = await axios.get(`${config.api.url}/Transactions/user/${session?.uid}/category/Expense`);
            //Map the incomes to the rows state
            const incomes = response.data.map((data: any) => ({
                id: data.id,
                from: data.category.name,
                to: data.account.name,
                amount: new Intl.NumberFormat(locale, { style: 'currency', currency: configs.Currency.name}).format(data.value),
                date: data.date,
                description: data.notes,
            }));
            //Set the rows state
            setRows(incomes);
        } catch (error) {
            //Log the error
            console.error('Error insert:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        } finally {
            //Set loading to false
            setLoading(false);
        }
    };


    //Fetch all the incomes
    useEffect(() => {        
        fetchAll();
    }, [session, locale, configs]);

    // Handle add account
    const handleAddButton = useCallback(() => {
        // Redirect to the new account page
        router?.push(`/${locale}/app/reports/expenses/form/0`);
    }, [router, locale]);

    // Handle edit account
    const handleEditButton = useCallback((id: number) => {
        // Redirect to the edit account page
        router?.push(`/${locale}/app/reports/expenses/form/${id}`);
    }, [router, locale]);

    // Handle delete 
    const handleDeleteButton = useCallback(async (id: number) => {

        // Show a confirmation dialog
        const confirmed = await dialogs.confirm(t.alerts.delete.message, {
            title: t.alerts.delete.title,
            okText: t.alerts.delete.delete,
            cancelText: t.alerts.delete.cancel,
        });

        // If the user not confirmed the action, abort the operation
        if (!confirmed) {
            return;
        }

        if (id) {
            try{
                //Delete the category through the API
                await axios.delete(`${config.api.url}/Transactions/${id}`);
                //Remove the row from the datagrid
                setRows(prevRows => prevRows.filter(row => row.id !== id));
                //Fetch all the categories again
                fetchAll();
            } catch (error) {
                //Log the error
                console.error('Error delete:', error);
                if (axios.isAxiosError(error) && error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                }
            }
        } else {
            //Log the error
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
        <Box sx={{ width: '100%', padding: '5px' }} >
            <h1><MdOutlineReceipt /> { t.title }</h1>
            <Divider sx={{margin:"20px"}} />
            <Paper sx={{ width: { xs: '42%', sm: '87%', md: '100%' } }}>
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