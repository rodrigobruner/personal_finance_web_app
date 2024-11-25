"use client";
//React & Next
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import { useMessages } from "next-intl";
//Material UI
import CategoryIcon from '@mui/icons-material/Category';

//Types, components and helpers
import { UserSession } from "@/types/UserSession";
import { checkUserSession, getSession } from "@/helpers/userSession";
import Loading from "@/components/Layout/loading";
import { Button, Divider, Paper } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, GridRowModes, GridRowModesModel, GridRowSelectionModel, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import getDatagridColumns from "./datagrid";
import axios from "axios";
import { useDialogs } from "@toolpad/core/useDialogs";
import { AddButton } from "@/components/Layout/Datagrid/addButton";


export default function IndexPage(
    { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
    //Loading
    const [loading, setLoading] = useState(true);

    //Get translations
    const messages = useMessages();

    //Translate the page components
    const t = useMemo(() => (messages as any).Pages.CategoryList, [messages]);

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



    interface CategoryRow {
        id: number;
        name: string;
        categoryType: string;
    }

    // Fetch all categories
    const [rows, setRows] = useState<CategoryRow[]>([]);

    const fetchAll = async (): Promise<void> => {
        try {
            if (!session) return;
            const response = await axios.get(`http://localhost:8080/Categories/user/${session?.uid}`);
            const categories = response.data.map((category: any) => ({
                id: category.id,
                name: category.name,
                categoryType: category.categoryType,
            }));
            setRows(categories);
        } catch (error) {
            console.error('Error insert:', error);
            if (axios.isAxiosError(error) && error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {        
        fetchAll();
    }, [session, locale, configs]);


    // Save selected rows
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);


    // Handle add account
    const handleAddButton = useCallback(() => {
        // Redirect to the new account page
        router?.push(`/${locale}/app/categories/form/0`);
    }, [router, locale]);

    // Handle edit account
    const handleEditButton = useCallback((id: number) => {
        // Redirect to the edit account page
        router?.push(`/${locale}/app/categories/form/${id}`);
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
                await axios.delete(`http://localhost:8080/Categories/${id}`);
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
    const CustomToolbar = () => {
        return <AddButton onClick={handleAddButton} text={t.datagrid.actions.edit} />;
    };

    //Loading
    if (loading) {
        return (<Loading />);
    }
    
    //Render the page
    return (
        <div>
            <h1><CategoryIcon /> { t.title }</h1>

            <Divider sx={{margin:"20px"}} />

            <Paper sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                    localeText={translationForDatagrid}
                    pagination
                    rowSelectionModel={rowSelectionModel}
                    sx={{ border: 0 }}
                    slotProps={translationForPagination}
                />
            </Paper>

        </div>
    );
}

